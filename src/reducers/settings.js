const settings = (state = false, action) => {
  switch (action.type) {
    case "SET_SETTINGS_STATE":
      return action.payload;
    default:
      return state;
  }
};

export default settings;
