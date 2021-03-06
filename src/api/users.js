import config from '../config';

const getCleanUserData = (user) => {
  return {
    username: user.username ? user.username.trim() : "N/A",
    name: user.name ? user.name.trim() : "N/A",
    eracommons: user.eracommons ? user.eracommons.trim() : "N/A",
    orcid: user.orcid ? user.orcid.trim() : "N/A",
    organization: user.organization ? user.organization.trim() : "N/A",
    contact_email: user.contact_email ? user.contact_email.trim() : "N/A",
    google_email: user.google_email ? user.google_email.trim() : "N/A",
    expiration: user.expiration ? user.expiration.trim() : "N/A",
    datasets: user.datasets
  }
}

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
      console.error('ERROR', error);
      return error;
    });
  } else {
    console.error('No token sent');
    return [];
  }
};

/**
 Fetches the users added by a PI.
 */
export const getUsersForPI = async (token, piUsername) => {
  if (token) {
    const accessToken = token.access_token;
    return fetch(`${config.apiHost}/users/${piUsername}`, {
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
      console.error('ERROR', error);
      return error;
    });
  } else {
    console.error('No token sent');
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
      body: JSON.stringify(getCleanUserData(user)),
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
      body: JSON.stringify(getCleanUserData(user)),
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
