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
    }).then(res => res.json()
    ).then(({ status, data, message }) => {
      if (status === 200) {
        return data;
      } else {
        console.log('ERROR', message);
        return [];
      }
    });
  } else {
    return [];
  }
};

/**
 Add user.
 */
export const postUsers = async (user, token) => {
  if (token) {
    const accessToken = token.access_token;
    return fetch(`${config.apiHost}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `bearer ${accessToken}`
       },
      body: JSON.stringify({username: user.username, name: user.name, eracommons: user.eracommons, orcid: user.orcid, organization: user.organization, contact_email: user.contact_email, google_email: user.google_email, expiration: user.expiration, datasets: []}),
    }).then((res) => res.json()).then(data => data);
  } else {
    return { message: 'No token sent' };
  }
};

/**
 Delete user/
 */

export const deleteUser = async (user, token) => {
  if (token) {
    const accessToken = JSON.parse(token).access_token;
    return fetch(`${config.apiHost}/user/${user}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `bearer ${accessToken}`
       },
    }).then(res => res.json())
    .then(({ status, data, message }) => {
      if (status === 200) {
        return true;
      }
      return message;
    });
  } else {
    return false;
  }
};
