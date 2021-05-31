import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { settings } from "../actions";
import { db } from "../lib/firebase";
import "../styles/openBoard.scss";
import BrutalBtn from "../components/brutal/BrutalBtn";
import ListSettings from "./list/components/ListSettings";

// Material UI
import DnsIcon from "@material-ui/icons/Dns";
import AppsIcon from "@material-ui/icons/Apps";
import SettingsIcon from "@material-ui/icons/Settings";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";

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
              <button
                className="retroBtn retroBtn-icon"
                style={{
                  background:
                    history.location.pathname ===
                    `/ws/${currentWsId}/dashboard/${boardId}/li`
                      ? `${wsDataColor}`
                      : "",
                }}
              >
                <DnsIcon fontSize="small" />
                List
              </button>
              {/* <BrutalBtn
                tekst="List"
                width="80px"
                color={
                  history.location.pathname ===
                  `/ws/${currentWsId}/dashboard/${boardId}/li`
                    ? "#fbcb00"
                    : ""
                }
                icon="ViewListIcon"
              /> */}
            </Link>
            <Link to={`/ws/${currentWsId}/dashboard/${boardId}/bo`}>
              <button
                className="retroBtn retroBtn-icon"
                style={{
                  background:
                    history.location.pathname ===
                    `/ws/${currentWsId}/dashboard/${boardId}/bo`
                      ? `${wsDataColor}`
                      : "",
                }}
              >
                <AppsIcon fontSize="small" />
                Board
              </button>
              {/*  <BrutalBtn
                tekst="Board"
                width="80px"
                icon="DashboardIcon"
                color={
                  history.location.pathname ===
                  `/ws/${currentWsId}/dashboard/${boardId}/bo`
                    ? "#fbcb00"
                    : ""
                }
              /> */}
            </Link>
          </div>
          {/*   <div className="openBoard__lineSep"></div> */}
          <div className="openBoard__R">
            <div
              className="openBoard__btnSet"
              onClick={() => setListSettingsStatus(!ListSettingsStatus)}
            >
              <button className="retroBtn retroBtn-letter">
                <SettingsIcon fontSize="small" />
              </button>
            </div>
            <div
              className="openBoard__btnMdls"
              onClick={() => dispatch(settings(!settingState))}
            >
              <button className="retroBtn retroBtn-letter">
                <MenuOpenIcon fontSize="small" />
              </button>
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
