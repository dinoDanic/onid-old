import React, { useEffect, useState, useRef } from "react";
import { db } from "../../lib/firebase";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { dbData } from "../../actions";

// Components
import Task from "./components/Task";

//Drag and Drop
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

//style
import "./styles/boardList.scss";

function BoardList() {
  const db_Data = useSelector((state) => state.dbData);
  const dispatch = useDispatch();
  const history = useHistory();
  const currentWsId = history.location.pathname.split("/")[2];
  const boardId = history.location.pathname.split("/")[4];

  const createNewTask = (e) => {
    e.preventDefault();
    if (currentWsId && boardId && statusName) {
      if (inputTask !== "") {
        console.log("starting to create");
        db.collection("workStation")
          .doc(currentWsId)
          .collection("dashboard")
          .doc(boardId)
          .collection("task")
          .doc("123")
          .collection(statusName)
          .add({
            taskName: inputTask,
            created: timestamp,
            userId: userInfo.uid,
            priority: "Normal",
            index: currentIndex,
          })
          .then((data) => {
            db.collection("workStation")
              .doc(currentWsId)
              .collection("dashboard")
              .doc(boardId)
              .collection("task")
              .doc("123")
              .collection(statusName)
              .doc(data.id)
              .set(
                {
                  listId: data.id,
                },
                { merge: true }
              );
          });
        inputRef.current.value = "";
      }
    }
  };

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
    if (!destination) {
      return;
    }
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }
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
            <>
              <div key={statusName} className="column">
                <div
                  className="statusName brutalBox"
                  style={{ background: db_Data.colors[statusName] }}
                >
                  <h4>{statusName}</h4>
                </div>
                <Droppable droppableId={statusName}>
                  {(provided) => {
                    return (
                      <div
                        className="droppable-col brutalBox"
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
              </div>
            </>
          );
        })}
        <div className="createTask">
          <form onSubmit={(e) => createNewTask(e)}>
            <input
              type="text"
              style={{
                outlineColor: db_Data.colors[statusName],
              }}
              placeholder="New Task.."
              onChange={(e) => setInputTask(e.target.value)}
              ref={inputRef}
            />
          </form>
        </div>
      </DragDropContext>
    </div>
  );
}

export default BoardList;
