const setCode = (state, newCode) => {
  state.code = newCode;
};

const setToken = (state, newToken) => {
  state.token = newToken;
};

const setWebGuardToken = (state, web_guard_token) => {
  state.web_guard_token = web_guard_token;
};

const setInfo = (state, info) => {
  state.info = info;
};

export default {
  setInfo,
  setCode,
  setToken,
  setWebGuardToken,
};
