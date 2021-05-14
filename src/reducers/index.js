import { combineReducers } from "redux";
import userInfo from "./userInfo";
import login from "./login";
import currentWsId from "./currentWsId";
import loadingReducer from "./loading";
import activeModulesReducer from "./activeModules";
import settings from "./settings";
import wsData from "./wsData";

const allReducers = combineReducers({
  currentWsId,
  login,
  userInfo,
  loading: loadingReducer,
  activeModules: activeModulesReducer,
  settings,
  wsData,
});

export default allReducers;
