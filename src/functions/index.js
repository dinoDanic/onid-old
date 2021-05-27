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
