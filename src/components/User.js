import React, { useState } from "react";
import { Avatar, Menu, MenuItem } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { userInfo, login } from "../actions";
import "../styles/user.scss";

function User() {
  const userData = useSelector((state) => state.userInfo);
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    localStorage.removeItem("user");
    dispatch(userInfo(""));
    dispatch(login(false));
    history.push("/login");
  };

  return (
    <div className="user">
      <Avatar
        src={userData.photoURL}
        aria-controls="simple-menu"
        aria-haspopup="true"
        onClick={handleClick}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </Menu>
    </div>
  );
}

export default User;
