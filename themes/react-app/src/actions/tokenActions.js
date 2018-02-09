export function setToken(token) {
  return {
    type: 'SET_TOKEN',
    payload: token
  }
}

export function setUserName(name) {
  return {
    type: 'SET_USER_NAME',
    payload: name
  }
}