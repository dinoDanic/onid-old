import React from "react";
import ListIcon from "@material-ui/icons/List";
import "../styles/board.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import BrutalBtn from "./brutal/BrutalBtn";

function Board({ name, boardId, color, fontColor }) {
  const history = useHistory();
  const pathWsId = history.location.pathname.split("/")[2];
  return (
    <Link to={`/ws/${pathWsId}/dashboard/${boardId}/li`}>
      <div className="board">
        <BrutalBtn
          color={color}
          size="normal"
          tekst={name}
          fontColor={fontColor}
          height="30px"
        />
      </div>
    </Link>
  );
}

export default Board;
