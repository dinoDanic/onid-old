import React, { useEffect, useState } from "react";
import { db } from "../lib/firebase";
// Style
import { Avatar } from "@material-ui/core";
import "../styles/fullTask.scss";

function Reply({ userId, input }) {
  const [userData, setUserData] = useState();

  useEffect(() => {
    const getUserData = () => {
      db.collection("users")
        .doc(userId)
        .get()
        .then((data) => {
          setUserData(data.data());
        });
    };
    getUserData();
  }, [setUserData]);

  return (
    <div className="fullTask__Reply">
      <div className="fullTask__user">
        <Avatar src={userData?.userPhoto} />
        <p>{userData?.userName}</p>
      </div>
      <p>{input}</p>
    </div>
  );
}

export default Reply;
