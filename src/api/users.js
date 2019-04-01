import config from '../config';
import { getToken } from './login';

/**
 Fetches the users in the table.
 */
export const getUsers = async () => {
  const token = getToken(config.tokenPath);
  if (token) {
    const accessToken = JSON.parse(token).access_token;
    return fetch(`${config.apiHost}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `bearer ${accessToken}`
       },
    }).then((res) => {
      if (res.status === 200) {
        return res.json();
      }
      return [];
    });
  } else {
    return [];
  }
};

/**
 Add user.
 */
export const postUsers = async (user) => {
  const token = getToken(config.tokenPath);
  if (token) {
    const accessToken = JSON.parse(token).access_token;
    return fetch(`${config.apiHost}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `bearer ${accessToken}`
       },
      body: JSON.stringify({username: user.username, name: user.name, eracommons: user.eracommons, orcid: user.orcid, organization: user.organization, contact_email: user.contact_email, google_email: user.google_email, expiration: user.expiration, datasets: []}),
    }).then((res) => {
      if (res.status === 200) {
        return true;
      }
      return false;
    });
  } else {
    return false;
  }
};

/**
 Delete user/
 */

export const deleteUser = async (user) => {
  const token = getToken(config.tokenPath);
  if (token) {
    const accessToken = JSON.parse(token).access_token;
    return fetch(`${config.apiHost}/user/${user}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
         'Authorization': `bearer ${accessToken}`
       },
    }).then((res) => {
      if (res.status === 200) {
        return true;
      }
      return false;
    });
  } else {
    return false;
  }
};
