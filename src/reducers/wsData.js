const wsData = (state = "", action) => {
  switch (action.type) {
    case "SET_WSDATA":
      return action.payload;
    default:
      return state;
  }
};

export default wsData;
