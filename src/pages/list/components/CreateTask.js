import React, { useEffect, useState } from "react";
import { db, timestamp } from "../../../lib/firebase";
import { useSelector } from "react-redux";
import "../style/createTask.scss";
import BrutalBtn from "../../../components/brutal/BrutalBtn";

//DATE STUF
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

// MATERIAL UI AND FRAMER
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";
import { Avatar, Grid } from "@material-ui/core";
import { motion } from "framer-motion";
import AddIcon from "@material-ui/icons/Add";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import CloseIcon from "@material-ui/icons/Close";
import CalendarTodayIcon from "@material-ui/icons/CalendarToday";
import EventAvailableIcon from "@material-ui/icons/EventAvailable";

function CreateTask({ setTaskWindow, boardId, currentWsId }) {
  const userInfo = useSelector((state) => state.userInfo);
  const members_ws = useSelector((state) => state.membersWs);
  const db_Data = useSelector((state) => state.dbData);
  const [openChooseStatus, setOpenChooseStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [popMembers, setPopMembers] = useState(false);
  const [memberPhoto, setMemberPhoto] = useState("");
  const [forMember, setForMember] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [deadlineState, setDeadlineState] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [priorityPopState, setPriorityPopState] = useState(false);
  const [inputTask, setInputTask] = useState("");
  const [assignUserId, setAssignUserId] = useState("");
  const [priorityStatus, setPriorityStatus] = useState({
    priority: "Normal",
    color: "",
  });

  const CreateSuperTask = () => {
    if (inputTask === "") {
      alert("task empty");
      return;
    }
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc("123")
      .collection(newStatus)
      .add({
        taskName: inputTask,
        created: timestamp,
        userId: userInfo.uid,
        priority: priorityStatus.priority,
        status: newStatus,
        assignedUser: assignUserId,
        deadLine: selectedDate,
      })
      .then((data) => {
        db.collection("workStation")
          .doc(currentWsId)
          .collection("dashboard")
          .doc(boardId)
          .collection("task")
          .doc("123")
          .collection(newStatus)
          .doc(data.id)
          .set(
            {
              listId: data.id,
            },
            { merge: true }
          );
      });
    setTaskWindow(false);
  };

  const handleNewStatus = (data) => {
    setNewStatus(data);
    setOpenChooseStatus(false);
  };

  const handleSetMemberPhoto = (member) => {
    setMemberPhoto(member.userPhoto);
    setForMember(member);
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const setIconDate = (date) => {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    console.log(day, month, year);
    setDeadlineDate(`${day}.${month}.`);
    setDeadlineState(false);
  };

  const clearDate = () => {
    setDeadlineState(false);
    setDeadlineDate("");
  };

  useEffect(() => {
    if (db_Data) {
      setNewStatus(db_Data.statusType[0]);
    }
  }, [db_Data]);

  const handlePriority = (data) => {
    setPriorityStatus({
      priority: data.name,
      color: data.color,
    });
    setPriorityPopState(false);
  };
  const handleDeadlineBtn = () => {
    setDeadlineState(!deadlineState);
    setPriorityPopState(false);
  };
  const handlePriorityBtn = () => {
    setDeadlineState(false);
    setPriorityPopState(!priorityPopState);
  };

  return (
    <motion.div
      className="createTask__window retroBox"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
    >
      <div className="createTask__taskName">
        <div
          className="createTask__status"
          style={{ background: db_Data?.colors[newStatus] }}
        >
          <p onClick={() => setOpenChooseStatus(true)}>{newStatus}</p>
          {openChooseStatus && (
            <>
              <div
                className="layer"
                onClick={() => setOpenChooseStatus(!openChooseStatus)}
              ></div>
              <div className="createTask__chooseStatus retroBox">
                {db_Data?.statusType.map((data) => {
                  return (
                    <motion.p
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={() => handleNewStatus(data)}
                      style={{ background: db_Data?.colors[data] }}
                    >
                      {data}
                    </motion.p>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <input
          type="text"
          className="retroInput retroInput-w100 "
          placeholder="Type task.."
          spellcheck="false"
          onChange={(e) => setInputTask(e.target.value)}
        />
        <div className="createTask__close" onClick={() => setTaskWindow(false)}>
          <button className="retroBtn retroBtn-letter">
            <CloseIcon fontSize="small" />
          </button>
        </div>
      </div>
      <div className="createTask__ass">
        <p className="list__createTask-p">Assign </p>
        <div
          className="createTask__avatar"
          onClick={() => setPopMembers(!popMembers)}
        >
          <Avatar src={memberPhoto} />
          <div className="createTask__add">
            <AddIcon style={{ background: db_Data?.colors[newStatus] }} />
          </div>
          {popMembers && (
            <>
              <div
                className="layer"
                onClick={() => setPopMembers(!popMembers)}
              ></div>
              <div className="createTask__popUsers retroBox">
                {members_ws?.map((member) => {
                  return (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="createTask__popAvatar"
                      onClick={() => handleSetMemberPhoto(member)}
                    >
                      <Avatar
                        src={member.userPhoto}
                        onClick={() => setAssignUserId(member.userId)}
                      />
                      <p>{member.userName}</p>
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}
        </div>
        <p style={{ color: "white" }}>?</p>
      </div>
      <div className="createTask__addComment">
        <textarea
          className="retroBox"
          placeholder="Add Comment.."
          spellcheck="false"
        />
      </div>
      <div className="createTask__optionsMenu">
        <>
          {deadlineState && (
            <motion.div className="createTask__options retroBox">
              <motion.div
                className="createTask__optionsPop"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <Grid container justify="space-around">
                    <KeyboardDatePicker
                      size="small"
                      disableToolbar
                      variant="inline"
                      format="dd/MM/yyyy"
                      margin="normal"
                      id="date-picker-inline"
                      label="Deadline"
                      value={selectedDate}
                      onChange={handleDateChange}
                      KeyboardButtonProps={{
                        "aria-label": "change date",
                      }}
                    />
                  </Grid>
                </MuiPickersUtilsProvider>

                <button
                  onClick={() => setIconDate(selectedDate)}
                  className="retroBtn retroBtn-small2 retroBtn-width100"
                >
                  set date
                </button>

                <button
                  onClick={() => clearDate()}
                  className="retroBtn retroBtn-danger retroBtn-small2 retroBtn-width100"
                >
                  clear date
                </button>
              </motion.div>
            </motion.div>
          )}

          <button
            onClick={() => handleDeadlineBtn()}
            className="retroBtn retroBtn-letter"
          >
            {deadlineDate ? (
              <EventAvailableIcon fontSize="small" />
            ) : (
              <CalendarTodayIcon fontSize="small" />
            )}
          </button>

          <div className="createTask__priority">
            {priorityPopState && (
              <div className="createTask__priorityPop retroBox">
                {db_Data?.priority?.map((data) => {
                  console.log(data);
                  return (
                    <motion.div
                      className="createTask__prioritys"
                      initial={{ opacity: 0, scale: 0.3 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ color: data.color }}
                      onClick={() => handlePriority(data)}
                    >
                      <PriorityHighIcon />
                      <p>{data.name}</p>
                    </motion.div>
                  );
                })}
              </div>
            )}
            <button
              onClick={() => handlePriorityBtn()}
              className="retroBtn retroBtn-letter"
              style={{ background: priorityStatus.color }}
            >
              <PriorityHighIcon fontSize="small" />
            </button>
          </div>
        </>
      </div>

      <div
        className="createTask__buttonCreate"
        onClick={() => CreateSuperTask()}
      >
        <button className="retroBtn retroBtn-info">Create</button>
      </div>
    </motion.div>
  );
}

export default CreateTask;
