import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, TextField } from "@material-ui/core";
import { db } from "../lib/firebase";
import "../styles/createBoard.scss";

function CreateBoard({ setNewBoard }) {
  const currentWsId = useSelector((state) => state.currentWsId);
  const [newBoardName, setNewBoardName] = useState("");

  const createNewBoard = () => {
    if (currentWsId) {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .add({
          name: newBoardName,
        })
        .then((docData) => {
          db.collection("workStation")
            .doc(currentWsId)
            .collection("dashboard")
            .doc(docData.id)
            .set(
              {
                id: docData.id,
              },
              { merge: true }
            );
        });
      setNewBoard(false);
    }
  };

  return (
    <div className="createBoard">
      <div
        className="createBoard__layer"
        onClick={() => setNewBoard(false)}
      ></div>
      <div className="createBoard__box">
        <div className="createBoard__header">
          <h2>Create Board</h2>
        </div>
        <div className="createBoard__info"></div>
        <form onSubmit={(e) => e.preventDefault()}>
          <TextField
            id="outlined-basic"
            label="Board name"
            variant="outlined"
            onChange={(e) => setNewBoardName(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={() => createNewBoard()}
          >
            Create
          </Button>
        </form>
      </div>
    </div>
  );
}

export default CreateBoard;
