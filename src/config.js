const env = process.env.REACT_APP_ENV || 'dev';

const commonsList = [
  {
    'name': 'DCP & Data STAGE',
    'tokenPath': 'dcp',
    'authUrl': 'https://qa-dcp.planx-pla.net/user/oauth2/authorize',
    'clientId': process.env.REACT_APP_CLIENT_ID_DCP,
  },
];

const baseUrl = env === 'dev' ? `${window.location}build/index.html` : null;
const oauthResponseType='id_token+token';
const oauthScope='openid+user'

module.exports = {
  commonsList,
  baseUrl,
  oauthResponseType,
  oauthScope,
};
