import config from '../config';

/**
 Fetches the user and returns if the user is logged in.
 */
export const userIsLoggedIn = async (token) => {
  if (token) {
    const accessToken = token.access_token;
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

export const fetchLoginOptions = async () => {
  return fetch(config.loginOptionsUrl, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(res => res.json()).catch(error => {
    console.error('ERROR', error);
    return error;
  });
}

/**
 Returns logged in user information
 e.g. {iam: 'DAC'/'PI', organization: 'xxx', datasets: ['a', 'b']}
 */
export const whoAmI = async (accessToken) => {
  if (accessToken) {
    return fetch(`${config.apiHost}/whoami`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${accessToken}`
       },
    }).then(res => res.json())
    .then(data => {
      if (!data.iam) {
        console.error(data);
        return {};
      }
      return data;
    })
    .catch(error => {
      console.error('ERROR', error);
      return error;
    });
  } else {
    return {};
  }
};

/**
 Fetches the user
 */
export const getUser = (token) =>
  fetch(config.userApi, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
       'Authorization': `bearer ${token}`
     },
  })
  .then(res => res.json())
  .then(data => data)
  .catch(error => {
    console.error('ERROR', error)
  });

/**
 Redirects the user to the authorization endpoint.
 Before doing this, stores the current location in session storage for later use.
 @param { string } location - the current url location.
 */
export const loginRedirect = (idp, location) => {
  const redirectUri = encodeURIComponent(`${config.redirectUrl}`);
  sessionStorage.setItem('origin', location);
  window.location = `${config.authUrl}?idp=${idp}&client_id=${config.clientId}&redirect_uri=${redirectUri}&response_type=${config.oauthResponseType}&scope=${config.oauthScope}`;
};
