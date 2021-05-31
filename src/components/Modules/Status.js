import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { useHistory } from "react-router-dom";

// UI
import { AnimatePresence, motion } from "framer-motion";
import ImportExportIcon from "@material-ui/icons/ImportExport";

function Status({ statusName, taskId }) {
  const history = useHistory();
  const currentWsId = history.location.pathname.split("/")[2];
  const boardId = history.location.pathname.split("/")[4];
  const [statusMenuState, setStatusMenuState] = useState(false);
  const [statusType, setStatusType] = useState("");
  const [allColors, setAllColors] = useState();
  const [statusBg, setStatusBg] = useState("gray");

  useEffect(() => {
    // set color of status and type of status
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .onSnapshot((docData) => {
        if (docData.exists) {
          //set color by current name
          setStatusBg(docData.data().colors[`${statusName}`]);
          //get all colors
          setAllColors(docData.data().colors);
          //get status type data
          setStatusType(docData.data().statusType);
        }
      });
  }, []);

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
      .doc(taskId)
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
          .doc(taskId)
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
          .doc(taskId)
          .delete();
      });
  };

  return (
    <div
      className="listItem__comp listItem__status retroLabel"
      name="Status"
      style={{ background: statusBg }}
      onClick={() => setStatusMenuState(!statusMenuState)}
    >
      <p>{statusName}</p>
      <AnimatePresence>
        {statusMenuState && (
          <>
            <div
              className="layer"
              onClick={() => setStatusMenuState(!statusMenuState)}
            ></div>
            <motion.div
              className="listItem__statusMenu "
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {statusType &&
                statusType.map((name) => {
                  return (
                    <motion.div
                      className="listItem__statusItem retroLabel "
                      style={{ background: allColors[name] }}
                      onClick={() => changeStatus(name)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <p>{name}</p>
                    </motion.div>
                  );
                })}
              <div className="listItem__arrow">
                <ImportExportIcon fontSize="small" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Status;
