import "../css/Incoming.css";
import { useState } from "react";
import TransItem from "./TransItem";
import Button from "./Button";

function Incoming() {
  const [incoming, setIncoming] = useState([
    { type: "inc", amount: 100, beneficiary: "MA" },
    { type: "exp", amount: 140, beneficiary: "CATWALK" },
    { type: "exp", amount: 300, benefdiciary: "MACDS" },
  ]);

  return (
    <div className="incoming">
      <h2>New</h2>
      <div className="transTable">
        {incoming.map((trans, index) => {
          return <TransItem data={trans} key={index} />;
        })}
      </div>
      <Button txt="Process" id="procbtn" />
    </div>
  );
}

export default Incoming;
