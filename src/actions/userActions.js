import { getUser } from '../api/login';

export const fetchUserInfo = (token) => async (dispatch) => {
  dispatch({
    type: 'RECEIVE_USER',
    data: token ? await getUser(token.access_token) : null,
  })
}

export const login = (token) => async (dispatch) => {
  dispatch({
    type: 'LOGIN',
    token: token,
    user: token ? await getUser(token.access_token) : null,
  })
}

export const logout = () => dispatch => {
  dispatch({
    type: 'LOGOUT',
    token: null,
    user: null,
  })
}
