import React, { useEffect, useState } from "react";
import { db } from "../../../lib/firebase";
import { useSelector } from "react-redux";

//DATE STUF
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

//STYLE
import "../../../styles/listItem.scss";

//MATERIAL UI
import { Avatar } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import { AnimatePresence, motion } from "framer-motion";

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
}) {
  const wsData = useSelector((state) => state.wsData);
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

  useEffect(() => {
    const setOrder = () => {
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
  }, [moduleData]);

  const handleDateChange = (date) => {
    setSelectedDate(date);
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc(listId)
      .set(
        {
          deadLine: date,
        },
        { merge: true }
      );
  };
  const getDateCreated = () => {
    if (timestamp) {
      let myTime = timestamp.toDate();
      let date = myTime.getDate();
      let month = myTime.getMonth();
      let year = myTime.getFullYear();
      return `${date}.${month + 1}.${year}`;
    }
  };

  const getDeadlineDate = () => {
    if (deadLine) {
      let myTime = deadLine.toDate();
      let date = myTime.getDate();
      let month = myTime.getMonth();
      let year = myTime.getFullYear();
      return `${date}.${month + 1}.${year}`;
    }
  };

  useEffect(() => {
    const getCreatedByPhotoUrl = () => {
      db.collection("users")
        .doc(userId)
        .get()
        .then((docData) => {
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

  useEffect(() => {
    if (wsData) {
      let list = [];
      wsData.users.map((id) => {
        db.collection("users")
          .doc(id)
          .get()
          .then((data) => {
            list.push(data.data());
          });
      });
      setChooseUsersData(list);
    }
  }, [wsData]);

  const assignUser = (id) => {
    console.log(id);
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc(listId)
      .set(
        {
          assignedUser: id,
        },
        { merge: true }
      );
    setChooseUserState(false);
  };

  useEffect(() => {
    // check for assigned user
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc(listId)
      .get()
      .then((data) => {
        if (data.exists) {
          if (data.data().assignedUser != undefined) {
            db.collection("users")
              .doc(data.data().assignedUser)
              .get()
              .then((data) => {
                if (data.exists) {
                  setAssignedUser(data.data().userPhoto);
                }
              });
          } else {
            return;
          }
        }
      });
  }, [boardId, listId, chooseUserState]);

  useEffect(() => {
    // set color of status and type of status
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .onSnapshot((docData) => {
        if (docData.exists) {
          //set color by current name
          setStatusBg(docData.data().colors[`${dbName}`]);
          //get all colors
          setAllColors(docData.data().colors);
          //get status type data
          setStatusType(docData.data().statusType);
        }
      });
  }, []);

  const changeStatus = (name) => {
    console.log(name);
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc(listId)
      .update({
        status: name,
      });
  };

  return (
    <div className="listItem">
      <div className="listItem__taskName">
        <p>{name}</p>
      </div>

      <div className="listItem__fnHolder">
        <div className="listItem__fn">
          {createdBy && (
            <div
              className="listItem__createdBy listItem__comp"
              name="Created By"
              style={{ order: createdByOrder }}
            >
              <Avatar src={createdByPhtotUrl} />
            </div>
          )}
          {createdAt && (
            <div
              className="listItem__createdAt listItem__comp boxShadow"
              name="Created Date"
              style={{ order: createdDateOrder }}
            >
              <p>{getDateCreated()}</p>
            </div>
          )}
          {deadLineState && (
            <>
              <div
                className="listItem__deadLine listItem__comp boxShadow"
                name="Deadline"
                style={{ order: deadlineOrder }}
              >
                <div className="listItem__showDeadDate">
                  <p>{getDeadlineDate()}</p>
                </div>
                <div className="listItem__deadPicker">
                  <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around">
                      <KeyboardDatePicker
                        size="small"
                        disableToolbar
                        variant="inline"
                        format="dd/MM/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="label test"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                          "aria-label": "change date",
                        }}
                      />
                    </Grid>
                  </MuiPickersUtilsProvider>
                </div>
                <div
                  className="listItem__daysLeft "
                  style={{ background: `${daysLeftColor}` }}
                >
                  <p>{daysLeftCounter}</p>
                </div>
              </div>
            </>
          )}
          {assignState && (
            <div
              className="listItem__comp listItem__assign"
              name="Assign"
              style={{ order: assignOrder }}
            >
              <div className="listItem__assignAvatar">
                <Avatar
                  src={assignedUser}
                  onClick={() => setChooseUserState(!chooseUserState)}
                />
              </div>
              {chooseUserState && (
                <>
                  <div
                    className="layer"
                    onClick={() => setChooseUserState(!chooseUserState)}
                  ></div>
                  <div className="listItem__chooseUser">
                    {chooseUsersData &&
                      chooseUsersData.map((data) => {
                        return (
                          <>
                            <div
                              className="listItem__chooseUserInside"
                              onClick={() => assignUser(data.userId)}
                            >
                              <Avatar src={data.userPhoto} />
                              <p>{data.userName}</p>
                            </div>
                          </>
                        );
                      })}
                  </div>
                </>
              )}
            </div>
          )}
          {statusState && (
            <>
              <div
                className="listItem__comp listItem__status boxShadow"
                name="Status"
                style={{ order: statusOrder, background: statusBg }}
                onClick={() => setStatusMenuState(!statusMenuState)}
              >
                <p>{dbName}</p>
                <AnimatePresence>
                  {statusMenuState && (
                    <>
                      <div
                        className="layer"
                        onClick={() => setStatusMenuState(!statusMenuState)}
                      ></div>
                      <motion.div
                        className="listItem__statusMenu"
                        exit={{ scale: 0.3, opacity: 0 }}
                        initial={{ scale: 0.3 }}
                        animate={{ scale: 1 }}
                      >
                        {statusType &&
                          statusType.map((name) => {
                            return (
                              <motion.div
                                className="listItem__statusItem"
                                style={{ background: allColors[name] }}
                                onClick={() => changeStatus(name)}
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.9 }}
                              >
                                <p>{name}</p>
                              </motion.div>
                            );
                          })}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </>
          )}
          {priorityState && (
            <div
              className="listItem__comp boxShadow"
              name="Priority"
              style={{ order: priorityOrder }}
            >
              fadsfsad
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ListItem;
