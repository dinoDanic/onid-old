import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { db, timestamp } from "../lib/firebase";
import { useSelector } from "react-redux";
import FullTaskMsg from "./FullTaskMsg";

//STYLE
import "../styles/fullTask.scss";

function FullTask() {
  const userInfo = useSelector((state) => state.userInfo);
  const history = useHistory();
  const currentWsId = history.location.pathname.split("/")[2];
  const boardId = history.location.pathname.split("/")[4];
  const statusName = history.location.pathname.split("/")[6];
  const listId = history.location.pathname.split("/")[7];
  const [data, setData] = useState({});
  const [updateInput, setUpdateInput] = useState("");
  const [updateData, setUpdateData] = useState([]);
  const [updatedBy, setUpdatedBy] = useState();
  const [replayTaskState, setReplayTaskState] = useState(false);
  const [replayInput, setReplayInput] = useState("");

  useEffect(() => {
    const getTaskData = () => {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .doc(boardId)
        .collection("task")
        .doc("123")
        .collection(statusName)
        .doc(listId)
        .onSnapshot((doc) => {
          setData(doc.data());
        });
    };

    const getUpdates = async () => {
      await db
        .collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .doc(boardId)
        .collection("update")
        .where("forTaskId", "==", listId)
        .orderBy("timestamp", "asc")
        .onSnapshot((data) => {
          let list = [];
          data.forEach((doc) => {
            list.push(doc.data());
          });
          setUpdateData(list);
        });
    };
    getUpdates();
    getTaskData();
  }, []);

  useEffect(() => {
    const getUserInfoWithId = () => {
      if (updateData.length !== 0) {
        db.collection("users")
          .doc(updateData[0].updateById)
          .get()
          .then((data) => {
            setUpdatedBy(data.data());
          });
      }
    };
    getUserInfoWithId();
  }, [updateData]);

  const createUpdate = (e) => {
    e.preventDefault();
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("update")
      .add({
        updateById: userInfo.uid,
        input: updateInput,
        forTaskId: listId,
        timestamp: timestamp,
      })
      .then((data) => {
        db.collection("workStation")
          .doc(currentWsId)
          .collection("dashboard")
          .doc(boardId)
          .collection("update")
          .doc(data.id)
          .set(
            {
              docId: data.id,
            },
            { merge: true }
          );
      });
  };

  return (
    <div className="fullTask">
      <div className="fullTask__layer" onClick={() => history.goBack()}></div>
      <div className="fullTask__content">
        <h2>{data?.taskName}</h2>
        <div className="fullTask__update">
          <form onSubmit={(e) => createUpdate(e)}>
            <input
              className="brutalInput"
              type="text"
              placeholder="Got update?"
              onChange={(e) => setUpdateInput(e.target.value)}
            />
          </form>
        </div>
        <div className="fullTask__showUpdate">
          {updateData?.map((data) => {
            return (
              <FullTaskMsg
                input={data.input}
                currentWsId={currentWsId}
                boardId={boardId}
                docId={data.docId}
                updatedBy={updatedBy}
                key={Math.random() * 1000}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default FullTask;
