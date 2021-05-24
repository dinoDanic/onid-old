import React, { useState } from "react";
import { db } from "../lib/firebase";
import { useSelector } from "react-redux";
import "../styles/createWs.scss";
import BrutalBtn from "../components/brutal/BrutalBtn";
import Ws_selectColor from "./Ws_selectColor";

function CreateWs({ setCreateWs }) {
  const userData = useSelector((state) => state.userInfo);
  const [newStation, setNewStation] = useState("");
  const [color, setColor] = useState("#333");

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
      <div className="brutalPop__box">
        <div className="createWS__header">
          <h2 style={{ color: color }}>Create Work Station</h2>
        </div>
        <div className="createWS__info">
          <p style={{ color: color }}>
            In Work Station you hold all your future Dashboards
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            className="brutalInput"
            placeholder="New work station"
            onChange={(e) => setNewStation(e.target.value)}
            style={{
              border: `2px solid ${color}`,
              color: color,
              boxShadow: `2px 2px 0 0 ${color}`,
            }}
          />
          <Ws_selectColor setColor={setColor} />
          <div className="createWs__brtlbtn" onClick={() => handleCreateWS()}>
            <BrutalBtn tekst="Create" color={color} width="80px" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateWs;
