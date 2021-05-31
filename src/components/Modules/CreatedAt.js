import React from "react";
// funcitons
import { convertDate } from "../../functions";

function CreatedAt({ timestamp }) {
  return (
    <div
      className="listItem__createdAt listItem__comp retroLabel"
      name="Created Date"
    >
      <p>{convertDate(timestamp)}</p>
    </div>
  );
}

export default CreatedAt;
