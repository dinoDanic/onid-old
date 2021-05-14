import React, { useEffect, useState } from "react";
import { db, fieldValue } from "../lib/firebase";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import bg2 from "../img/bg2.jpeg";
import "../styles/openWs.scss";
import { Avatar, Button, Input, Paper, Tab, Tabs } from "@material-ui/core";
import AssignmentIcon from "@material-ui/icons/Assignment";
import AddCircleOutlineIcon from "@material-ui/icons/AddCircleOutline";

function OpenWs() {
  const wsData = useSelector((state) => state.wsData);
  const history = useHistory();
  const pathWsId = history.location.pathname.split("/")[2];
  const [value, setValue] = useState(0);
  const [members, setMembers] = useState();
  const [membersId, setMembersId] = useState([]);
  const [board, setBoard] = useState();
  const [addMemberStatus, setAddMemberStatus] = useState(false);
  const [addMemberError, setAddMemberError] = useState("");
  const [email, setEmail] = useState();

  const handleTabs = (e, val) => {
    setValue(val);
  };

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
      setMembers(list);
    };
    getMembersId();
  }, [pathWsId]);

  useEffect(() => {
    setValue(0);
    const getAllBoards = () => {
      if (pathWsId) {
        db.collection("workStation")
          .doc(pathWsId)
          .collection("dashboard")
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

  return (
    <div className="openWs">
      <div className="openWs__img">
        <img src={bg2} alt="" />
      </div>
      <div className="openWs__menu">
        <Paper elevation={0}>
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
            {members && (
              <>
                {members.map((data) => {
                  return (
                    <>
                      <div className="openWs__user">
                        <div className="openWs__avatar">
                          <Avatar src={data.userPhoto} />
                        </div>
                        <div className="openWs__userName">
                          <p>{data.userName}</p>
                        </div>
                        {data.userId === wsData.alfa && (
                          <div className="openWs__alfa">
                            <p>Alfa</p>
                          </div>
                        )}
                      </div>
                    </>
                  );
                })}
              </>
            )}
          </div>
          <div className="openWs__addNewUser">
            <Button onClick={() => setAddMemberStatus(!addMemberStatus)}>
              <AddCircleOutlineIcon fontSize="default" />
              <p>Add Member</p>
            </Button>
            {addMemberStatus && (
              <>
                <div className="openWs__userPopHold">
                  <div
                    className="openWs__userPopLayer"
                    onClick={() => setAddMemberStatus(!addMemberStatus)}
                  ></div>
                  <div className="openWs__addUserPop">
                    <h2>Add Member</h2>
                    <form onSubmit={(e) => addNewUser(e)}>
                      <Input
                        type="email"
                        placeholder="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Button type="submit">Send</Button>
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
          {board &&
            board.map((data) => {
              return (
                <div className="openWs__boards">
                  <Link to={`/ws/${pathWsId}/dashboard/${data.id}/li`}>
                    <Button>
                      <div className="icon">
                        <AssignmentIcon fontSize="large" />
                      </div>
                      <div className="name">
                        <h3>{data.name}</h3>
                      </div>
                    </Button>
                  </Link>
                </div>
              );
            })}
        </TabPanel>
        <TabPanel value={value} index={2}>
          <h3>Notifications</h3>
        </TabPanel>
      </div>
    </div>
  );
}

function TabPanel(props) {
  const { children, value, index } = props;
  return (
    <>
      {value === index && (
        <div className="openWs__content">
          <p>{children}</p>
        </div>
      )}
    </>
  );
}

export default OpenWs;
