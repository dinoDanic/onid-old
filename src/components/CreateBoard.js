import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Button, TextField } from "@material-ui/core";
import BrutalBtn from "../components/brutal/BrutalBtn";
import { db } from "../lib/firebase";
import "../styles/createBoard.scss";

function CreateBoard({ setNewBoard }) {
  const [newBoardName, setNewBoardName] = useState("");
  const history = useHistory();
  const currentWsId = history.location.pathname.split("/")[2];

  const [docDataId, setDocDataId] = useState();

  const createNewBoard = () => {
    if (currentWsId && newBoardName !== "") {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .add({
          name: newBoardName,
          activeModules: [],
          moduleTypes: [
            "Created By",
            "Created Date",
            "Deadline",
            "Assign",
            "Status",
          ],
          orderModules: {
            "Created By": "1",
            "Created Date": "2",
            Deadline: "3",
            Assign: "4",
            Status: "5",
          },
          statusType: ["to do", "stuck", "done"],
          // SET LIST COLORS TODOS
          colors: {
            "to do": "#dc00dc",
            done: "#0bdc00",
            stuck: "#e6563c",
          },
        })
        .then((docData) => {
          console.log(docData.id);
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
          //SET ALL MODULES
          const createAllModules = (name, order) => {
            db.collection("workStation")
              .doc(currentWsId)
              .collection("dashboard")
              .doc(docData.id)
              .collection("modules")
              .add({
                module: name,
                order: order,
              })
              .then((docData2) => {
                let id = docData2._delegate.id;
                db.collection("workStation")
                  .doc(currentWsId)
                  .collection("dashboard")
                  .doc(docData.id)
                  .collection("modules")
                  .doc(id)
                  .set(
                    {
                      id: id,
                    },
                    { merge: true }
                  );
              });
          };
          createAllModules("Created By", 0);
          createAllModules("Assign", 1);
          createAllModules("Status", 2);
          createAllModules("Created Date", 3);
          createAllModules("Deadline", 4);

          setNewBoard(false);
        });
    }
  };

  return (
    <div className="brutalPop">
      <div
        className="brutalPop__layer"
        onClick={() => setNewBoard(false)}
      ></div>
      <div className="brutalPop__box">
        <div className="createBoard__header">
          <h2>Create Board</h2>
        </div>
        <div className="createBoard__info"></div>
        <form onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            className="brutalInput"
            placeholder="Board Name"
            onChange={(e) => setNewBoardName(e.target.value)}
          />
          <div
            className="createBoard__brutalBrn"
            onClick={() => createNewBoard()}
          >
            <BrutalBtn tekst="Create" width="80px" />
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateBoard;
