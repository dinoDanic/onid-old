import React from "react";
import { db } from "../lib/firebase";

function Dashboard_selectColor({ pathWsId }) {
  const setColor = (value) => {
    console.log(value);
    db.collection("workStation").doc(pathWsId).update({
      color: value,
    });
  };
  return (
    <div className="colorPicker3">
      <input
        value="#f4275d"
        className="colorPicker__color1"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#40ca71"
        className="colorPicker__color2"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#a358d0"
        className="colorPicker__color3"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#2876c3"
        className="colorPicker__color4"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#1c1f3b"
        className="colorPicker__color5"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#fbcb00"
        className="colorPicker__color6"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#379afe"
        className="colorPicker__color7"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#f55f7b"
        className="colorPicker__color8"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#f5148a"
        className="colorPicker__color9"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#e1445c"
        className="colorPicker__color10"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#bb3353"
        className="colorPicker__color11"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#267e4c"
        className="colorPicker__color12"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#f65bc4"
        className="colorPicker__color13"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#2876c3"
        className="colorPicker__color14"
        onClick={(e) => setColor(e.target.value)}
      />
      <input
        value="#f5642e"
        className="colorPicker__color16"
        onClick={(e) => setColor(e.target.value)}
      />
    </div>
  );
}

export default Dashboard_selectColor;
