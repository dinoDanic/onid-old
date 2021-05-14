import { Alert } from "@material-ui/lab";
import React from "react";
import "../styles/fnComponents.scss";

function Warning({ message }) {
  return (
    <div className="dashboard__alertHolder">
      <div className="dashboard__alert">
        <Alert severity="error">{message}</Alert>
      </div>
    </div>
  );
}

export default Warning;
