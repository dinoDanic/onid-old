import React, { useEffect, useState } from "react";
import { db, fieldValue } from "../lib/firebase";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import bg2 from "../img/bg2.jpeg";
import "../styles/openWs.scss";
import { Avatar, Paper, Tab, Tabs } from "@material-ui/core";
import BrutalBtn from "../components/brutal/BrutalBtn";
import { AnimatePresence, motion } from "framer-motion";
import AssignmentIcon from "@material-ui/icons/Assignment";
import { BurstModeTwoTone } from "@material-ui/icons";
import { currentWsId } from "../actions";

function OpenWs() {
  const wsData = useSelector((state) => state.wsData);
  const members_ws = useSelector((state) => state.membersWs);
  const history = useHistory();
  const pathWsId = history.location.pathname.split("/")[2];
  const [value, setValue] = useState(0);
  const [board, setBoard] = useState();
  const [members, setMembers] = useState();
  const [addMemberStatus, setAddMemberStatus] = useState(false);
  const [addMemberError, setAddMemberError] = useState("");
  const [email, setEmail] = useState();
  const [usersID, setUsersID] = useState([]);
  const [boardState, setBoardState] = useState(true);

  useEffect(() => {
    setValue(0);
    const getAllBoards = () => {
      if (pathWsId) {
        db.collection("workStation")
          .doc(pathWsId)
          .collection("dashboard")
          .limit(4)
          .orderBy("timestamp", "desc")
          .get()
          .then((data) => {
            let list = [];
            data.forEach((doc) => {
              list.push(doc.data());
            });
            setBoard(list);
          });
      }
    };
    getAllBoards();
  }, [pathWsId]);

  const addNewUser = (e) => {
    e.preventDefault();
    db.collection("users")
      .where("email", "==", email)
      .get()
      .then((query) => {
        if (query.empty) {
          setAddMemberError(
            "No user registered with that email address. User has to be registered."
          );
        } else {
          console.log("ima usera");
          query.forEach((doc) => {
            db.collection("workStation")
              .doc(pathWsId)
              .update({
                users: fieldValue.arrayUnion(doc.data().userId),
              })
              .then(() => {
                setAddMemberStatus(false);
                alert("Member Added");
              });
          });
        }
      });
  };

  useEffect(() => {
    const getMembersId = async () => {
      console.log("getting members IDs");
      await db
        .collection("workStation")
        .doc(pathWsId)
        .onSnapshot((data) => {
          setUsersID(data.data().users);
        });
    };
    getMembersId();
  }, [pathWsId]);

  useEffect(() => {
    const getUserInfo = async () => {
      let list = [];
      await usersID.map((id) => {
        db.collection("users")
          .doc(id)
          .onSnapshot((data) => {
            console.log(data.data());
            list.push(data.data());
          });
      });
      setMembers(list);
    };
    getUserInfo();
  }, [usersID, setUsersID, pathWsId]);
  return (
    <div className="openWs">
      <div className="openWs__img">
        <img src={bg2} alt="" />
      </div>
      {wsData && (
        <div className="openWs__header">
          <div className="openWs__icon">
            <button
              style={{ background: wsData.color }}
              className="retroBtn retroBtn-letter"
            >
              {wsData?.ws_name.charAt(0)}
            </button>
          </div>
          <div className="openWs__name">
            <h1>{wsData?.ws_name}</h1>
            <p>{wsData?.ws_description}</p>
          </div>
        </div>
      )}
      <div className="openWs__menu2">
        <button className="retroBtn">boards</button>
        <button className="retroBtn">members</button>
        <button className="retroBtn">notifications</button>
      </div>
      <div className="openWs__content">
        {boardState && (
          <>
            <div className="openWs__board retroBox">
              <h3>Recent Boards</h3>
              <div className="openWs__baordHolder">
                {board &&
                  board.map((data) => {
                    return (
                      <div className="openWs__boards" key={data.id}>
                        <Link to={`/ws/${pathWsId}/dashboard/${data.id}/li`}>
                          <button className="retroBtn retroBtn-width100 retroBtn-icon">
                            <AssignmentIcon fontSize="small" />
                            {data.name}
                          </button>
                        </Link>
                      </div>
                    );
                  })}
              </div>
              {board && <>{!board.length && <p>You have no Boards! </p>}</>}
            </div>
            <div className="openWs__board retroBox">
              <h3>Members</h3>
              {members && (
                <>
                  {members.map((data) => {
                    return (
                      <div className="openWs__user" key={data.userId}>
                        <div className="openWs__avatar">
                          <Avatar src={data.userPhoto} />
                        </div>
                        <div className="openWs__userName">
                          <p>{data.userName}</p>
                        </div>
                        {data.userId === wsData.alfa && (
                          <div
                            className="openWs__alfa"
                            style={{ background: wsData.color }}
                          >
                            <p>Creator</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                  <AnimatePresence>
                    {addMemberStatus && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                      >
                        <form onSubmit={(e) => addNewUser(e)}>
                          <input
                            type="email"
                            placeholder="email"
                            className="retroInput retroInput-w100"
                            onChange={(e) => setEmail(e.target.value)}
                          />
                        </form>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  <div className="openWs__addNewUser">
                    <div className="openWs__addMemberBrt">
                      <button
                        className="retroBtn retroBtn-small2 retroBtn-info"
                        onClick={() => setAddMemberStatus(!addMemberStatus)}
                      >
                        add member
                      </button>
                      {addMemberError && (
                        <div className="openWs__addMemberError retroBox">
                          <p>{addMemberError}</p>
                        </div>
                      )}
                    </div>

                    {/* {addMemberStatus && (
                      <>
                        <div className="brutalPop">
                          <div
                            className="brutalPop__layer"
                            onClick={() => setAddMemberStatus(!addMemberStatus)}
                          ></div>
                          <div className="brutalPop__box">
                            <h2>Add Member</h2>
                            <form onSubmit={(e) => addNewUser(e)}>
                              <input
                                type="email"
                                className="brutalInput"
                                placeholder="email"
                                onChange={(e) => setEmail(e.target.value)}
                              />
                              <div
                                className="openWs__btn"
                                onClick={(e) => addNewUser(e)}
                              >
                                <BrutalBtn tekst="Send" width="80px" />
                              </div>
                              {addMemberError && (
                                <div className="openWs__addMemberError">
                                  <p>{addMemberError}</p>
                                </div>
                              )}
                            </form>
                          </div>
                        </div>
                      </>
                    )} */}
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
      {/* <div className="openWs__menu"> <Paper elevation={0}>
          <Tabs
            value={value}
            onChange={handleTabs}
            indicatorColor="primary"
            textColor="primary"
          >
            <Tab label="Boards"></Tab>
            <Tab label="Members"></Tab>
            <Tab label="Notifications"></Tab>
          </Tabs>
        </Paper>
        <TabPanel value={value} index={1}>
          <div className="openWs__users">
            <h3>Members</h3>
            {members_ws && (
              <>
                {members_ws.map((data) => {
                  return (
                    <div className="openWs__user" key={data.userName}>
                      <div className="openWs__avatar">
                        <Avatar src={data.userPhoto} />
                      </div>
                      <div className="openWs__userName">
                        <p>{data.userName}</p>
                      </div>
                      {data.userId === wsData.alfa && (
                        <div
                          className="openWs__alfa"
                          style={{ background: wsData.color }}
                        >
                          <p>Creator</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            )}
          </div>
          <div className="openWs__addNewUser">
            <div
              className="openWs__addMemberBrt"
              onClick={() => setAddMemberStatus(!addMemberStatus)}
            >
              <BrutalBtn tekst="Add Member" width="110px" />
            </div>

            {addMemberStatus && (
              <>
                <div className="brutalPop">
                  <div
                    className="brutalPop__layer"
                    onClick={() => setAddMemberStatus(!addMemberStatus)}
                  ></div>
                  <div className="brutalPop__box">
                    <h2>Add Member</h2>
                    <form onSubmit={(e) => addNewUser(e)}>
                      <input
                        type="email"
                        className="brutalInput"
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <div
                        className="openWs__btn"
                        onClick={(e) => addNewUser(e)}
                      >
                        <BrutalBtn tekst="Send" width="80px" />
                      </div>
                      {addMemberError && (
                        <div className="openWs__addMemberError">
                          <p>{addMemberError}</p>
                        </div>
                      )}
                    </form>
                  </div>
                </div>
              </>
            )} 
          </div>
        </TabPanel>
        <TabPanel value={value} index={0}>
          <h3>Recent Boards</h3>
          <div className="openWs__baordHolder">
            {board &&
              board.map((data) => {
                return (
                  <div className="openWs__boards" key={data.id}>
                    <Link to={`/ws/${pathWsId}/dashboard/${data.id}/li`}>
                      {<BrutalBtn tekst={data.name} height="50px" />}
                    </Link>
                  </div>
                );
              })}
          </div>
          {board && <>{!board.length && <p>You have no Boards! </p>}</>}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <h3>Notifications</h3>
        </TabPanel>
        </div>
        */}
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <>{value === index && <div className="openWs__content">{children}</div>}</>
  );
}

export default OpenWs;
