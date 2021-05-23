const login = (state = false, action) => {
  switch (action.type) {
    case "SET_LOGIN_TRUE":
      return true;
    default:
      return state;
  }
};

export default login;
