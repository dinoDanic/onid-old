import React from "react";
import { useDispatch } from "react-redux";
import ListIcon from "@material-ui/icons/List";
import { Button } from "@material-ui/core";
import "../styles/board.scss";
import { Link } from "react-router-dom";
import { dashboardData } from "../actions";

function Board({ name, boardId, data }) {
  const dispatch = useDispatch();

  return (
    <Link to={`/dashboard/${boardId}`}>
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
