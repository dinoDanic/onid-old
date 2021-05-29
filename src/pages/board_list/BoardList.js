import React, { useEffect, useState, useRef } from "react";
import { db, timestamp } from "../../lib/firebase";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { dbData } from "../../actions";
import { createNewTask } from "../../functions/";

// Components
import Task from "./components/Task";

//Drag and Drop
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

//style
import "./styles/boardList.scss";
import { debounce } from "@material-ui/core";

function BoardList() {
  const db_Data = useSelector((state) => state.dbData);
  const userInfo = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const history = useHistory();
  const currentWsId = history.location.pathname.split("/")[2];
  const boardId = history.location.pathname.split("/")[4];
  const [inputTask, setInputTask] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  /*  document.getElementById(`${key}-input`).value = ""; */

  // get db_Data and dispatch
  useEffect(() => {
    const get_db_Data = () => {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .doc(boardId)
        .onSnapshot((docData) => {
          if (docData.exists) {
            dispatch(dbData(docData.data()));
          }
        });
    };

    get_db_Data();
  }, [currentWsId, boardId]);

  const handleDragEnd = async ({ destination, source, draggableId }) => {
    let taskId = draggableId;
    /*     let currentIndex = 0;
    let lastIndexTask = null; */
    console.log("destination", destination);
    if (!destination) {
      return;
    }
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }

    /*  await db
      //GET INDEX
      .collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc("123")
      .collection(source.droppableId)
      .doc(taskId)
      .get()
      .then((data) => {
        currentIndex = data.data().index;
      })
      // UPDATE INDEX
      .then(() => {
        db.collection("workStation")
          .doc(currentWsId)
          .collection("dashboard")
          .doc(boardId)
          .collection("task")
          .doc("123")
          .collection(source.droppableId)
          .doc(taskId)
          .update({
            index: destination.index,
          });
      }); */
    /*   // FIND TASK ID WITH LAST INDEX
      .then(() => {
        db.collection("workStation")
          .doc(currentWsId)
          .collection("dashboard")
          .doc(boardId)
          .collection("task")
          .doc("123")
          .collection(source.droppableId)
          .where("index", "==", currentIndex)
          .get()
          .then((data) => {
            data.forEach((doc) => {
              lastIndexTask = doc.data().listId;
            });
          })
          // GO TO TASK AND UPDATE INDEX
          .then(() => {
            db.collection("workStation")
              .doc(currentWsId)
              .collection("dashboard")
              .doc(boardId)
              .collection("task")
              .doc("123")
              .collection(source.droppableId)
              .doc(lastIndexTask)
              .update({
                index: currentIndex + 1,
              });
          });
      }); */

    if (source.droppableId === destination.droppableId) {
      return;
    }
    let copy = {};
    await db
      .collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc("123")
      .collection(source.droppableId)
      .doc(taskId)
      .get()
      .then((doc) => {
        copy = doc.data();
      })
      .then(() => {
        db.collection("workStation")
          .doc(currentWsId)
          .collection("dashboard")
          .doc(boardId)
          .collection("task")
          .doc("123")
          .collection(destination.droppableId)
          .doc(copy.listId)
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
          .collection(source.droppableId)
          .doc(taskId)
          .delete();
      });
  };

  return (
    <div className="boardList">
      <DragDropContext onDragEnd={handleDragEnd}>
        {db_Data?.statusType?.map((statusName, key) => {
          return (
            <div key={statusName} className="column">
              <div
                className="statusName"
                style={{ background: db_Data.colors[statusName] }}
              >
                <h4>{statusName}</h4>
              </div>
              <Droppable droppableId={statusName}>
                {(provided) => {
                  return (
                    <div
                      className="droppable-col"
                      style={{ background: db_Data.colors[statusName] }}
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                    >
                      <Task
                        statusName={statusName}
                        currentWsId={currentWsId}
                        boardId={boardId}
                      />

                      {provided.placeholder}
                    </div>
                  );
                }}
              </Droppable>
              <div className="createTask">
                <form
                  onSubmit={(e) => (
                    (document.getElementById(`${key}-input`).value = ""),
                    createNewTask(
                      e,
                      currentWsId,
                      boardId,
                      statusName,
                      inputTask,
                      userInfo.uid
                    )
                  )}
                >
                  <input
                    type="text"
                    style={{
                      outlineColor: db_Data.colors[statusName],
                    }}
                    placeholder="+ Task"
                    onChange={(e) => setInputTask(e.target.value)}
                    id={`${key}-input`}
                  />
                </form>
              </div>
            </div>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default BoardList;
