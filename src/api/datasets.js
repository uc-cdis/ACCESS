import config from '../config';

/**
 Fetches the datasets.
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
    }).then(res => res.json())
    .then(data => {
      if (!(data instanceof Array)) {
        console.error(data);
        return [];
      }
      console.log('datasets are', data)
      return data;
    })
    .catch(error => {
      console.error('ERROR', error);
      return error;
    });
  } else {
    return [];
  }
};

/**
 Add dataset.
 */
export const postDataset = async (dataset, token) => {
  if (token) {
    const accessToken = token.access_token;
    return fetch(`${config.apiHost}/datasets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `bearer ${accessToken}`
      },
      body: JSON.stringify({name: dataset.name, phsid: dataset.phsid}),
    })
    .then((res) => {console.log(res); return res.json()})
    .then(data => data.reason ? { message: data.reason } : data);
  } else {
    return { message: 'No token sent' };
  }
};
