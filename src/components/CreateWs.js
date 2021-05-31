import React, { useState } from "react";
import { db } from "../lib/firebase";
import { useSelector } from "react-redux";
import "../styles/createWs.scss";
import BrutalBtn from "../components/brutal/BrutalBtn";
import Ws_selectColor from "./Ws_selectColor";

function CreateWs({ setCreateWs }) {
  const userData = useSelector((state) => state.userInfo);
  const [newStation, setNewStation] = useState("");
  const [color, setColor] = useState("#a358d0");

  const handleCreateWS = () => {
    if (userData) {
      db.collection("workStation")
        .where("users", "array-contains", userData.uid)
        .get()
        .then((doc) => {
          // dva put se radi zbog updtejta u main WS
          if (doc.empty) {
            db.collection("workStation")
              .add({
                ws_name: newStation,
                ws_description: "Add description",
                users: [userData.uid],
                alfa: userData.uid,
                color: color,
              })
              .then((docData) => {
                db.collection("workStation").doc(docData.id).set(
                  {
                    wsId: docData.id,
                  },
                  { merge: true }
                );
                db.collection("users").doc(userData.uid).update({
                  mainWs: docData.id,
                });
              });
          } else {
            db.collection("workStation")
              .add({
                ws_name: newStation,
                ws_description: "Add description",
                users: [userData.uid],
                alfa: userData.uid,
                color: color,
              })
              .then((docData) => {
                db.collection("workStation").doc(docData.id).set(
                  {
                    wsId: docData.id,
                  },
                  { merge: true }
                );
              });
          }
        });

      setCreateWs(false);
    }
  };

  return (
    <div className="createWS">
      <div className="createWS__layer" onClick={() => setCreateWs(false)}></div>
      <div className="createWS__box retroBox">
        <div className="createWS__header">
          <h2>Create Work Station</h2>
        </div>
        <div className="createWS__info">
          <p>In Work Station you hold all your future Dashboards</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            className="retroInput retroInput-w100"
            placeholder="Main station, School, work, etc.."
            onChange={(e) => setNewStation(e.target.value)}
          />
          <Ws_selectColor setColor={setColor} />
          <button
            className="retroBtn"
            onClick={() => handleCreateWS()}
            style={{ background: color }}
          >
            Create
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateWs;
