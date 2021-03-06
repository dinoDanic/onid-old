import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { loading } from "../actions";
import { useHistory } from "react-router-dom";
import { db } from "../lib/firebase";
import "../styles/workSpace.scss";
import WS_icon from "./WS_icon";
import CreateWs from "../components/CreateWs";
import AddIcon from "@material-ui/icons/Add";

function WorkSpace() {
  const userInfo = useSelector((state) => state.userInfo);
  const history = useHistory();
  const dispatch = useDispatch();
  const [wsData, setWsData] = useState([]);
  const [createWs, setCreateWs] = useState(false);
  const [mainWsLink, setMainWsLink] = useState("");

  useEffect(() => {
    const checkForWS = () => {
      // Check work space
      if (userInfo) {
        db.collection("workStation")
          .where("users", "array-contains", userInfo.uid)
          .onSnapshot((doc) => {
            if (doc.empty) {
              setCreateWs(true);
            }
            let list = [];
            doc.forEach((data) => {
              list.push(data.data());
            });
            setWsData(list);
            dispatch(loading(false));
          });

        // Find main ws
        db.collection("users")
          .doc(userInfo.uid)
          .onSnapshot((docData) => {
            if (docData.exists) {
              setMainWsLink(docData.data().mainWs);
              if (mainWsLink) {
                if (history.location.pathname === "/") {
                  history.push(`/ws/${mainWsLink}`);
                }
              }
            }
          });
      }
    };

    checkForWS();
  }, [userInfo, mainWsLink]);

  return (
    <div className="workSpace">
      {wsData &&
        wsData.map((data) => {
          return (
            <WS_icon
              key={Math.random() * 1000}
              name={data.ws_name}
              id={data.wsId}
              mainWsLink={mainWsLink}
              color={data.color}
            />
          );
        })}
      {/*  <div className="workSpace__line"></div> */}
      <button
        onClick={() => setCreateWs(true)}
        className="retroBtn retroBtn-letter retroBtn-info"
      >
        <h3>+</h3>
      </button>
      {createWs && <CreateWs setCreateWs={setCreateWs} />}
    </div>
  );
}

export default WorkSpace;
