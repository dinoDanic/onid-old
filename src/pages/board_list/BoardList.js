import React, { useEffect, useState } from "react";
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
  const [allTasks, setAllTasks] = useState([]);

  // get db_Data and dispatch
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
    const getAllTasks = () => {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .doc(boardId)
        .collection("task")
        .orderBy("index", "asc")
        .onSnapshot((data) => {
          let list = [];
          data.forEach((doc) => {
            list.push(doc.data());
          });
          setAllTasks(list);
        });
    };
    get_db_Data();
    getAllTasks();
  }, [currentWsId, boardId]);

  const handleDragEnd = ({ destination, source, draggableId }) => {
    let taskId = draggableId;
    console.log(taskId);
    console.log("from", destination);
    console.log("to", source);

    if (!destination) {
      console.log("return");
      return;
    }
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      console.log("return");
      return;
    }

    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("task")
      .doc(taskId)
      .update({
        status: destination.droppableId,
      });
  };

  return (
    <div className="boardList">
      <DragDropContext onDragEnd={handleDragEnd}>
        {db_Data?.statusType?.map((statusName, key) => {
          const statusTask = allTasks.filter(
            (task) => task.status === statusName
          );
          return (
            <>
              <div key={statusName} className="column">
                <h3>{statusName}</h3>
                <Droppable droppableId={statusName}>
                  {(provided) => {
                    return (
                      <div
                        className="droppable-col"
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {statusTask.map((data, index) => {
                          return (
                            <Draggable
                              key={data.listId}
                              index={index}
                              draggableId={data.listId}
                            >
                              {(provided) => {
                                return (
                                  <div
                                    className="item"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    {data.taskName}
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            </>
          );
        })}
      </DragDropContext>
    </div>
  );
}

export default BoardList;
