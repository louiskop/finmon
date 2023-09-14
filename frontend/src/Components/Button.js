import "../css/Button.css";

function Button(props) {
  return (
    <div onClick={props.onClick} className="btn-prim" id={props.id}>
      <p>{props.txt}</p>
    </div>
  );
}

export default Button;
