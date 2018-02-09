const defaultState = {
  selected: 'tomorrow-night-eighties',
  style: require('../../node_modules/react-syntax-highlighter/dist/styles/hljs/tomorrow-night-eighties').default,
  showLineNumbers: false
};
export default (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_STYLE':
      return {
        ...state,
        selected: action.payload.selected,
        style: action.payload.style
      };
    case 'TOGGLE_LINE_NUMBERS':
      return {
        ...state,
        showLineNumbers: action.payload
      };
    default:
      return state;
  }
};