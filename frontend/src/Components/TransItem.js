import "../css/TransItem.css";
import { useEffect, useState } from "react";

function TransItem(trans) {
  const [color, setColor] = useState("greentable");

  useEffect(() => {
    if (trans.data.type == "inc") {
      setColor("greentable");
    } else {
      setColor("redtable");
    }
  });

  return (
    <div className="transitem">
      <div>
        <p>{trans.data.type}</p>
      </div>
      <div>
        <p id={color}>{trans.data.amount}</p>
      </div>
      <div>
        <p>{trans.data.beneficiary}</p>
      </div>
      <div>
        <select>
          <option>Allowance</option>
          <option>Food</option>
        </select>
      </div>
    </div>
  );
}

export default TransItem;
