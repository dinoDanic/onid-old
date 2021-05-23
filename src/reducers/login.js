const login = (state = false, action) => {
  switch (action.type) {
    case "SET_LOGIN":
      return action.payload;
    default:
      return state;
  }
};

export default login;
