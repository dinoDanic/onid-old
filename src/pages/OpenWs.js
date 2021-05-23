import React, { useEffect, useState } from "react";
import { db, fieldValue } from "../lib/firebase";
import { useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import bg2 from "../img/bg2.jpeg";
import "../styles/openWs.scss";
import { Avatar, Paper, Tab, Tabs } from "@material-ui/core";
import BrutalBtn from "../components/brutal/BrutalBtn";

function OpenWs() {
  const wsData = useSelector((state) => state.wsData);
  const members_ws = useSelector((state) => state.membersWs);
  const history = useHistory();
  const pathWsId = history.location.pathname.split("/")[2];
  const [value, setValue] = useState(0);
  const [members, setMembers] = useState();
  const [board, setBoard] = useState();
  const [addMemberStatus, setAddMemberStatus] = useState(false);
  const [addMemberError, setAddMemberError] = useState("");
  const [email, setEmail] = useState();

  const handleTabs = (e, val) => {
    setValue(val);
  };

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
      {wsData && (
        <div className="openWs__header">
          <div className="openWs__icon">
            <BrutalBtn
              tekst={wsData?.ws_name.charAt(0)}
              width="80px"
              height="80px"
              fontSize="40px"
              color={wsData.color}
            />
          </div>
          <div className="openWs__name">
            <h1>{wsData?.ws_name}</h1>
            <p>{wsData?.ws_description}</p>
          </div>
        </div>
      )}
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
            {members_ws && (
              <>
                {members_ws.map((data) => {
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
                          <div
                            className="openWs__alfa"
                            style={{ background: wsData.color }}
                          >
                            <p>Creator</p>
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
          {board &&
            board.map((data) => {
              return (
                <div className="openWs__boards">
                  <Link to={`/ws/${pathWsId}/dashboard/${data.id}/li`}>
                    {<BrutalBtn tekst={data.name} height="50px" />}
                  </Link>
                </div>
              );
            })}
          {board && <>{!board.length && <p>You have no Boards! </p>}</>}
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
