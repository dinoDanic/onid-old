import React from "react";
import "../styles/board.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import AssignmentIcon from "@material-ui/icons/Assignment";

function Board({ name, boardId, color, fontColor }) {
  const history = useHistory();
  const pathWsId = history.location.pathname.split("/")[2];
  return (
    <Link to={`/ws/${pathWsId}/dashboard/${boardId}/li`}>
      <div className="board">
        <button
          className="retroBtn retroBtn-width100 retroBtn-icon"
          style={{ background: color }}
        >
          <AssignmentIcon fontSize="small" />
          {name}
        </button>
      </div>
    </Link>
  );
}

export default Board;
