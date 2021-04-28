import React, { useState } from "react";
import { Button, TextField } from "@material-ui/core";
import { db } from "../lib/firebase";
import { useSelector } from "react-redux";
import "../styles/createWs.scss";

function CreateWs({ setCreateWs }) {
  const userData = useSelector((state) => state.userInfo);
  const [newStation, setNewStation] = useState("");

  const handleCreateWS = () => {
    db.collection("workStation")
      .add({
        ws_name: newStation,
        users: [userData.uid],
      })
      .then((docData) => {
        db.collection("workStation").doc(docData.id).set(
          {
            wsId: docData.id,
          },
          { merge: true }
        );
        /* db.collection("workStation")
          .doc(docData.id)
          .collection("dashboard")
          .add({})
          .then((dashData) => {
            db.collection("workStation")
              .doc(docData.id)
              .collection("dashboard")
              .doc(dashData.id)
              .set(
                {
                  dashboardId: dashData.id,
                },
                { merge: true }
              );
          }); */
      });
    setCreateWs(false);
  };

  return (
    <div className="createWS">
      <div className="createWS__layer" onClick={() => setCreateWs(false)}></div>
      <div className="createWS__box">
        <div className="createWS__header">
          <h2>Create Work Station</h2>
        </div>
        <div className="createWS__info">
          <p>In Work Station you hold all your future Dashboards</p>
        </div>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            id="outlined-basic"
            label="Main Station"
            variant="outlined"
            onChange={(e) => setNewStation(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => handleCreateWS()}
          >
            Create
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateWs;
