import React from "react";
import { db, timestamp } from "../lib/firebase";

export const convertDate = (timestamp) => {
  if (!timestamp) {
    return;
  }

  let myTime = timestamp.toDate();
  let date = myTime.getDate();
  let month = myTime.getMonth();
  let year = myTime.getFullYear();
  return `${date}.${month + 1}.${year}`;
};

export const createNewTask = async (
  e,
  currentWsId,
  boardId,
  statusName,
  inputTask,
  userId
) => {
  e.preventDefault();
  let size = null;

  await db
    .collection("workStation")
    .doc(currentWsId)
    .collection("dashboard")
    .doc(boardId)
    .collection("task")
    .doc("123")
    .collection(statusName)
    .get()
    .then((data) => {
      size = data.size;
    });

  db.collection("workStation")
    .doc(currentWsId)
    .collection("dashboard")
    .doc(boardId)
    .collection("task")
    .doc("123")
    .collection(statusName)
    .add({
      taskName: inputTask,
      created: timestamp,
      userId: userId,
      priority: "Normal",
      index: size,
    })
    .then((data) => {
      db.collection("workStation")
        .doc(currentWsId)
        .collection("dashboard")
        .doc(boardId)
        .collection("task")
        .doc("123")
        .collection(statusName)
        .doc(data.id)
        .set(
          {
            listId: data.id,
          },
          { merge: true }
        );
    });
};
