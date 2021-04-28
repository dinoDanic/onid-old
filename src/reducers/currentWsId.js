const currentWsId = (state = "", action) => {
  switch (action.type) {
    case "SET_CURRENT_WSID":
      return action.payload;
    default:
      return state;
  }
};

export default currentWsId;
