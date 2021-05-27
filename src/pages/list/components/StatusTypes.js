import React, { useState } from "react";
import { db } from "../../../lib/firebase";
import { useSelector } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import ColorPicker from "../../../components/ColorPicker";
import DeleteIcon from "@material-ui/icons/Delete";

function StatusTypes({ data, boardId, currentWsId, db_Data }) {
  const [colorPickerStatus, setColorPickerStatus] = useState(false);
  const [xPos, setXpos] = useState(130);

  const deleteStatus = () => {
    let statusType = db_Data.statusType;
    for (let i = 0; i < statusType.length; i++) {
      if (statusType[i] === data) {
        statusType.splice(i, 1);
      }
    }

    let colors = db_Data.colors;
    delete colors[data];

    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .update({
        statusType,
        colors,
      });

    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc("123")
      .collection(data)
      .get()
      .then((docs) => {
        docs.forEach((doc) => {
          doc.ref.delete();
        });
      });

    setXpos(130);
  };
  return (
    <div className="listSettings__task">
      <motion.div
        className="listSettings__statusPick"
        style={{ background: db_Data.colors[data] }}
        onClick={() => setColorPickerStatus(!colorPickerStatus)}
      >
        <AnimatePresence>
          {colorPickerStatus && (
            <>
              <div className="layer"></div>
              <motion.div
                className="listSetting__colorPickerPosition"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ y: 0, opacity: 1 }}
              >
                <ColorPicker name={data} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.div>
      <div className="listSettings__taskName">
        <p>{data}</p>
      </div>
      <motion.div className="listSettings__deleteStatus">
        <motion.div className="listSetting__holdButtons">
          <motion.div className="listSettings__buttons" animate={{ x: xPos }}>
            <DeleteIcon fontSize="small" onClick={() => setXpos(10)} />
            <p onClick={() => setXpos(130)}>Cancel</p>
            <p onClick={() => deleteStatus()}>Delete</p>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default StatusTypes;
