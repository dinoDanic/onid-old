import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { db } from "../lib/firebase";
import "../styles/openBoard.scss";
import { Button } from "@material-ui/core";

function OpenBoard() {
  const history = useHistory();
  const boardId = history.location.pathname.split("/")[4];
  const currentWsId = history.location.pathname.split("/")[2];
  const [openBoardData, setOpenBoardData] = useState([]);
  const [listData, setListData] = useState([]);

  useEffect(() => {
    const loadDashboard = () => {
      if (currentWsId && boardId) {
        db.collection("workStation")
          .doc(currentWsId)
          .collection("dashboard")
          .doc(boardId)
          .get()
          .then((doc) => {
            setOpenBoardData(doc.data());
          });
        db.collection("workStation")
          .doc(currentWsId)
          .collection("dashboard")
          .doc(boardId)
          .collection("list")
          .get()
          .then((doc) => {
            let list = [];
            doc.forEach((data) => {
              list.push(data.data());
            });
            setListData(list);
          });
      }
    };
    loadDashboard();
  }, [boardId, currentWsId]);

  return (
    <div className="openBoard">
      <h1>{openBoardData?.name}</h1>
      <div className="openBoard__modes">
        <Link to={`/ws/${currentWsId}/dashboard/${boardId}/li`}>
          <Button size="small" color="primary" variant="contained">
            List
          </Button>
        </Link>
        <Link to={`/ws/${currentWsId}/dashboard/${boardId}/bo`}>
          <Button size="small" color="primary" variant="outlined">
            Board
          </Button>
        </Link>
      </div>
    </div>
  );
}
export default OpenBoard;
