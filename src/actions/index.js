export const login = () => {
  return {
    type: "SET_LOGIN_TRUE",
  };
};

export const userInfo = (user) => {
  return {
    type: "SET_USER_INFO",
    payload: user,
  };
};

export const currentWsId = (id) => {
  return {
    type: "SET_CURRENT_WSID",
    payload: id,
  };
};
