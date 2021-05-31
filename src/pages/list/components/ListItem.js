import React, { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { useSelector } from "react-redux";

//STYLE
import "../../../styles/listItem.scss";

//MATERIAL UI
import { Avatar } from "@material-ui/core";

import { AnimatePresence, motion } from "framer-motion";
import { Link } from "react-router-dom";
import Status from "../../../components/Modules/Status";
import CreatedAt from "../../../components/Modules/CreatedAt";
import DeadLine from "../../../components/Modules/DeadLine";
import Assign from "../../../components/Modules/Assign";
import Priority from "../../../components/Modules/Priority";

function ListItem({
  currentWsId,
  boardId,
  listId,
  name,
  userId,
  createdBy,
  createdAt,
  timestamp,
  deadLine,
  deadLineState,
  moduleData,
  assignState,
  statusState,
  dbName,
  priorityState,
  priority,
}) {
  const wsData = useSelector((state) => state.wsData);
  const db_Data = useSelector((state) => state.dbData);
  const [createdByPhtotUrl, setCreatedByPhotoUrl] = useState("");
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [daysLeftColor, setDaysLeftColor] = useState("");
  const [daysLeftCounter, setDaysLeftCounter] = useState(0);
  const [createdByOrder, setCreatedByOrder] = useState(0);
  const [createdDateOrder, setCreatedDateOrder] = useState(0);
  const [deadlineOrder, setDeadlineOrder] = useState(0);
  const [priorityOrder, setPriorityOrder] = useState(0);
  const [assignOrder, setAssignOrder] = useState(0);
  const [statusOrder, setStatusOrder] = useState(0);
  const [chooseUserState, setChooseUserState] = useState(false);
  const [chooseUsersData, setChooseUsersData] = useState();
  const [assignedUser, setAssignedUser] = useState();
  const [statusBg, setStatusBg] = useState("gray");
  const [statusMenuState, setStatusMenuState] = useState(false);
  const [statusType, setStatusType] = useState("");
  const [allColors, setAllColors] = useState();
  const [bgPriority, setBgPriority] = useState("");
  const [priorityMenuState, setPriorityMenuState] = useState(false);

  useEffect(() => {
    const setOrder = () => {
      if (!moduleData) {
        return;
      }
      const items = Array.from(moduleData);
      let cbo = items
        .map(function (e) {
          return e.module;
        })
        .indexOf("Created By");
      let cdo = items
        .map(function (e) {
          return e.module;
        })
        .indexOf("Created Date");
      let dlo = items
        .map(function (e) {
          return e.module;
        })
        .indexOf("Deadline");
      let ao = items
        .map(function (e) {
          return e.module;
        })
        .indexOf("Assign");
      let so = items
        .map(function (e) {
          return e.module;
        })
        .indexOf("Status");
      let po = items
        .map(function (e) {
          return e.module;
        })
        .indexOf("Priority");

      setCreatedByOrder(cbo);
      setCreatedDateOrder(cdo);
      setDeadlineOrder(dlo);
      setAssignOrder(ao);
      setStatusOrder(so);
      setPriorityOrder(po);
    };
    setOrder();
  }, [moduleData, wsData]);

  useEffect(() => {
    const getCreatedByPhotoUrl = () => {
      db.collection("users")
        .doc(userId)
        .get()
        .then((docData) => {
          if (!docData.exists) {
            console.log("data dose not exists, users");
            return;
          }
          setCreatedByPhotoUrl(docData.data().userPhoto);
        });
    };
    getCreatedByPhotoUrl();
  }, []);

  useEffect(() => {
    if (timestamp && deadLine) {
      let oneDay = 1000 * 60 * 60 * 24;
      let createdDate = timestamp.toDate();
      let deadLineDate = deadLine.toDate();
      let daysLeft = Math.ceil((deadLineDate - createdDate) / oneDay);
      setDaysLeftCounter(daysLeft);

      if (daysLeft < 4) {
        setDaysLeftColor("#C74C4C");
      }
      if (daysLeft > 4) {
        setDaysLeftColor("#51A0F7");
      }
      if (daysLeft > 10) {
        setDaysLeftColor("#4ca54c");
      }
    }
  }, [timestamp, deadLine, setDaysLeftCounter]);

  return (
    <div className="listItem">
      <Link
        to={`/ws/${currentWsId}/dashboard/${boardId}/li/${dbName}/${listId}`}
      >
        <div className="listItem__taskName">
          <p>{name}</p>
        </div>
      </Link>

      <div className="listItem__fnHolder">
        <div className="listItem__fn">
          {createdBy && (
            <div
              className="listItem__createdBy listItem__comp "
              name="Created By"
              style={{ order: createdByOrder }}
            >
              <Avatar src={createdByPhtotUrl} />
            </div>
          )}
          {createdAt && (
            <div style={{ order: createdDateOrder }}>
              <CreatedAt timestamp={timestamp} />
            </div>
          )}
          {deadLineState && (
            <div style={{ order: deadlineOrder }}>
              <DeadLine
                deadLine={deadLine}
                currentWsId={currentWsId}
                boardId={boardId}
                dbName={dbName}
                listId={listId}
                dateCreated={timestamp}
              />
            </div>
          )}
          {assignState && (
            <div style={{ order: assignOrder }}>
              <Assign
                currentWsId={currentWsId}
                boardId={boardId}
                dbName={dbName}
                listId={listId}
              />
            </div>
          )}
          {statusState && (
            <div style={{ order: statusOrder }}>
              <Status statusBg={statusBg} statusName={dbName} taskId={listId} />
            </div>
          )}
          {priorityState && (
            <div
              style={{
                order: priorityOrder,
              }}
            >
              <Priority
                currentWsId={currentWsId}
                boardId={boardId}
                dbName={dbName}
                listId={listId}
                priority={priority}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListItem;
