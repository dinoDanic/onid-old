import React, { useEffect, useState, useRef } from "react";
import { db } from "../lib/firebase";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, CircularProgress } from "@material-ui/core";
import BrutalBtn from "../components/brutal/BrutalBtn";
import "../styles/dashboard.scss";
import { currentWsId, wsDataAction, membersWs } from "../actions";

//MATERIAL UI AND FRAMER
import { AnimatePresence, motion } from "framer-motion";
import MoreVertIcon from "@material-ui/icons/MoreVert";

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

  useEffect(() => {
    const getMembersId = () => {
      if (pathWsId) {
        db.collection("workStation")
          .doc(pathWsId)
          .get()
          .then((doc) => {
            if (doc.exists) {
              getMembersData(doc.data().users);
            } else {
              alert("cnat get memebrs data");
            }
          });
      }
    };
    const getMembersData = (users) => {
      let list = [];
      users.map((data) => {
        db.collection("users")
          .doc(data)
          .get()
          .then((docData) => {
            list.push(docData.data());
          });
      });
      console.log("dispatching membersWs");
      dispatch(membersWs(list));
    };
    getMembersId();
  }, [pathWsId]);

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
                <BrutalBtn
                  tekst={wsData.ws_name.charAt(0)}
                  color={color}
                  width="30px"
                  height="30px"
                />
              </Link>
              <div className="dashboard__name">
                {!changeName && <h3>{wsData.ws_name}</h3>}
                {changeName && (
                  <h3>
                    <form onSubmit={(e) => handleSubmitName(e)}>
                      <input
                        placeholder={wsData.ws_name}
                        onChange={(e) => setNewName(e.target.value)}
                        ref={inputNameRef}
                      />
                    </form>
                  </h3>
                )}
              </div>
              <div className="fn__menu ">
                <MoreVertIcon onClick={() => handleMenuLayer()} />
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
                        <div
                          onClick={() => handleEditName()}
                          className="fn__menuWindows-brutalBtn"
                        >
                          <BrutalBtn tekst="Edit Name" height="20px" />
                        </div>
                        <div
                          onClick={() => setAsMainWs()}
                          className="fn__menuWindows-brutalBtn"
                        >
                          <BrutalBtn tekst="Set as Main" height="20px" />
                        </div>
                        <div
                          onClick={() => setChangeColorState(!changeColorState)}
                          className="fn__menuWindows-brutalBtn"
                        >
                          <BrutalBtn tekst="Change color" height="20px" />
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
                        </div>
                        <div
                          onClick={() => handleDeleteButton()}
                          className="fn__menuWindows-brutalBtn"
                        >
                          <BrutalBtn
                            tekst="Delete"
                            height="20px"
                            color="tomato"
                          />
                        </div>
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
            <div
              className="dashboard__newBoard"
              onClick={() => setNewBoard(true)}
            >
              {/* <Button onClick={() => setNewBoard(true)}>
                <AddCircleOutlineIcon fontSize="small" /> Add new board
              </Button> */}
              <BrutalBtn tekst="Add new board" />
            </div>

            <div className="dashboard__dashboards">
              {boardData &&
                boardData.map((data) => {
                  return (
                    <Board
                      key={data.id}
                      id={data.id}
                      name={data.name}
                      boardId={data.id}
                      color={boardId === data.id ? color : "rgb(131 161 171)"}
                      fontColor={boardId === data.id ? "" : "white"}
                    />
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
            {/* <div className="app__loadingSpin">
              <CircularProgress />
            </div> */}
            <motion.div
              className="app__loadingBox "
              animate={{ rotate: 380 }}
              transition={{
                repeat: Infinity,
                repeatType: "reverse",
                duration: 0.5,
              }}
            ></motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export default Dashboard;
