import React, { useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { useHistory } from "react-router-dom";
import { db, timestamp } from "../../../lib/firebase";
import { useSelector, useDispatch } from "react-redux";
import { activeModulesAction } from "../../../actions";
import { settings } from "../../../actions";

//MATERIAL UI AND FRAMER
import DragIndicatorIcon from "@material-ui/icons/DragIndicator";
import AddBoxIcon from "@material-ui/icons/AddBox";
import { Button, Fab } from "@material-ui/core";
import MenuOpenIcon from "@material-ui/icons/MenuOpen";
import ArrowDropDownCircleRoundedIcon from "@material-ui/icons/ArrowDropDownCircleRounded";

//COMPOPNENTS
import ListItem from "../components/ListItem";
import ModuleTypes from "../components/ModuleTypes";

//STYLE
import "../../../styles/list.scss";
import "../../../styles/fn.scss";

function ToDo() {
  const userInfo = useSelector((state) => state.userInfo);
  const activeModules = useSelector((state) => state.activeModules);
  const settingState = useSelector((state) => state.settings);
  const dispatch = useDispatch();
  const history = useHistory();
  const boardId = history.location.pathname.split("/")[4];
  const currentWsId = history.location.pathname.split("/")[2];
  const inputRef = useRef();
  const [inputTask, setInputTask] = useState("");
  const [listData, setListData] = useState();
  const [listToDo, setListToDo] = useState();
  const [currentOrderId, setCurrentOrderId] = useState(-1);
  const [createdByState, setCreatedByState] = useState(false);
  const [createdDateState, setCreatedDateState] = useState(false);
  const [deadLineState, setDeadLineState] = useState(false);
  const [assignState, setAssignState] = useState(false);
  const [moduleTypeData, setModuleTypeData] = useState([]);
  const [orderModules, setOrderModules] = useState();
  const [moduleData, setModuleData] = useState();
  const [counterTask, setCounterTask] = useState(0);
  const [taskColor, setTaskColor] = useState("#000");
  const [taskOpen, setTaskOpen] = useState(true);

  const createNewToDo = (e) => {
    e.preventDefault();
    if (currentWsId && boardId) {
      if (inputRef.current.value !== "") {
        db.collection("workStation")
          .doc(currentWsId)
          .collection("dashboard")
          .doc(boardId)
          .collection("to do")
          .add({
            taskName: inputTask,
            created: timestamp,
            userId: userInfo.uid,
          })
          .then((data) => {
            db.collection("workStation")
              .doc(currentWsId)
              .collection("dashboard")
              .doc(boardId)
              .collection("to do")
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

  /*   useEffect(() => {
    // get last order
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("list")
      .orderBy("orderId", "desc")
      .limit(1)
      .get()
      .then((doc) => {
        if (doc.empty) {
          setCurrentOrderId(-1);
        }
        doc.forEach((docData) => {
          setCurrentOrderId(docData.data().orderId);
        });
      });
  }, [listData, setListData]); */

  useEffect(() => {
    // get list ToDo data and counter
    const getListToDo = () => {
      if (currentWsId && boardId) {
        db.collection("workStation")
          .doc(currentWsId)
          .collection("dashboard")
          .doc(boardId)
          .collection("to do")
          .orderBy("created", "desc")
          .onSnapshot((doc) => {
            // get number of tasks
            setCounterTask(doc.size);
            // get data
            let list = [];
            doc.forEach((data) => {
              list.push(data.data());
            });
            setListToDo(list);
          });
      }
    };
    // get Module data
    if (currentWsId && boardId) {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .doc(boardId)
        .collection("modules")
        .orderBy("order", "asc")
        .onSnapshot((doc) => {
          let list = [];
          doc.forEach((data) => {
            list.push(data.data());
          });
          setModuleData(list);
        });
    }
    // check active fn and colors
    const checkActiveFn = () => {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .doc(boardId)
        .onSnapshot((data) => {
          if (data.exists) {
            dispatch(activeModulesAction(data.data().activeModules));
            // set module type data
            setModuleTypeData(data.data().moduleTypes);
            // set module type order
            setOrderModules(data.data().orderModules);
            // set color for task
            setTaskColor(data.data().colors["to do"]);
          }
        });
    };

    checkActiveFn();
    getListToDo();
  }, [currentWsId, boardId]);

  useEffect(() => {
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .onSnapshot((data) => {
        if (data.exists) {
          // set module type order
          setOrderModules(data.data().orderModules);
        }
      });
  }, []);

  useEffect(() => {
    if (activeModules) {
      if (activeModules.includes("Created By")) {
        setCreatedByState(true);
      } else {
        setCreatedByState(false);
      }
      if (activeModules.includes("Created Date")) {
        setCreatedDateState(true);
      } else {
        setCreatedDateState(false);
      }
      if (activeModules.includes("Deadline")) {
        setDeadLineState(true);
      } else {
        setDeadLineState(false);
      }
      if (activeModules.includes("Assign")) {
        setAssignState(true);
      } else {
        setAssignState(false);
      }
    }
  }, [activeModules]);

  function handleDragEnd(result) {
    /* const items = Array.from(listToDo);
    console.log(result, items);
    const [reorderItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderItem);
    setListToDo(listToDo); */
  }
  function handleDragEndModules(result) {
    const items = Array.from(moduleData);
    const [reorderItem] = items.splice(result.source.index, 1);

    items.splice(result.destination.index, 0, reorderItem);
    setModuleData(items);
    let cbo = items
      .map(function (e) {
        return e.module;
      })
      .indexOf("Created By");
    let cdo = items
      .map(function (e) {
        return e.module;
      })
      .indexOf("Created Date");
    let dlo = items
      .map(function (e) {
        return e.module;
      })
      .indexOf("Deadline");
    let ao = items
      .map(function (e) {
        return e.module;
      })
      .indexOf("Assign");

    const update = (name, order) => {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .doc(boardId)
        .collection("modules")
        .where("module", "==", name)
        .get()
        .then((data) => {
          data.forEach((doc) => {
            let id = doc.data().id;
            db.collection("workStation")
              .doc(currentWsId)
              .collection("dashboard")
              .doc(boardId)
              .collection("modules")
              .doc(id)
              .update({
                order: order,
              });
          });
        });
    };

    update("Created By", cbo);
    update("Deadline", dlo);
    update("Created Date", cdo);
    update("Assign", ao);
  }
  const getItemStyle = (isDragging, draggableStyle) => ({
    boxShadow: isDragging ? "0 0 8px -4px black" : "",
    borderLeft: `2px solid ${taskColor}`,

    ...draggableStyle,
  });

  return (
    <>
      <div className="list__header">
        <div className="list__toDo list__status">
          <div
            className="list__statusArrow"
            onClick={() => setTaskOpen(!taskOpen)}
          >
            <ArrowDropDownCircleRoundedIcon
              style={{
                color: taskColor,
                transform: taskOpen ? "" : "rotate(-90deg)",
              }}
            />
          </div>
          <div className="list__statusName" style={{ background: taskColor }}>
            <p>to do</p>
          </div>
          <div className="list__statusCounter">
            <p>{counterTask} tasks</p>
          </div>
        </div>
        {taskOpen && (
          <DragDropContext onDragEnd={handleDragEndModules}>
            <Droppable droppableId="modules" direction="horizontal">
              {(provided) => (
                <div
                  className="list__module"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {moduleData &&
                    moduleData.map((data, index) => {
                      return (
                        <Draggable
                          key={data.module}
                          draggableId={data.module}
                          index={index}
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              className="list__module-drag"
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                            >
                              <ModuleTypes name={data.module} />
                            </div>
                          )}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>
      {taskOpen && (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="listItems">
              {(provided) => (
                <ul {...provided.droppableProps} ref={provided.innerRef}>
                  {listToDo &&
                    listToDo.map((data, index) => {
                      return (
                        <Draggable
                          key={data.listId}
                          draggableId={data.listId}
                          index={index}
                        >
                          {(provided, snapshot) => (
                            <li
                              {...provided.draggableProps}
                              ref={provided.innerRef}
                              className="list__item"
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <div
                                className="list__itemDrag"
                                style={{
                                  position: "absolute",
                                  left: "10px",
                                }}
                                {...provided.dragHandleProps}
                              >
                                <DragIndicatorIcon fontSize="small" />
                              </div>

                              <ListItem
                                name={data.taskName}
                                userId={data.userId}
                                currentWsId={currentWsId}
                                boardId={boardId}
                                createdBy={createdByState}
                                createdAt={createdDateState}
                                timestamp={data.created}
                                deadLine={data.deadLine}
                                deadLineState={deadLineState}
                                listId={data.listId}
                                order={orderModules}
                                moduleData={moduleData}
                                assignState={assignState}
                              />
                            </li>
                          )}
                        </Draggable>
                      );
                    })}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

          <ul className="list__ul">
            <li>
              <form onSubmit={(e) => createNewToDo(e)}>
                <input
                  type="text"
                  placeholder="new task"
                  onChange={(e) => setInputTask(e.target.value)}
                  ref={inputRef}
                />
                <Button type="submit" size="small">
                  <AddBoxIcon />
                </Button>
              </form>
            </li>
          </ul>
        </>
      )}
      {/* SETTINGS MENU BTN */}
      <div
        className="list__addFn"
        onClick={() => dispatch(settings(!settingState))}
      >
        <Fab color="primary" aria-label="add" size="small">
          <MenuOpenIcon />
        </Fab>
      </div>
    </>
  );
}

export default ToDo;
