import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";

//DATE STUF
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";

// UI
import { motion } from "framer-motion";
import Grid from "@material-ui/core/Grid";
import {
  MuiPickersUtilsProvider,
  KeyboardDatePicker,
} from "@material-ui/pickers";

function DeadLine({
  dateCreated,
  deadLine,
  currentWsId,
  boardId,
  dbName,
  listId,
}) {
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [daysLeftColor, setDaysLeftColor] = useState("");
  const [daysLeftCounter, setDaysLeftCounter] = useState(0);

  const getDeadlineDate = () => {
    if (deadLine) {
      let myTime = deadLine.toDate();
      let date = myTime.getDate();
      let month = myTime.getMonth();
      let year = myTime.getFullYear();
      return `${date}.${month + 1}.${year}`;
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc("123")
      .collection(dbName)
      .doc(listId)
      .set(
        {
          deadLine: date,
        },
        { merge: true }
      );
  };

  useEffect(() => {
    if (dateCreated && deadLine) {
      let oneDay = 1000 * 60 * 60 * 24;
      let createdDate = dateCreated.toDate();
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
  }, [dateCreated, deadLine, setDaysLeftCounter]);

  return (
    <motion.div
      className="listItem__deadLine listItem__comp retroLabel "
      name="Deadline"
      whileHover={{ scale: 1.05 }}
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
    </motion.div>
  );
}

export default DeadLine;
