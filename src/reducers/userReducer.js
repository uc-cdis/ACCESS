const initialState = {
  user: null,
  token: null
};

export default (state = initialState, action) => {
  switch (action.type) {
    case 'RECEIVE_USER':
    return {
      user: action.data,
    }
    case 'LOGOUT':
    return {
      token: null,
      user: null,
    }
    case 'LOGIN':
    return {
      token: action.token,
      user: action.user,
    }
    default:
    return state
  }
}
