import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import { Link, useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button, CircularProgress } from "@material-ui/core";
import "../styles/dashboard.scss";
import { wsDataAction } from "../actions";

//MATERIAL UI AND FRAMER
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import EditIcon from "@material-ui/icons/Edit";
import { AnimatePresence, motion } from "framer-motion";

//COMPONENTS
import Board from "../components/Board";
import CreateBoard from "../components/CreateBoard";
import Warning from "../fnComponents/Warning.js";

function Dashboard() {
  const userInfo = useSelector((state) => state.userInfo);
  const loading = useSelector((state) => state.loading);
  const wsData = useSelector((state) => state.wsData);

  const dispatch = useDispatch();
  const history = useHistory();
  const pathWsId = history.location.pathname.split("/")[2];
  const [boardData, setBoardData] = useState();
  const [newBoard, setNewBoard] = useState(false);
  const [displayMenu, setDisplayMenu] = useState(false);
  const [askDelete, setAskDelete] = useState(false);
  const [deleteMainWs, setDeleteMainWs] = useState(false);

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

  return (
    <>
      <div className="dashboard">
        {wsData && (
          <>
            <div className="dashboard__header">
              <Link to={`/ws/${pathWsId}`}>
                <div className="dashboard__letter ws_icon__letter">
                  <p> {wsData.ws_name.charAt(0)}</p>
                </div>
              </Link>
              <div className="dashboard__name">
                <h2>{wsData.ws_name}</h2>
              </div>
              <div className="fn__menu">
                <Button onClick={() => setDisplayMenu(!displayMenu)}>
                  <MoreVertIcon />
                </Button>
                {displayMenu && (
                  <>
                    <div
                      className="fn__menuWindow--layer"
                      onClick={() => setDisplayMenu(!displayMenu)}
                    ></div>
                    <div className="fn__menuWindow">
                      <Button onClick={() => handleDeleteButton()}>
                        <DeleteIcon />
                        <p>Delete</p>
                      </Button>
                      <Button>
                        <EditIcon />
                        <p>Edit name</p>
                      </Button>
                    </div>
                  </>
                )}
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
                    <Board
                      key={data.id}
                      name={data.name}
                      boardId={data.id}
                      data={data}
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
