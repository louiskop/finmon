import { useEffect, useState } from "react";
import "./App.css";
import Home from "./Components/Home";
import Loading from "./Components/Loading";
import IP from "./apiConfig";

function App() {
  const [done, setDone] = useState(false);

  useEffect(() => {
    // api calls

    fetch(IP + "/init", { mode: "cors" })
      .then(() => {
        console.log("init finished");
        fetch(IP + "/load", { mode: "cors" }).then(() => {
          console.log("load finished");
          setDone(true);
        });
      })
      .catch((e) => {
        console.log("EROR wiht init: " + e);
      });
  });

  return <div className="App">{done ? <Home /> : <Loading />}</div>;
}

export default App;
