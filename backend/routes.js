const express = require("express");
const router = express.Router();

const accountModel = require("./models/Account");
const beneficiaryModel = require("./models/Beneficiary");
const transactionModel = require("./models/Transaction");

const { connectImap, getImapData } = require("./imap");

// account routes
router.get("/account", async (req, res) => {
  try {
    const accounts = await accountModel.find();
    res.status(200).json(accounts);
  } catch (err) {
    res.json(err);
  }
});

router.post("/account", async (req, res) => {
  try {
    const account = new accountModel({
      name: req.body.name,
      balance: req.body.balance,
      goodLimit: req.body.goodLimit,
      medLimit: req.body.medLimit,
    });

    const savedAcc = await account.save();
    res.status(200).json(savedAcc);
  } catch (err) {
    res.json(err);
  }
});

router.patch("/account/:accountId", async (req, res) => {
  try {
    const updatedAcc = await accountModel.updateOne(
      { _id: req.params.accountId },
      {
        $set: {
          balance: req.body.balance,
        },
      }
    );

	console.log(req.body.balance);
    res.status(200).json(updatedAcc);
  } catch (err) {
	console.log("poes error: " + err);
    res.json(err);
  }
});

router.delete("/account/:accountId", async (req, res) => {
  try {
    await accountModel.deleteOne({ _id: req.params.accountId });
    res.status(200).json("Success");
  } catch (err) {
    res.json(err);
  }
});

// beneficiary routes
router.patch("/beneficiary/:beneficiaryId", async (req, res) => {
  try {
    const updated = await beneficiaryModel.updateOne(
      { _id: req.params.beneficiaryId },
      {
        $set: {
          code: req.body.code,
          category: req.body.category,
        },
      }
    );
  } catch (err) {
    res.json(err);
  }
});

// transaction routes

// get emails and mark them as read
router.get("/init", async (req, res) => {
  connectImap();
  res.status(200).json("success");
});

// add the init data as transactions and update balances
router.get("/load", async (req, res) => {
  var data = getImapData();

  var savedTransactions = [];

  // add them to db
  data.forEach(async (transaction) => {
    var benef = await beneficiaryModel.findOne({
      code: transaction.beneficiary,
    });

    if (!benef) {
      benef = new beneficiaryModel({
        code: transaction.beneficiaryCode,
        category: null,
      });
      await benef.save();
    }

    const newTransaction = new transactionModel({
      beneficiary: benef,
      amount: parseFloat(transaction.amount),
      type: transaction.type,
      date: new Date(
        parseInt(
          "20" + transaction.date.substring(6, 8),
          parseInt(transaction.date.substring(3, 5)),
          parseInt(transaction.date.substring(0, 2))
        )
      ),
      processed: false,
    });

    try {
      savedTransactions.push(await newTransaction.save());
    } catch (err) {
      console.log(err);
    }
  });

  // update balances with transactions with beneficiaries
  await updateBalances(
    savedTransactions.filter(async (trans) => {
      if (
        (await beneficiaryModel.findById(trans.beneficiary).category) == null
      ) {
        return false;
      }
      return true;
    })
  );

  res.json("success");
});

// update a beneficiary and process that transactions
router.patch("/transaction/:beneficId", async (req, res) => {
  // update the beneficiaries with their new accounts
  try {
    // update beneficiary
    const updatedBenef = await beneficiaryModel.updateOne(
      { _id: req.params.beneficId },
      {
        $set: {
          category: await accountModel.findOne({ name: req.body.accName }),
        },
      }
    );

    const allTrans = await transactionModel.find();

    // process all transactions with that beneficiaries
    updateBalances(
      allTrans.filter((value) => {
        if (!value.processed && value.beneficiary == req.params.beneficId) {
          return true;
        }
        return false;
      })
    );

    res.status(200).json("success");
  } catch (err) {
    res.json(err);
  }
});

// get all the transactions
router.get("/transaction", async (req, res) => {
  try {
    const transactions = await transactionModel.find();
    res.status(200).json(transactions);
  } catch (err) {
    res.json(err);
  }
});

// transaction effect function
async function updateBalances(transactions) {
  transactions.forEach(async (trans) => {
    const benef = await beneficiaryModel.findById(trans.beneficiary);
    const acc = await accountModel.findById(benef.category);

    // modify balances
    if (trans.type == "inc") {
      acc.balance += trans.amount;
    } else {
      acc.balance -= trans.amount;
    }

    trans.processed = true;

    // save changes
    await acc.save();
    await trans.save();
  });
}

module.exports = router;
