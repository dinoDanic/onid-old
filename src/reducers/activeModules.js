const activeModulesReducer = (state = [], action) => {
  switch (action.type) {
    case "SET_ACTIVE_MODULES":
      return action.payload;
    default:
      return state;
  }
};

export default activeModulesReducer;
