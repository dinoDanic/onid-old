import React, { useEffect, useState, useRef } from "react";
import { db } from "../../lib/firebase";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { dbData } from "../../actions";

//COMPOPNENTS
import Task from "./components/Task";

//MATERIAL UI
import { AnimatePresence } from "framer-motion";
import CreateTask from "./components/CreateTask";
import BrutalBtn from "../../components/brutal/BrutalBtn";

function List() {
  const db_Data = useSelector((state) => state.dbData);
  const wsDataColor = useSelector((state) => state.wsData.color);
  const dispatch = useDispatch();
  const history = useHistory();
  const currentWsId = history.location.pathname.split("/")[2];
  const boardId = history.location.pathname.split("/")[4];
  const [taskWindow, setTaskWindow] = useState(false);

  useEffect(() => {
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

      <AnimatePresence>
        {taskWindow && (
          <CreateTask
            setTaskWindow={setTaskWindow}
            currentWsId={currentWsId}
            boardId={boardId}
          />
        )}
      </AnimatePresence>
      <div
        className="list__createTask"
        onClick={() => setTaskWindow(!taskWindow)}
      >
        <BrutalBtn tekst="+ Task" width="80px" color={wsDataColor} />
      </div>
    </>
  );
}
export default List;
