const membersWs = (state = null, action) => {
  switch (action.type) {
    case "SET_MEMBERS_WS":
      return action.payload;
    default:
      return state;
  }
};

export default membersWs;
