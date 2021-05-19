import React, { useEffect, useState, useRef } from "react";
import { db } from "../lib/firebase";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, CircularProgress } from "@material-ui/core";
import "../styles/dashboard.scss";
import { wsDataAction } from "../actions";

//MATERIAL UI AND FRAMER
import { AnimatePresence, motion } from "framer-motion";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteOutlineRoundedIcon from "@material-ui/icons/DeleteOutlineRounded";
import EditOutlinedIcon from "@material-ui/icons/EditOutlined";
import ColorLensOutlinedIcon from "@material-ui/icons/ColorLensOutlined";
import ChevronRightOutlinedIcon from "@material-ui/icons/ChevronRightOutlined";
import StarBorderOutlinedIcon from "@material-ui/icons/StarBorderOutlined";

//COMPONENTS
import Board from "../components/Board";
import CreateBoard from "../components/CreateBoard";
import Warning from "../fnComponents/Warning.js";
import Dashboard__selectColor from "../components/Dashboard_selectColor";

function Dashboard() {
  const userInfo = useSelector((state) => state.userInfo);
  const loading = useSelector((state) => state.loading);
  const wsData = useSelector((state) => state.wsData);
  const [color, setColor] = useState("#333");
  const dispatch = useDispatch();
  const history = useHistory();
  const pathWsId = history.location.pathname.split("/")[2];
  const boardId = history.location.pathname.split("/")[4];
  const [boardData, setBoardData] = useState();
  const [newBoard, setNewBoard] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [askDelete, setAskDelete] = useState(false);
  const [deleteMainWs, setDeleteMainWs] = useState(false);
  const [changeName, setChangeName] = useState(false);
  const [newName, setNewName] = useState("");
  const [changeColorState, setChangeColorState] = useState(false);

  const inputNameRef = useRef();

  const handleDeleteButton = () => {
    db.collection("users")
      .doc(userInfo.uid)
      .get()
      .then((docData) => {
        if (docData.data().mainWs === pathWsId) {
          deleteMainWsNo();
          setDisplayMenu(false);
        } else {
          db.collection("workStation")
            .doc(pathWsId)
            .get()
            .then((doc) => {
              if (doc.data().alfa === userInfo.uid) {
                setDisplayMenu(false);
                setAskDelete(true);
              } else {
                alert(
                  "you are not the creator of this work space. You can only leave"
                );
              }
            });
        }
      });
  };

  const handleDeleteWs = () => {
    db.collection("workStation").doc(pathWsId).delete();
    history.push("/");
    setAskDelete(false);
    setDisplayMenu(false);
  };

  const deleteMainWsNo = () => {
    setDeleteMainWs(true);
    setTimeout(() => {
      setDeleteMainWs(false);
    }, 3000);
  };

  useEffect(() => {
    //get ws data
    if (pathWsId && userInfo) {
      db.collection("workStation")
        .doc(pathWsId)
        .onSnapshot((data) => {
          // user can open it? True user?
          if (data.exists) {
            if (data.data().users.includes(userInfo.uid)) {
              let dataWs = data.data();
              dispatch(wsDataAction(dataWs));
              setColor(data.data().color);
            } else {
              console.log("u hace no acces");
              history.push("/");
            }
          }
        });
      db.collection("workStation")
        .doc(pathWsId)
        .collection("dashboard")
        .onSnapshot((data) => {
          let list = [];
          data.forEach((data) => {
            list.push(data.data());
          });
          setBoardData(list);
        });
    }
  }, [pathWsId, userInfo]);

  const handleEditName = () => {
    setChangeName(!changeName);
    setDisplayMenu(false);
  };

  const handleSubmitName = (e) => {
    e.preventDefault();
    db.collection("workStation").doc(pathWsId).update({
      ws_name: newName,
    });

    inputNameRef.current.value = "";
    setChangeName(!changeName);
  };

  const handleMenuLayer = () => {
    setDisplayMenu(!displayMenu);
    setChangeColorState(false);
  };

  const setAsMainWs = () => {
    db.collection("users").doc(userInfo.uid).update({
      mainWs: wsData.wsId,
    });
    setDisplayMenu(false);
  };

  return (
    <>
      <div className="dashboard">
        {wsData && (
          <>
            <div className="dashboard__header">
              <Link to={`/ws/${pathWsId}`}>
                <div
                  className="dashboard__letter ws_icon__letter"
                  style={{ background: color }}
                >
                  <p> {wsData.ws_name.charAt(0)}</p>
                </div>
              </Link>
              <div className="dashboard__name">
                {!changeName && <h2>{wsData.ws_name}</h2>}
                {changeName && (
                  <h2>
                    <form onSubmit={(e) => handleSubmitName(e)}>
                      <input
                        placeholder={wsData.ws_name}
                        onChange={(e) => setNewName(e.target.value)}
                        ref={inputNameRef}
                      />
                    </form>
                  </h2>
                )}
              </div>
              <div className="fn__menu ">
                <Button onClick={() => handleMenuLayer()}>
                  <MoreVertIcon />
                </Button>
                <AnimatePresence>
                  {displayMenu && (
                    <>
                      <div
                        className="fn__menuWindow--layer"
                        onClick={() => handleMenuLayer()}
                      ></div>
                      <motion.div
                        className="fn__menuWindow "
                        exit={{ opacity: 0 }}
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ y: 0, opacity: 1 }}
                      >
                        <Button onClick={() => handleDeleteButton()}>
                          <DeleteOutlineRoundedIcon />
                          <p>Delete</p>
                        </Button>
                        <Button onClick={() => handleEditName()}>
                          <EditOutlinedIcon />
                          <p>Edit name</p>
                        </Button>
                        <Button onClick={() => setAsMainWs()}>
                          <StarBorderOutlinedIcon />
                          <p>Set as Main</p>
                        </Button>
                        <Button
                          onClick={() => setChangeColorState(!changeColorState)}
                        >
                          <ColorLensOutlinedIcon />
                          <p>Change Color</p>
                          <ChevronRightOutlinedIcon className="fn__menuWindows--arrow" />
                        </Button>
                        {changeColorState && (
                          <motion.div
                            className="fn__menuWindow--colorPop"
                            exit={{ opacity: 0 }}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ x: 0, opacity: 1 }}
                          >
                            <p>Select new Color</p>
                            <Dashboard__selectColor pathWsId={pathWsId} />
                          </motion.div>
                        )}
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
                {askDelete && (
                  <div className="boxPop">
                    <div className="boxPop__layer"></div>
                    <div className="boxPop__content">
                      <div className="boxPop__box">
                        <h2>Delete Workstation?</h2>
                        <p>All boards will be deleted</p> <br />
                        <div className="boxPop__buttons">
                          <Button onClick={() => setAskDelete(false)}>
                            Cancel
                          </Button>
                          <Button
                            color="secondary"
                            variant="contained"
                            onClick={() => handleDeleteWs()}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="dashboard__newBoard">
              <Button onClick={() => setNewBoard(true)}>
                <AddCircleOutlineIcon fontSize="small" /> Add new board
              </Button>
            </div>
            <div className="dashboard__dashboards">
              {boardData &&
                boardData.map((data) => {
                  return (
                    <motion.div
                      style={{
                        background: boardId === data.id ? color : "",
                      }}
                      className={boardId === data.id ? "dashboard__active" : ""}
                      whileHover={{ scale: 1.05 }}
                    >
                      <Board
                        key={data.id}
                        id={data.id}
                        name={data.name}
                        boardId={data.id}
                        color={wsData.color}
                      />
                    </motion.div>
                  );
                })}
            </div>
            {newBoard && <CreateBoard setNewBoard={setNewBoard} />}
            {deleteMainWs && (
              <Warning message={"You can't delete you main work station"} />
            )}
          </>
        )}
      </div>
      <AnimatePresence>
        {loading && (
          <motion.div className="app__loading" exit={{ opacity: 0 }}>
            <div className="app__loadingSpin">
              <CircularProgress />
            </div>
            {/* <motion.div
              className="app__loadingBox"
              animate={{ rotate: 180 }}
              transition={{ repeat: Infinity, repeatType: "reverse" }}
            ></motion.div> */}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Dashboard;
