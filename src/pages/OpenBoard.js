import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { settings } from "../actions";
import { db } from "../lib/firebase";
import "../styles/openBoard.scss";
import { Button } from "@material-ui/core";
import BrutalBtn from "../components/brutal/BrutalBtn";
import ListSettings from "./list/components/ListSettings";

function OpenBoard() {
  const wsDataColor = useSelector((state) => state.wsData.color);
  const settingState = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const history = useHistory();
  const boardId = history.location.pathname.split("/")[4];
  const currentWsId = history.location.pathname.split("/")[2];
  const [openBoardData, setOpenBoardData] = useState([]);
  const [listData, setListData] = useState([]);
  const [ListSettingsStatus, setListSettingsStatus] = useState(false);

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
    <>
      <div className="openBoard">
        <h1>{openBoardData?.name}</h1>
        <div className="openBoard__modes">
          <div className="openBoard__L">
            <Link to={`/ws/${currentWsId}/dashboard/${boardId}/li`}>
              <BrutalBtn
                tekst="List"
                width="80px"
                color={
                  history.location.pathname ===
                  `/ws/${currentWsId}/dashboard/${boardId}/li`
                    ? "#fbcb00"
                    : ""
                }
                icon="ViewListIcon"
              />
            </Link>
            <Link to={`/ws/${currentWsId}/dashboard/${boardId}/bo`}>
              <BrutalBtn
                tekst="Board"
                width="80px"
                icon="DashboardIcon"
                color={
                  history.location.pathname ===
                  `/ws/${currentWsId}/dashboard/${boardId}/bo`
                    ? "#fbcb00"
                    : ""
                }
              />
            </Link>
          </div>
          {/*   <div className="openBoard__lineSep"></div> */}
          <div className="openBoard__R">
            <div
              className="openBoard__btnSet"
              onClick={() => setListSettingsStatus(!ListSettingsStatus)}
            >
              <BrutalBtn icon="SettingsIcon" />
            </div>
            <div
              className="openBoard__btnMdls"
              onClick={() => dispatch(settings(!settingState))}
            >
              <BrutalBtn icon="MenuOpenIcon" />
            </div>
          </div>
        </div>
      </div>
      {ListSettingsStatus && (
        <ListSettings
          setListSettingsStatus={setListSettingsStatus}
          currentWsId={currentWsId}
          boardId={boardId}
        />
      )}
    </>
  );
}
export default OpenBoard;
