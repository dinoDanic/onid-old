import { combineReducers } from "redux";
import userInfo from "./userInfo";
import login from "./login";
import currentWsId from "./currentWsId";

const allReducers = combineReducers({
  currentWsId,
  login,
  userInfo,
});

export default allReducers;
