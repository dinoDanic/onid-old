import { roundToNearestMinutes } from "date-fns";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import BrutalBtn from "../components/brutal/BrutalBtn";
import { db } from "../lib/firebase";
import "../styles/createBoard.scss";

function CreateBoard({ setNewBoard }) {
  const [newBoardName, setNewBoardName] = useState("");
  const history = useHistory();
  const currentWsId = history.location.pathname.split("/")[2];

  const createNewBoard = () => {
    if (currentWsId && newBoardName !== "") {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .add({
          name: newBoardName,
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

          /* //SET DEFAULT TASK => TO DO, STUCK, DONE
          const createDefaultTasks = (name) => {
            db.collection("workStation")
              .doc(currentWsId)
              .collection("dashboard")
              .doc(docData.id)
              .collection("task")
              .doc("123")
              .collection(name)
              .add({});
          };
          createDefaultTasks("to do");
          createDefaultTasks("stuck");
          createDefaultTasks("done"); */
          // end
          setNewBoard(false);
        });
    }
  };

  return (
    <>
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
    </>
  );
}

export default CreateBoard;
