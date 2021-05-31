import React from "react";
import { db } from "../lib/firebase";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import "../styles/colorPicker.scss";

function ColorPicker({ name }) {
  const history = useHistory();
  const db_Data = useSelector((state) => state.dbData);
  const currentWsId = history.location.pathname.split("/")[2];
  const boardId = history.location.pathname.split("/")[4];

  const setColor = (e) => {
    console.log("setting color");
    let newColor = e.target.value;
    let colors = db_Data.colors;
    colors[name] = newColor;

    db.collection("workStation")
      .doc(currentWsId)
      .collection("dashboard")
      .doc(boardId)
      .update({
        colors,
      });
  };
  return (
    <div className="colorPicker retroBox">
      <p>Pick color</p>
      <input
        value="#D059D0"
        className="colorPicker__color1"
        onClick={(e) => setColor(e)}
      />
      <input
        value="#40ca71"
        className="colorPicker__color2"
        onClick={(e) => setColor(e)}
      />
      <input
        value="#a358d0"
        className="colorPicker__color3"
        onClick={(e) => setColor(e)}
      />
      <input
        value="#2876c3"
        className="colorPicker__color4"
        onClick={(e) => setColor(e)}
      />
      <input
        value="#1c1f3b"
        className="colorPicker__color5"
        onClick={(e) => setColor(e)}
      />
      <input
        value="#fbcb00"
        className="colorPicker__color6"
        onClick={(e) => setColor(e)}
      />
      <input
        value="#379afe"
        className="colorPicker__color7"
        onClick={(e) => setColor(e)}
      />
      <input
        value="#f55f7b"
        className="colorPicker__color8"
        onClick={(e) => setColor(e)}
      />
      <input
        value="#f5148a"
        className="colorPicker__color9"
        onClick={(e) => setColor(e)}
      />
      <input
        value="#e1445c"
        className="colorPicker__color10"
        onClick={(e) => setColor(e)}
      />
      <input
        value="#bb3353"
        className="colorPicker__color11"
        onClick={(e) => setColor(e)}
      />
      <input
        value="#267e4c"
        className="colorPicker__color12"
        onClick={(e) => setColor(e)}
      />
      <input
        value="#f65bc4"
        className="colorPicker__color13"
        onClick={(e) => setColor(e)}
      />
      <input
        value="#2876c3"
        className="colorPicker__color14"
        onClick={(e) => setColor(e)}
      />
    </div>
  );
}

export default ColorPicker;
