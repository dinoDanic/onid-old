import React, { useState, useRef } from "react";
import { useSelector } from "react-redux";
import { db, fieldValue } from "../../../lib/firebase";

// COMPONENTS
import ColorPicker from "../../../components/ColorPicker";
import StatusTypes from "./StatusTypes";

//STYLE and MATERIAL UI
import { Button, Input, Paper } from "@material-ui/core";
import AddOutlinedIcon from "@material-ui/icons/AddOutlined";
import "../../../styles/listSettings.scss";
import "../../../styles/theme.scss";
import BrutalBtn from "../../../components/brutal/BrutalBtn";

function ListSettings({ setListSettingsStatus, currentWsId, boardId }) {
  const db_Data = useSelector((state) => state.dbData);
  const [addNewState, setAddNewState] = useState(false);
  const [nameNewStatus, setNameNewStatus] = useState("");
  const inputRef = useRef();
  const handleNewStatus = (e) => {
    e.preventDefault();

    let colors = db_Data.colors;
    colors = { ...colors, nameNewStatus2: "blue" };
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

  return (
    <div className="listSettings">
      <div className="layer" onClick={() => setListSettingsStatus(false)}></div>
      <div className="brutalPop__box">
        <div className="listSettings__menu-title">
          <h2>List Settings</h2>
        </div>
        <div className="listSettings__editStatus">
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
                  <form onSubmit={(e) => handleNewStatus(e)}>
                    <input
                      type="text"
                      className="brutalInput brutalInput-small"
                      ref={inputRef}
                      onChange={(e) => setNameNewStatus(e.target.value)}
                    />
                    <div
                      className="listSettings__brutalBrn2"
                      onClick={() => setAddNewState(false)}
                    >
                      <BrutalBtn
                        tekst="X"
                        width="28px"
                        height="27px"
                        customClass="listSettings__newTask-brutalClose"
                      />
                    </div>
                  </form>
                </div>
              )}
              {!addNewState && (
                <div
                  className="listSettings__brtlBtn"
                  onClick={() => setAddNewState(true)}
                >
                  <BrutalBtn tekst="Add new" width="80px" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListSettings;
