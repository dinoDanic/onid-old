import React, { useEffect, useState } from "react";
import "../styles/taskItem.scss";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { db } from "../../../lib/firebase";
import { convertDate } from "../../../functions";

// Componets
import CreatedAt from "../../../components/Modules/CreatedAt";
import Assign from "../../../components/Modules/Assign";
import DeadLine from "../../../components/Modules/DeadLine";
import Status from "../../../components/Modules/Status";
import Priority from "../../../components/Modules/Priority";

//DATE STUF
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

//Material ui
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";
import { Avatar } from "@material-ui/core";
import { AnimatePresence, motion } from "framer-motion";
import { Assignment } from "@material-ui/icons";

function TaskItem({ taskName, statusName, listId }) {
  const db_Data = useSelector((state) => state.dbData);
  const wsData = useSelector((state) => state.wsData);
  const history = useHistory();
  const currentWsId = history.location.pathname.split("/")[2];
  const boardId = history.location.pathname.split("/")[4];
  const [deadLineDate, setDeadLineDate] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [daysLeftColor, setDaysLeftColor] = useState("");
  const [daysLeftCounter, setDaysLeftCounter] = useState(0);
  const [userId, setUserId] = useState("");
  const [userPhoto, setUserPhoto] = useState("");
  const [userName, setUserName] = useState("");
  const [assignedUserPhoto, setAssignedUserPhoto] = useState("");
  const [assignedUserId, setAssignedUserId] = useState("");
  const [assignUserName, setAssignUserName] = useState("");
  const [assingedUsers, setAssingedUsers] = useState();
  const [assignChoose, setAssingChoose] = useState(false);
  const [statusBg, setStatusBg] = useState("gray");
  const [statusState, setStatusState] = useState(false);
  const [priorityState, setPriorityState] = useState(false);
  const [priority, setPriority] = useState("");
  const [priorityBg, setPriorityBg] = useState("gray");

  useEffect(() => {
    const loadTaskData = () => {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .doc(boardId)
        .collection("task")
        .doc("123")
        .collection(statusName)
        .doc(listId)
        .onSnapshot((doc) => {
          if (doc.exists) {
            //set date Created
            setDateCreated(doc.data().created);
            // set deadLine date
            setDeadLineDate(doc.data().deadLine);
            // user Id
            setUserId(doc.data().userId);
            // set assigned userId
            setAssignedUserId(doc.data().assignedUser);
            //set priority
            setPriority(doc.data().priority);
          }
        });
    };
    loadTaskData();
  }, []);

  useEffect(() => {
    setStatusBg(db_Data.colors[`${statusName}`]);
  }, [statusName, priority]);

  useEffect(() => {
    if (db_Data.priority) {
      let array = db_Data.priority;
      const result = array.find((obj) => {
        return obj.name === priority;
      });
      if (result === undefined) {
        return;
      }
      setPriorityBg(result.color);
    }
  }, [priority]);

  useEffect(() => {
    const getPhoto = () => {
      if (!userId) {
        return;
      }
      db.collection("users")
        .doc(userId)
        .get()
        .then((data) => {
          setUserPhoto(data.data().userPhoto);
          setUserName(data.data().userName);
        });
    };
    getPhoto();
  }, [userId]);

  useEffect(() => {
    const getAssignedUserPhoto = async () => {
      if (!assignedUserId) {
        return;
      }
      await db
        .collection("users")
        .doc(assignedUserId)
        .get()
        .then((data) => {
          setAssignedUserPhoto(data.data().userPhoto);
          setAssignUserName(data.data().userName);
        });
    };
    getAssignedUserPhoto();
  }, [assignedUserId]);

  useEffect(() => {
    const getAssingedUsers = async () => {
      let list = [];
      await wsData?.users?.map((data) => {
        db.collection("users")
          .doc(data)
          .get()
          .then((docData) => {
            list.push(docData.data());
          });
      });
      setAssingedUsers(list);
    };

    getAssingedUsers();
  }, [wsData]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc("123")
      .collection(statusName)
      .doc(listId)
      .set(
        {
          deadLine: date,
        },
        { merge: true }
      );
  };

  useEffect(() => {
    if (dateCreated && deadLineDate) {
      let oneDay = 1000 * 60 * 60 * 24;
      let createdDate = dateCreated.toDate();
      let deadLine = deadLineDate.toDate();
      let daysLeft = Math.ceil((deadLine - createdDate) / oneDay);
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
  }, [dateCreated, deadLineDate, setDaysLeftCounter]);

  const setNewAssign = async (userId) => {
    console.log("setting new assaing");
    await db
      .collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc("123")
      .collection(statusName)
      .doc(listId)
      .update({
        assignedUser: userId,
      });

    console.log("done");
  };

  const changeStatus = (name) => {
    let copy = {};
    if (name === statusName) {
      return;
    }
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc("123")
      .collection(statusName)
      .doc(listId)
      .get()
      .then((docData) => {
        copy = docData.data();
      })
      .then(() => {
        db.collection("workStation")
          .doc(currentWsId)
          .collection("dashboard")
          .doc(boardId)
          .collection("task")
          .doc("123")
          .collection(name)
          .doc(listId)
          .set({
            ...copy,
          });
      })
      .then(() => {
        db.collection("workStation")
          .doc(currentWsId)
          .collection("dashboard")
          .doc(boardId)
          .collection("task")
          .doc("123")
          .collection(statusName)
          .doc(listId)
          .delete();
      });
  };

  const changePriority = (name) => {
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc("123")
      .collection(statusName)
      .doc(listId)
      .update({
        priority: name,
      });
  };

  return (
    <div className="taskItem retroBox">
      <div className="taskName">
        <p>
          <strong>{taskName}</strong>
        </p>
      </div>
      {db_Data?.activeModules.includes("Created By") && (
        <div className="createdBy module">
          <div className="name">
            <p>Created By</p>
          </div>
          <div className="moduleBox createdBy">
            <Avatar src={userPhoto} />
          </div>
        </div>
      )}
      {db_Data?.activeModules.includes("Assign") && (
        <div className=" module">
          <div className="name">
            <p>Assign</p>
          </div>
          <div className="moduleBox">
            <Assign
              currentWsId={currentWsId}
              boardId={boardId}
              dbName={statusName}
              listId={listId}
            />
          </div>
        </div>
      )}
      {db_Data?.activeModules.includes("Created Date") && (
        <div className="dateCreated module">
          <div className="name">
            <p>Date Created</p>
          </div>
          <div className="moduleBox">
            <CreatedAt timestamp={dateCreated} />
          </div>
        </div>
      )}
      {db_Data?.activeModules.includes("Deadline") && (
        <div className="deadLine module">
          <div className="name">
            <p>Deadline</p>
          </div>
          <div className="moduleBox">
            <DeadLine
              currentWsId={currentWsId}
              boardId={boardId}
              dbName={statusName}
              listId={listId}
              deadLine={deadLineDate}
              dateCreated={dateCreated}
            />
          </div>
        </div>
      )}
      {db_Data?.activeModules.includes("Status") && (
        <div className="statusModule module">
          <div className="name">
            <p>Status</p>
          </div>
          <div className="moduleBox">
            <Status statusName={statusName} taskId={listId} />
          </div>
        </div>
      )}
      {db_Data?.activeModules.includes("Priority") && (
        <div className="module">
          <div className="name">
            <p>Priority</p>
          </div>
          <div className="moduleBox">
            <Priority
              currentWsId={currentWsId}
              boardId={boardId}
              dbName={statusName}
              listId={listId}
              priority={priority}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;
