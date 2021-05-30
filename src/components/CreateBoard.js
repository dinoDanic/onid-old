import { motion } from "framer-motion";
import React, { useState, useRef } from "react";
import { useHistory } from "react-router-dom";
import { db, timestamp } from "../lib/firebase";
import "../styles/createBoard.scss";

function CreateBoard({ setNewBoardSlide }) {
  const [newBoardName, setNewBoardName] = useState("");
  const history = useHistory();
  const currentWsId = history.location.pathname.split("/")[2];
  const inputRef = useRef();

  const createNewBoard = (e) => {
    e.preventDefault();
    if (currentWsId && newBoardName !== "") {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .add({
          name: newBoardName,
          timestamp: timestamp,
          activeModules: [
            "Created By",
            "Status",
            "Created Date",
            "Deadline",
            "Assign",
            "Priority",
          ],
          moduleTypes: [
            "Created By",
            "Created Date",
            "Deadline",
            "Assign",
            "Status",
            "Priority",
          ],
          orderModules: {
            "Created By": "1",
            "Created Date": "2",
            Deadline: "3",
            Assign: "4",
            Status: "5",
            Priority: "6",
          },

          statusType: ["to do", "stuck", "done"],
          colors: {
            "to do": "#D059D0",
            done: "#3FC875",
            stuck: "#E2445C",
          },
          // PRIORITYS
          priority: [
            { name: "Urgent", color: "#F55B5D" },
            { name: "High", color: "#F8A310" },
            { name: "Normal", color: "#3ABB3F" },
            { name: "Low", color: "#5CACF3" },
          ],
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
          createAllModules("Priority", 2);
          createAllModules("Status", 3);
          createAllModules("Created Date", 4);
          createAllModules("Deadline", 5);

          // end
          setNewBoardSlide(false);
          history.push(`/ws/${currentWsId}/dashboard/${docData.id}/li`);
        });
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: -10, opacity: 0 }}
      >
        <form onSubmit={(e) => createNewBoard(e)}>
          <input
            className="retroInput retroInput-w100"
            placeholder="New board"
            spellCheck="false"
            onChange={(e) => setNewBoardName(e.target.value)}
            ref={inputRef}
          ></input>
        </form>
      </motion.div>
      {/* <div className="retroPop">
        <div
          className="retroPop-layer"
          onClick={() => setNewBoard(false)}
        ></div>
        <div className="retroPop__box">
          <div className="createBoard__header">
            <h3>Create Board</h3>
          </div>
          <div className="createBoard__info"></div>
          <form onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="retroInput retroInput-w100"
              placeholder="Board Name"
              onChange={(e) => setNewBoardName(e.target.value)}
            />
            <button
              onClick={() => createNewBoard()}
              className="retroBtn retroBtn-info"
            >
              Create
            </button>
          </form>
        </div>
      </div> */}
    </>
  );
}

export default CreateBoard;
