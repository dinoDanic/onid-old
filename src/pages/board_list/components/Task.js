import React, { useState, useEffect, useRef } from "react";
import { Draggable } from "react-beautiful-dnd";
import { useSelector } from "react-redux";
import { db, timestamp } from "../../../lib/firebase";
import TaskItem from "./TaskItem";
import "../styles/task.scss";

//materiaul ui
import DragHandleIcon from "@material-ui/icons/DragHandle";
function Task({ statusName, currentWsId, boardId }) {
  const db_Data = useSelector((state) => state.dbData);
  const userInfo = useSelector((state) => state.userInfo);
  const [tasks, setTasks] = useState([]);
  const [inputTask, setInputTask] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const inputRef = useRef();

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

  useEffect(() => {
    const getCurrentIndex = () => {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .doc(boardId)
        .collection("task")
        .doc("123")
        .collection(statusName)
        .onSnapshot((data) => {
          setCurrentIndex(data.size);
        });
    };
    getCurrentIndex();
  }, [currentIndex]);
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
                    <div className="task-index">{task.index}</div>
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
