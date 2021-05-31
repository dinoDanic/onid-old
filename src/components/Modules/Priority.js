import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { db } from "../../lib/firebase";

// Ui
import { AnimatePresence, motion } from "framer-motion";
import PriorityHighIcon from "@material-ui/icons/PriorityHigh";
import ImportExportIcon from "@material-ui/icons/ImportExport";

function Priority({ currentWsId, boardId, dbName, listId, priority }) {
  const db_Data = useSelector((state) => state.dbData);
  const [priorityMenuState, setPriorityMenuState] = useState(false);
  const [bgPriority, setBgPriority] = useState("");

  const setNewState = (name) => {
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc("123")
      .collection(dbName)
      .doc(listId)
      .update({
        priority: name,
      });
    setPriorityMenuState(false);
  };

  useEffect(() => {
    //get bg priority
    const getBgPriority = () => {
      // background of priority
      if (db_Data.priority) {
        const Array = db_Data.priority;
        const result = Array.find((obj) => {
          return obj.name === priority;
        });
        if (result === undefined) {
          return;
        }
        setBgPriority(result.color);
      }
    };

    getBgPriority();
  }, [priority]);

  return (
    <div className="listItem__comp listItem__priority " name="Priority">
      <AnimatePresence>
        {priorityMenuState && (
          <>
            <div
              className="layer"
              onClick={() => setPriorityMenuState(!priorityMenuState)}
            ></div>
            <motion.div
              className="listItem__popBox"
              initial={{ y: 10, opacity: 0 }}
              animate={{
                y: 0,
                opacity: 1,
              }}
            >
              {db_Data?.priority?.map((data) => {
                return (
                  <motion.div
                    className="listItem__popBoxInside listItem__priorityItem retroLabel"
                    style={{ background: data.color }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setNewState(data.name)}
                  >
                    <p>{data.name}</p>
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
      <div
        className="listItem__priorityBox retroLabel"
        style={{ background: bgPriority }}
        onClick={() => setPriorityMenuState(!priorityMenuState)}
      >
        <PriorityHighIcon fontSize="small" />
        <p>{priority}</p>
      </div>
    </div>
  );
}

export default Priority;
