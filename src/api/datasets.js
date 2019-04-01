import config from '../config';
import { getToken } from './login';

/**
 Fetches the users in the table.
 */
export const getDatasets = async () => {
  const token = getToken(config.tokenPath);
  if (token) {
    const accessToken = JSON.parse(token).access_token;
    return fetch(`${config.apiHost}/datasets`, {
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
