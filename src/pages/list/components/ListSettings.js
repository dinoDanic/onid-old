import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { db, fieldValue } from "../../../lib/firebase";
import { useHistory } from "react-router-dom";

// COMPONENTS
import StatusTypes from "./StatusTypes";

//STYLE and MATERIAL UI
import "../../../styles/listSettings.scss";
import "../../../styles/theme.scss";
import DeleteIcon from "@material-ui/icons/Delete";

function ListSettings({ setListSettingsStatus, currentWsId, boardId }) {
  const db_Data = useSelector((state) => state.dbData);
  const history = useHistory();
  const [addNewState, setAddNewState] = useState(false);
  const [nameNewStatus, setNameNewStatus] = useState("");
  const [askDelete, setAskDelete] = useState(true);
  const inputRef = useRef();

  const handleNewStatus = (e) => {
    e.preventDefault();
    console.log("sending");
    let colors = db_Data.colors;
    colors = { ...colors, nameNewStatus2: "#f65bc4" };
    colors[nameNewStatus] = colors["nameNewStatus2"];
    delete colors["nameNewStatus2"];

    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .update({
        statusType: fieldValue.arrayUnion(nameNewStatus),
        colors,
      });

    setAddNewState(false);
  };

  const deleteDashboard = () => {
    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .delete();
    history.push(`/ws/${currentWsId}`);
  };

  return (
    <div className="retroPop listSettings">
      <div className="layer" onClick={() => setListSettingsStatus(false)}></div>
      <div className="retroPop__box listSettings__box">
        <div className="listSettings__delete">
          {askDelete && (
            <button className="retroBtn retroBtn-letter retroBtn-danger">
              <DeleteIcon
                fontSize="small"
                onClick={() => setAskDelete(!askDelete)}
              />
            </button>
          )}
          <div className="listSettings__sureDelete">
            {!askDelete && (
              <>
                <button
                  className="retroBtn retroBtn-danger retroBtn-letter"
                  onClick={() => deleteDashboard()}
                >
                  yes
                </button>
                <button
                  style={{ background: "gray" }}
                  className="retroBtn retroBtn-letter"
                  onClick={() => setAskDelete(!askDelete)}
                >
                  no
                </button>
              </>
            )}
          </div>
        </div>
        <div className="listSettings__menu-title">
          <h2>List Settings</h2>
        </div>

        <div className="listSettings__editStatusTitle">
          <h4>Edit Status</h4>
        </div>
        <div className="listSettings__statusWrap">
          {db_Data.statusType?.map((data) => {
            return (
              <StatusTypes
                data={data}
                db_Data={db_Data}
                currentWsId={currentWsId}
                boardId={boardId}
              />
            );
          })}
          <div className="listSettings__addNewTask">
            {addNewState && (
              <div className="listSettings__settingNew">
                <form>
                  <input
                    type="text"
                    className="retroInput retroInput-w100"
                    ref={inputRef}
                    onChange={(e) => setNameNewStatus(e.target.value)}
                  />

                  <button
                    onClick={(e) => handleNewStatus(e)}
                    className="retroBtn retroBtn-letter"
                  >
                    x
                  </button>
                </form>
              </div>
            )}
            {!addNewState && (
              <div
                className="listSettings__brtlBtn"
                onClick={() => setAddNewState(true)}
              >
                <button className="retroBtn">Add new</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListSettings;
