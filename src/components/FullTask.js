import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { db } from "../lib/firebase";

//STYLE
import "../styles/fullTask.scss";

function FullTask() {
  const history = useHistory();
  const currentWsId = history.location.pathname.split("/")[2];
  const boardId = history.location.pathname.split("/")[4];
  const statusName = history.location.pathname.split("/")[6];
  const listId = history.location.pathname.split("/")[7];
  const [data, setData] = useState({});

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
          console.log(doc.data());
        });
    };
    getTaskData();
  }, []);

  return (
    <div className="fullTask">
      <div className="fullTask__layer" onClick={() => history.goBack()}></div>
      <div className="fullTask__content">
        <h2>{data.taskName}</h2>
      </div>
    </div>
  );
}

export default FullTask;
