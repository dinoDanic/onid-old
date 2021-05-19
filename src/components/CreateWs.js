import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { db } from "../lib/firebase";
import { useSelector } from "react-redux";
import "../styles/createWs.scss";
import ColorPicker from "../components/ColorPicker";
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
          if (doc.empty) {
            db.collection("workStation")
              .add({
                ws_name: newStation,
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
      <div className="createWS__box">
        <div className="createWS__header">
          <h2 style={{ color: color }}>Create Work Station</h2>
        </div>
        <div className="createWS__info">
          <p style={{ color: color }}>
            In Work Station you hold all your future Dashboards
          </p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            id="outlined-basic"
            label="New Work Station"
            variant="outlined"
            onChange={(e) => setNewStation(e.target.value)}
            style={{
              color: color,
            }}
          />
          <Ws_selectColor setColor={setColor} />
          <Button
            type="submit"
            variant="contained"
            onClick={() => handleCreateWS()}
            style={{ background: color, color: "white" }}
          >
            Create
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateWs;
