import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { userInfo, login } from "./actions";
import "./styles/app.scss";
//PAGES
import Home from "./pages/Home";
import Login from "./pages/Login";

//COMPONENTS
import WorkSpace from "./components/WorkSpace";
import OpenBoard from "./pages/OpenBoard";
import Dashboard from "./components/Dashboard";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      dispatch(userInfo(userData));
      dispatch(login());
    }
  }, []);
  return (
    <div className="app">
      <Router>
        <div className="app__workSpace">
          <WorkSpace />
        </div>
        <div className="app__board">
          <Dashboard />
        </div>
        <div className="app__openBoard">
          <Route path="/:id" component={OpenBoard} />
        </div>
        <Route exact path="/login" component={Login} />
      </Router>
    </div>
  );
}

export default App;
