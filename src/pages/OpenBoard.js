import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import { db } from "../lib/firebase";

function OpenBoard() {
  const currentWsId = useSelector((state) => state.currentWsId);
  const history = useHistory();
  const pathId = history.location.pathname.split("/")[2];
  const [openBoardData, setOpenBoardData] = useState([]);

  useEffect(() => {
    const loadDashboard = () => {
      if (currentWsId && pathId) {
        db.collection("workStation")
          .doc(currentWsId)
          .collection("dashboard")
          .doc(pathId)
          .get()
          .then((doc) => {
            setOpenBoardData(doc.data());
            console.log(openBoardData);
          });
      }
    };
    loadDashboard();
  }, [pathId, currentWsId]);

  return (
    <div>
      {openBoardData && (
        <>
          {currentWsId}
          <br />
          {pathId} <br />
          {openBoardData.name}
        </>
      )}
    </div>
  );
}

export default OpenBoard;
