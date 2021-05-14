import React from "react";
import ListIcon from "@material-ui/icons/List";
import { Button } from "@material-ui/core";
import "../styles/board.scss";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";

function Board({ name, boardId, data }) {
  const history = useHistory();
  const pathWsId = history.location.pathname.split("/")[2];

  return (
    <Link to={`/ws/${pathWsId}/dashboard/${boardId}/li`}>
      <div className="board">
        <Button>
          <ListIcon />
          <p>{name}</p>
        </Button>
      </div>
    </Link>
  );
}

export default Board;
