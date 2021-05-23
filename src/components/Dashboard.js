import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { useSelector } from "react-redux";
import { Button } from "@material-ui/core";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import CreateBoard from "./CreateBoard";
import "../styles/dashboard.scss";
import Board from "./Board";

function Dashboard() {
  const currentWsId = useSelector((state) => state.currentWsId);
  const [wsData, setWsData] = useState();
  const [boardData, setBoardData] = useState();
  const [newBoard, setNewBoard] = useState(false);

  useEffect(() => {
    //get ws data
    if (currentWsId) {
      db.collection("workStation")
        .doc(currentWsId)
        .get()
        .then((data) => {
          setWsData(data.data());
        });
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .onSnapshot((data) => {
          let list = [];
          data.forEach((data) => {
            console.log(data.data());
            list.push(data.data());
          });
          setBoardData(list);
        });
    }
  }, [currentWsId]);
  return (
    <div className="dashboard">
      {wsData && (
        <>
          <div className="dashboard__header">
            <div className="dashboard__letter ws_icon__letter">
              <p> {wsData.ws_name.charAt(0)}</p>
            </div>
            <div className="dashboard__name">
              <h2>{wsData.ws_name}</h2>
            </div>
          </div>
          <div className="dashboard__newBoard">
            <Button onClick={() => setNewBoard(true)}>
              <AddCircleOutlineIcon fontSize="small" /> Add new board
            </Button>
          </div>
          <div className="dashboard__dashboards">
            {boardData &&
              boardData.map((data) => {
                return (
                  <Board
                    key={data.id}
                    name={data.name}
                    boardId={data.id}
                    data={data}
                  />
                );
              })}
          </div>
          {newBoard && <CreateBoard setNewBoard={setNewBoard} />}
        </>
      )}
    </div>
  );
}

export default Dashboard;
