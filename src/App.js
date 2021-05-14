import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Route, useHistory } from "react-router-dom";
import { userInfo, login } from "./actions";
import "./styles/app.scss";
import "./styles/fn.scss";
//PAGES
import Login from "./pages/Login";

//COMPONENTS
import WorkSpace from "./components/WorkSpace";
import OpenBoard from "./pages/OpenBoard";
import Dashboard from "./pages/Dashboard";
import OpenWs from "./pages/OpenWs";
import List from "./pages/list/List";
import User from "./components/User";
import ListSettings from "./pages/list/components/ListSettings";

function App() {
  const dispatch = useDispatch();
  const loadingState = useSelector((state) => state.loading);
  const settingState = useSelector((state) => state.settings);
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      dispatch(userInfo(userData));
      dispatch(login(true));
    }
  }, []);

  return (
    <div className="app">
      <Router>
        <div className="app__workSpace">
          <div className="app__workSpaceData">
            <WorkSpace />
          </div>
          <div className="app__user">
            <User />
          </div>
        </div>
        <div className="app__board">
          <Route path="/ws/:id" component={Dashboard} />
        </div>
        {!loadingState && (
          <>
            <div className="app__openBoard">
              <Route path="/ws/:id/dashboard/:id" component={OpenBoard} />
              <Route exact path="/ws/:id" component={OpenWs} />
              <Route path="/ws/:id/dashboard/:id/li" component={List} />
            </div>
            {settingState && (
              <div className="app__settings">
                <ListSettings />
              </div>
            )}
          </>
        )}
        <Route exact path="/login" component={Login} />
      </Router>
    </div>
  );
}

export default App;
