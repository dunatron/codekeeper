const defaultState = {
  token: localStorage.getItem('jwt'),
  yourData: "Dunatron"
};
export default (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_TOKEN':
      return {
        ...state,
        token: action.payload
      };
    case 'SET_USER_NAME':
      return {
        ...state,
        userName: action.payload
      };
    default:
      return state;
  }
};