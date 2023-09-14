import "../css/Accounts.css";
import { useState, useEffect } from "react";
import AccountCard from "./AccountCard";
import IP from "../apiConfig";

function Accounts() {
  const [accs, setAccs] = useState([]);
  const [balance, setBalance] = useState(0);

  // get accounts from server
  useEffect(() => {
    fetch(IP + "/account").then((response) => {
      response.json().then((data) => {
        setAccs(data);
      });
    });
  });

  // calculate total balance
  useEffect(() => {
    var temp = 0;
    accs.forEach((acc) => {
      temp += acc.balance;
    });
    setBalance(temp);
  });

  const deleteOne = (id) => {
    // delete api call
    fetch(IP + "/account/" + id, { method: "DELETE" });
  };

  const updateOne = (id, bal) => {
    // update api call
    fetch(IP + "/account/" + id, {
      method: "PATCH",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        balance: parseInt(bal),
      }),
    });
  };

  return (
    <div className="outerAccs">
      <h1>R {balance}</h1>
      <div className="accounts">
        {accs.map((acc) => {
          return (
            <AccountCard onDelete={deleteOne} onUpdate={updateOne} acc={acc} />
          );
        })}
      </div>
    </div>
  );
}

export default Accounts;
