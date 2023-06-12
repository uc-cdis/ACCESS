const initialState = {
  user: null,
  token: null,
  whoAmI: null,
};

const userReducer (state = initialState, action) => {
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
      whoAmI: action.whoAmI,
    }
    default:
    return state
  }
}

export default userReducer;
