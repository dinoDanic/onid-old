import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, useHistory, withRouter } from "react-router-dom";
import { userInfo, login } from "./actions";
import ProtectedRoute from "./ProtectedRoute";
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
import ListModulesMenu from "./pages/list/components/ListModulesMenu";
import BoardList from "./pages/board_list/BoardList";

function App() {
  const dispatch = useDispatch();
  const loadingState = useSelector((state) => state.loading);
  const settingState = useSelector((state) => state.settings);
  const loginState = useSelector((state) => state.login);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      dispatch(userInfo(userData));
      dispatch(login(true));
    }
  }, []);

  return (
    <>
      <div className="app">
        {loginState && (
          <>
            <div className="app__workSpace">
              <div className="app__workSpaceData">
                <WorkSpace />
              </div>
              <div className="app__user">
                <User />
              </div>
            </div>
            <div className="app__board">
              <ProtectedRoute
                path="/ws/:id"
                component={Dashboard}
                isAuth={loginState}
              />
            </div>
          </>
        )}

        {!loadingState && (
          <>
            <div className="app__openBoard">
              <ProtectedRoute
                path="/ws/:id/dashboard/:id"
                component={OpenBoard}
                isAuth={loginState}
              />
              <ProtectedRoute
                exact
                path="/ws/:id"
                component={OpenWs}
                isAuth={loginState}
              />
              <ProtectedRoute
                path="/ws/:id/dashboard/:id/li"
                component={List}
                isAuth={loginState}
              />
              <ProtectedRoute
                path="/ws/:id/dashboard/:id/bo"
                component={BoardList}
                isAuth={loginState}
              />
            </div>
            {settingState && (
              <div className="app__settings">
                <ListModulesMenu />
              </div>
            )}
          </>
        )}
        {!loginState && (
          <Route exact path={["/login", "/"]} component={Login} />
        )}
      </div>
    </>
  );
}

export default App;
