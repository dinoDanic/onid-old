import React, { useState, useEffect, useRef } from "react";
import { db, timestamp } from "../lib/firebase";
import { useSelector } from "react-redux";

// Components
import BrutalBtn from "./brutal/BrutalBtn";
import Reply from "./Reply";

// Style
import { Avatar } from "@material-ui/core";
import { motion } from "framer-motion";

function FullTaskMsg({ input, currentWsId, boardId, docId, updatedBy }) {
  console.log("fulltaskmsg");
  const userInfo = useSelector((state) => state.userInfo);
  const [replayTaskState, setReplayTaskState] = useState(false);
  const [replayInput, setReplayInput] = useState("");
  const [sendingState, setSendingState] = useState(false);
  const [replyData, setReplyData] = useState([]);
  const [maxH, setmaxH] = useState("250px");
  const inputRef = useRef();

  const handleReplay = async (e) => {
    e.preventDefault();
    setSendingState(true);
    await db
      .collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .collection("update")
      .doc(docId)
      .collection("reply")
      .add({
        replayById: userInfo.uid,
        input: replayInput,
        timestamp: timestamp,
      });
    setSendingState(false);
    setmaxH("100%");
    inputRef.current.value = "";
  };

  useEffect(() => {
    const getReplys = () => {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .doc(boardId)
        .collection("update")
        .doc(docId)
        .collection("reply")
        .orderBy("timestamp", "asc")
        .onSnapshot((data) => {
          let list = [];
          data.forEach((doc) => {
            list.push(doc.data());
          });
          setReplyData(list);
        });
    };
    getReplys();
  }, []);

  const handleReplyBtn = () => {
    setReplayTaskState(!replayTaskState);
    setmaxH("100%");
  };
  return (
    <div className="fullTask__msg retroBox">
      <div className="fullTask__msgFrom">
        <Avatar src={updatedBy?.userPhoto} />
        <h4>{updatedBy?.userName}</h4>
      </div>
      <div className="fullTask__msgMsg">
        <p>{input}</p>
      </div>
      <div className="fullTask__like">
        <button className="retroBtn retroBtn-small2">Like</button>
        <button
          onClick={() => handleReplyBtn()}
          className="retroBtn retroBtn-small2"
        >
          Reply
        </button>
      </div>
      {replyData.length > 0 && (
        <div className="fullTask__showReplays">
          {replyData?.map((data) => {
            return <Reply input={data.input} userId={data.replayById} />;
          })}
        </div>
      )}
      {replayTaskState && (
        <div className="fullTask__replay">
          <form onSubmit={(e) => handleReplay(e)}>
            {sendingState && (
              <motion.div
                className="fullTask__sentAni"
                animate={{ rotate: 360, transition: { repeat: Infinity } }}
              ></motion.div>
            )}
            <input
              type="text"
              className="retroInput retroInput-w100 "
              placeholder="Reply.."
              onChange={(e) => setReplayInput(e.target.value)}
              ref={inputRef}
            />
          </form>
        </div>
      )}
      {/*   {maxH === "250px" && (
        <>
          {replyData?.length > 0 && (
            <div className="fullTask__showCom" onClick={() => setmaxH("100%")}>
              <p>show comments</p>
            </div>
          )}
        </>
      )}
      {maxH === "100%" && (
        <>
          {replyData?.length > 0 && (
            <div className="fullTask__hideCom" onClick={() => setmaxH("250px")}>
              <p>hide comments</p>
            </div>
          )}
        </>
      )} */}
    </div>
  );
}

export default FullTaskMsg;
