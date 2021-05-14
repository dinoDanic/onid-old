import React, { useState, useEffect } from "react";
import { db, fieldValue } from "../../../lib/firebase";
import { useSelector } from "react-redux";
import { Button, Switch } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import "../../../styles/listSettings.scss";

function ListSettings() {
  const activeModules = useSelector((state) => state.activeModules);
  const history = useHistory();
  const boardId = history.location.pathname.split("/")[4];
  const currentWsId = history.location.pathname.split("/")[2];
  const [createdByState, setCreatedByState] = useState(false);
  const [createdDateState, setCreatedDateState] = useState(false);
  const [deadLineState, setDeadLineState] = useState(false);
  const [assignState, setAssignState] = useState(false);

  // check status of moddels and set it
  useEffect(() => {
    if (activeModules) {
      if (activeModules.includes("Created By")) {
        setCreatedByState(true);
      } else {
        setCreatedByState(false);
      }
      if (activeModules.includes("Created Date")) {
        setCreatedDateState(true);
      } else {
        setCreatedDateState(false);
      }
      if (activeModules.includes("Deadline")) {
        setDeadLineState(true);
      } else {
        setDeadLineState(false);
      }
      if (activeModules.includes("Assign")) {
        setAssignState(true);
      } else {
        setAssignState(false);
      }
    }
  }, [activeModules]);

  const handleFn = (prop1, set, state) => {
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .get()
      .then((docData) => {
        console.log(docData.data());
        if (activeModules) {
          if (docData.data().activeModules.includes(prop1)) {
            console.log("it dose");
            db.collection("workStation")
              .doc(currentWsId)
              .collection("dashboard")
              .doc(boardId)
              .update({
                activeModules: fieldValue.arrayRemove(prop1),
              });
            set(!state);
          } else {
            db.collection("workStation")
              .doc(currentWsId)
              .collection("dashboard")
              .doc(boardId)
              .update({
                activeModules: fieldValue.arrayUnion(prop1),
              });
            set(!state);
          }
        }
      });
  };
  return (
    <div className="lS">
      <h4>Active modules</h4>
      <Button>
        <div
          className="lS__createdBy lS__option"
          onClick={() =>
            handleFn("Created By", setCreatedByState, createdByState)
          }
        >
          <p>Created By</p>
          <Switch
            size="small"
            checked={createdByState}
            color="primary"
            name="checkedB"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </div>
      </Button>
      <Button>
        <div
          className="lS__createdDate lS__option"
          onClick={() =>
            handleFn("Created Date", setCreatedDateState, createdDateState)
          }
        >
          <p>Created Date</p>
          <Switch
            size="small"
            checked={createdDateState}
            color="primary"
            name="checkedB"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </div>
      </Button>
      <Button>
        <div
          className="lS__deadLine lS__option"
          onClick={() => handleFn("Deadline", setDeadLineState, deadLineState)}
        >
          <p>Deadline</p>
          <Switch
            size="small"
            checked={deadLineState}
            color="primary"
            name="checkedB"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </div>
      </Button>
      <Button>
        <div
          className="lS__assign lS__option"
          onClick={() => handleFn("Assign", setAssignState, assignState)}
        >
          <p>Assign</p>
          <Switch
            size="small"
            checked={assignState}
            color="primary"
            name="checkedB"
            inputProps={{ "aria-label": "primary checkbox" }}
          />
        </div>
      </Button>
    </div>
  );
}

export default ListSettings;
