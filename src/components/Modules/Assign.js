import React, { useState, useEffect } from "react";
import { db } from "../../lib/firebase";
import { useSelector } from "react-redux";

// Ui
import { Avatar } from "@material-ui/core";
import { AnimatePresence, motion } from "framer-motion";
import ImportExportIcon from "@material-ui/icons/ImportExport";

function Assign({ currentWsId, boardId, dbName, listId }) {
  const wsData = useSelector((state) => state.wsData);
  const [assignedUser, setAssignedUser] = useState();
  const [chooseUserState, setChooseUserState] = useState(false);
  const [chooseUsersData, setChooseUsersData] = useState();

  const assignUser = (id) => {
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
          assignedUser: id,
        },
        { merge: true }
      );
    setChooseUserState(false);
  };

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

  useEffect(() => {
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc("123")
      .collection(dbName)
      .doc(listId)
      .onSnapshot((data) => {
        // check for assigned user
        if (data.exists) {
          if (
            data.data().assignedUser != undefined &&
            data.data().assignedUser != ""
          ) {
            db.collection("users")
              .doc(data.data().assignedUser)
              .get()
              .then((data) => {
                if (data.exists) {
                  setAssignedUser(data.data().userPhoto);
                }
              });
          }
        }
      });
  }, [boardId, listId, chooseUserState]);

  return (
    <motion.div className="listItem__comp listItem__assign" name="Assign">
      <div className="listItem__assignAvatar">
        <Avatar
          src={assignedUser}
          onClick={() => setChooseUserState(!chooseUserState)}
        />
      </div>
      <AnimatePresence>
        {chooseUserState && (
          <>
            <div
              className="layer"
              onClick={() => setChooseUserState(!chooseUserState)}
            ></div>
            <motion.div
              className="listItem__popBox"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {chooseUsersData &&
                chooseUsersData.map((data) => {
                  return (
                    <>
                      <div
                        className="listItem__popBoxInside"
                        onClick={() => assignUser(data.userId)}
                      >
                        <Avatar src={data.userPhoto} />
                        <p>{data.userName}</p>
                      </div>
                    </>
                  );
                })}
              <div className="listItem__arrow">
                <ImportExportIcon fontSize="small" />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default Assign;
