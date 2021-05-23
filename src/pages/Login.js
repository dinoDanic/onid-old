import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { provider, auth } from "../lib/firebase";
import { userInfo, login } from "../actions";
import { useHistory } from "react-router-dom";

function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const handleLogin = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        /** @type {firebase.auth.OAuthCredential} */
        /* var credential = result.credential; */

        // This gives you a Google Access Token. You can use it to access the Google API.
        /* var token = credential.accessToken; */
        // The signed-in user info.
        var userData = result.user;
        dispatch(userInfo(userData));
        dispatch(login());
        localStorage.setItem("user", JSON.stringify(userData));
        history.push("/");
      })
      .catch((error) => {
        // Handle Errors here.
        /* var errorCode = error.code; */
        /* var errorMessage = error.message; */
        // The email of the user's account used.
        /* var email = error.email; */
        // The firebase.auth.AuthCredential type that was used.
        /* var credential = error.credential; */
        // ...
      });
  };

  return (
    <div>
      <button onClick={handleLogin}>Login with google</button>
    </div>
  );
}

export default Login;
