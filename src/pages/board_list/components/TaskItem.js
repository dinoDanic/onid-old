import React, { useEffect, useState } from "react";
import "../styles/taskItem.scss";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { db } from "../../../lib/firebase";
import { convertDate } from "../../../functions";

//DATE STUF
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

//Material ui
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";
import Grid from "@material-ui/core/Grid";

function TaskItem({ taskName, statusName, listId }) {
  const db_Data = useSelector((state) => state.dbData);
  const history = useHistory();
  const currentWsId = history.location.pathname.split("/")[2];
  const boardId = history.location.pathname.split("/")[4];
  const [deadLineDate, setDeadLineDate] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [daysLeftColor, setDaysLeftColor] = useState("");
  const [daysLeftCounter, setDaysLeftCounter] = useState(0);

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
          }
        });
    };
    loadTaskData();
  }, []);

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

  return (
    <div className="taskItem brutalBox">
      <div className="taskName">
        <p>
          <strong>{taskName}</strong>
        </p>
      </div>
      {db_Data?.activeModules.includes("Created Date") && (
        <div className="dateCreated module">
          <div className="name">
            <p>Date Created</p>
          </div>
          <div className="moduleBox dateCreated ">
            <p>{convertDate(dateCreated)}</p>
          </div>
        </div>
      )}
      {db_Data?.activeModules.includes("Deadline") && (
        <div className="deadLine module">
          <div className="name">
            <p>Deadline</p>
          </div>
          <div className="moduleBox deadline">
            <div
              className="daysLeft"
              style={{ background: `${daysLeftColor}` }}
            >
              <p>{daysLeftCounter}</p>
            </div>
            <p>{convertDate(deadLineDate)}</p>
            <div className="datePicker">
              <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <Grid container justify="space-around">
                  <KeyboardDatePicker
                    size="small"
                    disableToolbar
                    variant="inline"
                    format="dd/MM/yyyy"
                    margin="normal"
                    id="date-picker-inline"
                    value={selectedDate}
                    onChange={handleDateChange}
                    KeyboardButtonProps={{
                      "aria-label": "change date",
                    }}
                  />
                </Grid>
              </MuiPickersUtilsProvider>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TaskItem;
