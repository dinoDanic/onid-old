import React, { useState, useEffect, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { db } from "../../../lib/firebase";
import TaskItem from "./TaskItem";
import "../styles/task.scss";

//materiaul ui
import DragHandleIcon from "@material-ui/icons/DragHandle";
function Task({ statusName, currentWsId, boardId }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const getTasks = () => {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .doc(boardId)
        .collection("task")
        .doc("123")
        .collection(statusName)
        .orderBy("index", "asc")
        .onSnapshot((doc) => {
          let list = [];
          doc.forEach((docData) => {
            list.push(docData.data());
          });
          setTasks(list);
        });
    };

    getTasks();
  }, []);
  return (
    <>
      <div className="task__board">
        {tasks?.map((task, index) => {
          return (
            <Draggable
              key={task.listId}
              index={index}
              draggableId={task.listId}
            >
              {(provided) => {
                return (
                  <div
                    className="item"
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div className="item__drag" {...provided.dragHandleProps}>
                      <DragHandleIcon fontSize="small" />
                    </div>
                    {/*    <div className="task-index">{task.index}</div> */}
                    <TaskItem
                      statusName={statusName}
                      listId={task.listId}
                      taskName={task.taskName}
                    />
                  </div>
                );
              }}
            </Draggable>
          );
        })}
      </div>
    </>
  );
}

export default Task;
