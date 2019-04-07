import config from '../config';

/**
 Fetches the users in the table.
 */
export const getDatasets = async (token) => {
  if (token) {
    const accessToken = token.access_token;
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
