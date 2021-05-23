import React, { useEffect, useState, useRef } from "react";
import { db } from "../../lib/firebase";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dbData } from "../../actions";

//COMPOPNENTS
import Task from "./components/Task";

//MATERIAL UI
import { Avatar, Button, Fab, Grid } from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import { AnimatePresence, motion } from "framer-motion";
import CloseIcon from "@material-ui/icons/Close";
import ScheduleIcon from "@material-ui/icons/Schedule";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import {
  KeyboardDatePicker,
  MuiPickersUtilsProvider,
} from "@material-ui/pickers";

//DATE STUF
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import { setDate } from "date-fns/esm";

function List() {
  const members_ws = useSelector((state) => state.membersWs);
  const db_Data = useSelector((state) => state.dbData);
  const wsDataColor = useSelector((state) => state.wsData.color);
  const dispatch = useDispatch();
  const history = useHistory();
  const currentWsId = history.location.pathname.split("/")[2];
  const boardId = history.location.pathname.split("/")[4];
  const [ListSettingsStatus, setListSettingsStatus] = useState(false);
  const [openChooseStatus, setOpenChooseStatus] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [popMembers, setPopMembers] = useState(false);
  const [memberPhoto, setMemberPhoto] = useState("");
  const [forMember, setForMember] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [deadlineState, setDeadlineState] = useState(false);
  const [deadlineDate, setDeadlineDate] = useState("");
  const [taskWindow, setTaskWindow] = useState(false);

  useEffect(() => {
    console.log("dispatching main db_Data OUT");
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
      <AnimatePresence>
        {taskWindow && (
          <motion.div
            className="list__createTask-window"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
          >
            <div className="list__createTask-taskName">
              <div
                className="list__createTask-status"
                style={{ background: db_Data?.colors[newStatus] }}
              >
                <p onClick={() => setOpenChooseStatus(true)}>{newStatus}</p>
                {openChooseStatus && (
                  <>
                    <div
                      className="layer"
                      onClick={() => setOpenChooseStatus(!openChooseStatus)}
                    ></div>
                    <div className="list__createTask-chooseStatus">
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
              <input type="text" placeholder="Type task.." spellcheck="false" />
            </div>
            <div className="list__createTask-ass">
              <p className="list__createTask-p">Assign </p>
              <div
                className="list__createTask-avatar"
                onClick={() => setPopMembers(!popMembers)}
              >
                <Avatar src={memberPhoto} />
                <div className="list__createTast-add">
                  <AddIcon style={{ background: db_Data?.colors[newStatus] }} />
                </div>
                {popMembers && (
                  <>
                    <div
                      className="layer"
                      onClick={() => setPopMembers(!popMembers)}
                    ></div>
                    <div className="list__createTask-popUsers">
                      {members_ws?.map((member) => {
                        return (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.3 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0 }}
                            className="list__pop-avatar"
                            onClick={() => handleSetMemberPhoto(member)}
                          >
                            <Avatar src={member.userPhoto} />
                            <p>{member.userName}</p>
                          </motion.div>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="list__createTask-addComment">
              <textarea placeholder="Add Comment.." spellcheck="false" />
            </div>
            <div className="list__createTask--optionsMenu">
              <>
                <Fab
                  size="small"
                  onClick={() => setDeadlineState(true)}
                  aria-label="add"
                >
                  <ScheduleIcon fontSize="small" />
                  <div className="list__createTask-fabDate">
                    <p>{deadlineDate}</p>
                  </div>
                </Fab>
                <Fab size="small" aria-label="add">
                  <PriorityHighIcon fontSize="small" />
                </Fab>
              </>
            </div>
            {deadlineState && (
              <motion.div
                className="list__createTask-options"
                initial={{ opacity: 0, scale: 0.3 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <>
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
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => setIconDate(selectedDate)}
                  >
                    Set Date
                  </Button>
                  <Button
                    size="small"
                    color="secondary"
                    onClick={() => clearDate()}
                  >
                    Clear Date
                  </Button>
                </>
              </motion.div>
            )}
            <div className="listCreateTask--buttonCreate">
              <Button variant="outlined" size="small" color="primary">
                Create
              </Button>
            </div>
            <div
              className="listCreateTask--close"
              onClick={() => setTaskWindow(!taskWindow)}
            >
              <CloseIcon />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div className="list__createTask">
        <div className="list__icon">
          <Fab
            onClick={() => setTaskWindow(!taskWindow)}
            color="primary"
            aria-label="add"
            style={{ background: wsDataColor }}
          >
            <AddIcon fontSize="small" /> Task
          </Fab>
        </div>
      </div>
    </>
  );
}
export default List;
