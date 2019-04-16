import config from '../config';

/**
 Fetches the users in the table.
 */
export const getUsers = async (token) => {
  if (token) {
    const accessToken = token.access_token;
    return fetch(`${config.apiHost}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${accessToken}`
      },
    }).then(res => res.json())
    .then(data => {
      if (!(data instanceof Array)) {
        console.error(data);
        return [];
      }
      return data;
    })
    .catch(error => {
      console.log('ERROR', error);
      return error;
    });
  } else {
    return [];
  }
};

/**
 Add user.
 Note: user.datasets=[] for users created by PIs
 */
export const postUser = async (user, token) => {
  if (token) {
    const accessToken = token.access_token;
    return fetch(`${config.apiHost}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${accessToken}`
      },
      body: JSON.stringify({username: user.username, name: user.name, eracommons: user.eracommons, orcid: user.orcid, organization: user.organization, contact_email: user.contact_email, google_email: user.google_email, expiration: user.expiration, datasets: user.datasets}),
    })
    .then((res) => res.json())
    .then(data => data.reason ? { message: data.reason } : data);
  } else {
    return { message: 'No token sent' };
  }
};

/**
 Edit user.
 */
export const editUser = async (user, token) => {
  if (token) {
    const accessToken = token.access_token;
    return fetch(`${config.apiHost}/users`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${accessToken}`
      },
      body: JSON.stringify({username: user.username, name: user.name, eracommons: user.eracommons, orcid: user.orcid, organization: user.organization, contact_email: user.contact_email, google_email: user.google_email, expiration: user.expiration, datasets: user.datasets}),
    }).then((res) => res.json())
    .then(data => data.reason ? { message: data.reason } : data);
  } else {
    return { message: 'No token sent' };
  }
};

/**
 Delete user/
 */
export const deleteUser = async (username, token) => {
  if (token) {
    const accessToken = token.access_token;
    return fetch(`${config.apiHost}/user/${username}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${accessToken}`
      },
    }).then((res) => res.json())
    .then(data => data.reason ? { message: data.reason } : data);
  } else {
    return { message: 'No token sent' };
  }
};
