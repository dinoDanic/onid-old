const dbData = (state = null, action) => {
  switch (action.type) {
    case "SET_DB_DATA":
      return action.payload;
    default:
      return state;
  }
};

export default dbData;
