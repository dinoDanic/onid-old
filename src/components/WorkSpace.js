import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { db } from "../lib/firebase";
import "../styles/workSpace.scss";
import WS_icon from "./WS_icon";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import { Button } from "@material-ui/core";
import CreateWs from "../components/CreateWs";

function WorkSpace() {
  const userData = useSelector((state) => state.userInfo);
  const history = useHistory();
  const [wsData, setWsData] = useState([]);
  const [createWs, setCreateWs] = useState(false);

  const checkForWS = () => {
    if (userData) {
      db.collection("workStation")
        .where("users", "array-contains", userData.uid)
        .onSnapshot((doc) => {
          if (doc.empty) {
            console.log("no data, creating work station");
            setCreateWs(true);
          }
          let list = [];
          doc.forEach((data) => {
            list.push(data.data());
          });
          setWsData(list);
        });
    }
  };
  useEffect(() => {
    checkForWS();
  }, [userData]);

  return (
    <div className="workSpace">
      {wsData &&
        wsData.map((data) => {
          return (
            <WS_icon
              key={Math.random() * 1000}
              name={data.ws_name}
              id={data.wsId}
            />
          );
        })}
      <div className="workSpace__addNew">
        <Button onClick={() => setCreateWs(true)}>
          <AddCircleOutlineIcon />
        </Button>
      </div>
      {createWs && <CreateWs setCreateWs={setCreateWs} />}
    </div>
  );
}

export default WorkSpace;
