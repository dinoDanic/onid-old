import React from "react";
import { useDispatch } from "react-redux";
import { provider, auth } from "../lib/firebase";
import { userInfo, login } from "../actions";
import { useHistory } from "react-router-dom";
import { db } from "../lib/firebase";
import BrutalBtn from "../components/brutal/BrutalBtn";

function Login() {
  const dispatch = useDispatch();
  const history = useHistory();
  const handleLogin = () => {
    auth
      .signInWithPopup(provider)
      .then((result) => {
        var userData = result.user;
        db.collection("users")
          .doc(userData.uid)
          .get()
          .then((docData) => {
            if (docData.exists) {
              db.collection("users").doc(userData.uid).update({
                userId: userData.uid,
                userName: userData.displayName,
                userPhoto: userData.photoURL,
                email: userData.email,
              });
            } else {
              db.collection("users").doc(userData.uid).set({
                mainWs: null,
                userId: userData.uid,
                userName: userData.displayName,
                userPhoto: userData.photoURL,
                email: userData.email,
              });
            }
          });
        /* db.collection("users").doc(userData.uid).set({
          userId: userData.uid,
          userName: userData.displayName,
        }); */

        /** @type {firebase.auth.OAuthCredential} */
        /* var credential = result.credential; */

        // This gives you a Google Access Token. You can use it to access the Google API.
        /* var token = credential.accessToken; */
        // The signed-in user info.
        dispatch(userInfo(userData));
        dispatch(login(true));
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
    <div className="login">
      <div className="brutalPop" style={{ flexDirection: "column" }}>
        <h3 style={{ textAlign: "center" }}>
          onid <p>v.0.1.3</p>
        </h3>
        <div className="brutalPop__box">
          <div onClick={handleLogin}>
            <BrutalBtn tekst="Login / Sign up with google" />
          </div>
        </div>
        <br />
        <p>last update</p>
        <p>24.05.21</p>
      </div>
    </div>
  );
}

export default Login;
