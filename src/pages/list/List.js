import React, { useEffect, useState, useRef } from "react";
import { db } from "../../lib/firebase";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { settings, dbData } from "../../actions";

//COMPOPNENTS
import Task from "./components/Task";

//MATERIAL UI
import SettingsIcon from "@material-ui/icons/Settings";
import { Avatar, Fab } from "@material-ui/core";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import AddIcon from "@material-ui/icons/Add";
import ListSettings from "./components/ListSettings";
import { motion } from "framer-motion";

function List() {
  const settingState = useSelector((state) => state.settings);
  const membersWs = useSelector((state) => state.membersWs);
  const db_Data = useSelector((state) => state.dbData);
  const wsDataColor = useSelector((state) => state.wsData.color);
  const dispatch = useDispatch();
  const history = useHistory();
  const currentWsId = history.location.pathname.split("/")[2];
  const boardId = history.location.pathname.split("/")[4];
  const [ListSettingsStatus, setListSettingsStatus] = useState(false);
  const [createTaskX, setCreateTaskX] = useState(0);
  const [openChooseStatus, setOpenChooseStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    const get_db_Data = () => {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .doc(boardId)
        .onSnapshot((docData) => {
          if (docData.exists) {
            console.log("dispatching main db_Data");
            dispatch(dbData(docData.data()));
          }
        });
    };

    get_db_Data();
  }, [currentWsId, boardId]);

  useEffect(() => {
    if (db_Data) {
      setNewStatus(db_Data.statusType[0]);
    }
  }, [db_Data]);

  const handleNewStatus = (data) => {
    setNewStatus(data);
    setOpenChooseStatus(false);
  };

  return (
    <>
      <div className="list">
        {db_Data &&
          db_Data.statusType?.map((data) => {
            return (
              <div className="list__child">
                <Task dbName={data} />
              </div>
            );
          })}
      </div>
      {/* BOTTOM ADD TASK MENU */}
      <motion.div
        className="list__createTask-window boxShadow"
        animate={{ x: createTaskX }}
      >
        <div className="list__createTask-taskName">
          <div
            className="list__createTask-status"
            style={{ background: db_Data?.colors[newStatus] }}
          >
            <p onClick={() => setOpenChooseStatus(true)}>{newStatus}</p>
            {openChooseStatus && (
              <div className="list__createTask-chooseStatus">
                {db_Data?.statusType.map((data) => {
                  return (
                    <p
                      onClick={() => handleNewStatus(data)}
                      style={{ background: db_Data?.colors[data] }}
                    >
                      {data}
                    </p>
                  );
                })}
              </div>
            )}
          </div>
          <input type="text" placeholder="Type task.." />
        </div>
        <div className="list__createTask-ass">
          <p className="list__createTask-p">For</p>
          <div className="list__createTask-avatar">
            <Avatar />
            <div className="list__createTast-add">
              <AddIcon />
            </div>
            <div className="list__createTask-popUsers">
              {membersWs?.map((member) => {
                console.log(member);
                return (
                  <div className="list__pop-avatar">
                    <Avatar src={member.userPhoto} />
                    <p>{member.userName}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </motion.div>
      <div className="list__createTask">
        <div className="list__icon">
          <Fab
            color="primary"
            aria-label="add"
            style={{ background: wsDataColor }}
            onClick={() => setCreateTaskX(-430)}
          >
            <AddIcon /> Add New Task
          </Fab>
        </div>
      </div>
      {/* TOP MENU IN OPEN WS */}k
      <div className="list__topMenuFn">
        <div
          className="list__addFn2"
          onClick={() => setListSettingsStatus(!ListSettingsStatus)}
        >
          <Fab
            color="primary"
            aria-label="add"
            size="small"
            style={{ background: wsDataColor }}
          >
            <SettingsIcon />
          </Fab>
        </div>
        <div
          className="list__addFn"
          onClick={() => dispatch(settings(!settingState))}
        >
          <Fab
            color="primary"
            aria-label="add"
            size="small"
            style={{ background: wsDataColor }}
          >
            <MenuOpenIcon />
          </Fab>
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
export default List;
