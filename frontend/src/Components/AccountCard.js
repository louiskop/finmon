import "../css/AccountCard.css";
import { useEffect, useState } from "react";
import { FaPen, FaTrash } from "react-icons/fa";
import Button from "./Button";

function AccountCard(props) {
  const [color, setColor] = useState("green");
  const [bal, setBal] = useState(props.acc.balance);
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (props.acc.balance > props.acc.goodLimit) {
      setColor("green");
    } else if (props.acc.balance < props.acc.medLimit) {
      setColor("red");
    } else {
      setColor("orange");
    }
  });

  const editItem = () => {
    setEdit(true);
  };

  const updateBal = (e) => {
    setBal(e.target.value);
  };

  const updateItem = () => {
    props.onUpdate(props.acc._id, bal);
    setEdit(false);
  };

  const deleteItem = () => {
    props.onDelete(props.acc._id);
  };

  return (
    <div className="accCard">
      <p>{props.acc.name}</p>
      <p id={color}>{props.acc.balance}</p>
      <div className="actions">
        <FaPen onClick={editItem} className="icon" />
        <FaTrash onClick={deleteItem} className="icon" />
      </div>
      <div className={edit ? "editPopup" : "hidden"}>
        <h1>Enter new balance amount</h1>
        <input onChange={updateBal} value={bal} type="text" />
        <Button onClick={updateItem} txt="Update" />
      </div>
    </div>
  );
}

export default AccountCard;
