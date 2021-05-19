export const login = (state) => {
  return {
    type: "SET_LOGIN",
    payload: state,
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

export const loading = (state) => {
  return {
    type: "SET_LOADING",
    payload: state,
  };
};

export const activeModulesAction = (list) => {
  return {
    type: "SET_ACTIVE_MODULES",
    payload: list,
  };
};

export const settings = (state) => {
  return {
    type: "SET_SETTINGS_STATE",
    payload: state,
  };
};

export const wsDataAction = (dataWs) => {
  return {
    type: "SET_WSDATA",
    payload: dataWs,
  };
};

export const dbData = (data) => {
  return {
    type: "SET_DB_DATA",
    payload: data,
  };
};

export const membersWs = (members) => {
  return {
    type: "SET_MEMBERS_WS",
    payload: members,
  };
};
