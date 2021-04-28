import React from "react";
import "../styles/ws_icon.scss";
import { useDispatch } from "react-redux";
import { currentWsId } from "../actions";

function WS_icon({ name, id }) {
  const dispatch = useDispatch();
  const setCurrendWsId = () => {
    dispatch(currentWsId(id));
  };
  return (
    <div className="ws_icon" onClick={() => setCurrendWsId()}>
      <div className="ws_icon__letter">
        <p>{name.charAt(0)}</p>
      </div>
    </div>
  );
}

export default WS_icon;
