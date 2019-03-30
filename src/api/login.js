import querystring from 'querystring';
import config from '../config';

/**
 Fetches the user and returns if the user is logged in.
 */
export const userIsLoggedIn = async () => {
  const token = getToken(config.tokenPath);
  if (token) {
    const accessToken = JSON.parse(token).access_token;
    return fetch(config.userApi, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `bearer ${accessToken}`
       },
    }).then((res) => {
      return res.status === 200;
    });
  } else {
    return false;
  }
};

/**
 Fetches the user's access token for a specific commons from session storage.
 @return { object } - the token stored for that commons OR
 @return { null }
 */
export const getToken = (name) => {
  return sessionStorage.getItem(name) || null;
};

/**
 Redirects the user to the authorization endpoint for a specific commons.
 Before doing this, stores the commons to be logged into and the current location
 in session storage for later use.
 @param { string } location - the current url location.
 */
export const loginRedirect = (location) => {
  const redirectUri = encodeURIComponent(`${config.redirectUrl}`);
  sessionStorage.setItem('origin', location);
  window.location = `${config.authUrl}?client_id=${config.clientId}&redirect_uri=${redirectUri}&response_type=${config.oauthResponseType}&scope=${config.oauthScope}`;
};

/**
 Saves the token for a specific commons to session storage.
 @param { object } token - the token to be saved.
 */
export const saveToken = (name, token) => {
  const authToken = JSON.stringify(token);
  sessionStorage.setItem(name, authToken);
};

/**
 Handles actions needed after the token is returned by OAuth - saves the token
 and redirects the user back to the original location. Also removes the temporary
 variables stored in session storage - the name of the commons being logged into
 and the location of the user when login initiated.
 */
export const handleLoginCompletion = () => {
  const fragments = window.location.href.split('#');
  if (fragments.length === 1) {
    return
  }
  const responseValues = fragments[1];
  const tokenParams = querystring.parse(responseValues);
  const origin = sessionStorage.getItem('origin');
  if (tokenParams && !tokenParams.error) {
    saveToken(config.tokenPath, tokenParams);
  }
  window.location = `${origin}manage`;
};

export const logout = () => {
  sessionStorage.removeItem(config.tokenPath);
}
