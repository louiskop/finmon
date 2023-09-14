// imports
var Imap = require("imap");
var inspect = require("util").inspect;
var { htmlToText } = require("html-to-text");
const emailpassword = require("./dbconfig");

// array to store messages
var msgList = [];

// create imap object
var imap = new Imap({
  user: "louisbankingsms@gmail.com",
  password: emailpassword,
  host: "imap.gmail.com",
  port: 993,
  tls: true,
  tlsOptions: {
    rejectUnauthorized: false,
  },
});

// open inbox function
function openInbox(cb) {
  imap.openBox("INBOX", false, cb);
}

// on ready
imap.on("ready", function () {
  console.log("[+] IMAP MODULE STARTED & READY");

  // read emails
  openInbox((err, box) => {
    if (err) {
      console.log("[!] Error reading mailbox: " + err);
      imap.end();
    } else {
      imap.search(["UNSEEN"], (err, results) => {
        var toFetch = results;

        // fetch all unread messages
        try {
          var f = imap.fetch(toFetch, {
            bodies: ["HEADER.FIELDS (FROM TO SUBJECT DATE)", "TEXT"],
            struct: true,
            markSeen: true,
          });
        } catch (e) {
          console.log("fetch cancelled , nothing to fetch");
          imap.end();
          return;
        }

        // ImapFetch object emits 'message' for each message processed
        // msg is a ImapMessage object and seqno is sequence number
        f.on("message", function (msg, seqno) {
          //console.log("\t[+] Message #%d begin read ... ", seqno);

          // create a prefix for future printing
          var prefix = "(#" + seqno + ")";

          // ImapMessage emits "body" when requesting the body of the message specefied in ImapFetch (FOR EACH SPECEFIED BODY)
          // stream = a readable stream of the body specefied
          // info.which = the current body being processed
          msg.on("body", function (stream, info) {
            // read the buffer
            var buffer = "";

            // ReadableStream emits data for each chunk read
            stream.on("data", function (chunk) {
              buffer += chunk;
            });

            // ReadableStream is done
            stream.on("end", function () {
              if (info.which == "TEXT") {
                processMsg(buffer.toString("utf8"));
              } else {
                //console.log(
                //  prefix + "Parsed header: %s",
                //  inspect(Imap.parseHeader(buffer))
                //);
              }
            });
          });

          // ImapMessage emits "attributes" when requesting the attrs of the message
          msg.on("attributes", function (attrs) {
            //console.log(prefix + "Attributes: %s", inspect(attrs, false, 8));
            // mark the message as read
            const { uid } = attrs;
            imap.addFlags(uid, ["\\Seen"], (err) => {
              console.log("[+] Email marked as seen or " + err);
            });
          });

          // ImapMessage emits "end" when finished with message processing
          msg.on("end", function () {
            //console.log(prefix + " finished !");
          });
        });

        // ImapFetch error
        f.on("error", function (err) {
          console.log("[!] IMAPFETCH ERROR: " + err);
        });

        // ImapFetch done
        f.on("end", function () {
          console.log("[+] IMAPFETCH is done ... signalling imap");
          imap.end();
        });
      });
    }
  });
});

// on error
imap.on("error", function (err) {
  console.log("[!] IMAP ERROR : " + err);
});

// on terminate
imap.on("end", function () {
  console.log("[+] IMAP CONNECTION CLOSED");
});

// process the message
function processMsg(msg) {
  msgObject = {
    beneficiaryCode: "",
    type: "",
    amount: 0,
    date: null,
    balance: 0,
  };

  msg = msg.split("Message:")[1].trimStart();
  msg = msg.replaceAll("=", "");
  msg = msg.replace(/[\r\n]/gm, "");

  // check if banking message
  if (msg.substring(0, 14) == "Absa: CHEQ7420") {
    // deposit (inc)
    if (msg.substring(16, 19) == "Dep") {
      // add type
      msgObject.type = "inc";

      // 🦫 all incoming payments go to one place
      msgObject.beneficiaryCode = "income";

      // add date
      msgObject.date = msg.substring(21, 29);

      // get amount
      msgObject.amount = msg
        .split("Available")[0]
        .split("R")
        [msg.split("Available")[0].split("R").length - 1].replaceAll(",", "")
        .trimEnd();

      // get balance
      msgObject.balance = msg
        .split("Available")[1]
        .split("R")[1]
        .split("Help")[0]
        .trimEnd()
        .replaceAll(",", "");
    }
   	// payment
	  else if(msg.substring(16, 20) == "Pmnt") {
		msgObject.type = "exp";
		msgObject.beneficiaryCode = "Pmnt";
		  msgObject.amount = msg.split("Available")[0].split(",")[msg.split("Available")[0].split(",").length -2].split("-")[1];
		msgObject.date = msg.substring(22, 30);
		msgObject.balance = msgsplit("Available")[1].split("R")[1].split("Help")[0].replaceAll(",", "").trimEnd().slice(0, -1);
	  }
	// purchase (exp)
    else {
      // add type
      msgObject.type = "exp";

      // get code
      msgObject.beneficiaryCode = msg
        .split("reserved")[0]
        .substring(25, msg.split("reserved")[0].length - 1);

      // get amount
      msgObject.amount = msg
        .split("reserved")[1]
        .split("for a purchase")[0]
        .split("R")[1]
        .trimEnd()
        .replaceAll(",", "");

      // get date
      msgObject.date = msg.substring(16, 24);

      // get balance
      msgObject.balance = msg
        .split("balance")[1]
        .split("R")[1]
        .split("Help")[0]
        .trimEnd()
        .replaceAll(",", "");
    }

    if (!checkDups(msgObject)) {
      console.log("[+] Message object sent: \n" + JSON.stringify(msgObject));
      msgList.push(msgObject);
    }
  }
}

function checkDups(msgObject) {
  for (var i = 0; i < msgList.length; i++) {
    var value = msgList[i];
    if (
      msgObject.type == value.type &&
      msgObject.beneficiaryCode == value.beneficiaryCode &&
      msgObject.amount == value.amount &&
      msgObject.date == value.date &&
      msgObject.balance == value.balance
    ) {
      console.log("[!] duplicate detected!!");
      return true;
    }
  }
  return false;
}

// connect
function connectImap() {
  msgList = [];
  imap.connect();
}

function getImapData() {
  return msgList;
}

module.exports = { connectImap, getImapData };
