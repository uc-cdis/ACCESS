// Backend API URL. By default, use QA backend
const apiHost = process.env.REACT_APP_API_HOST || 'https://qa-access-api.planx-pla.net';

// Implicit client to login. By default, assume we log in through staging
const authHost = process.env.REACT_APP_AUTH_HOST || 'https://staging.datastage.io';
const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUrl = process.env.REACT_APP_REDIRECT_URL;
const oauthResponseType='id_token+token';
const oauthScope='openid+user'
const authUrl = `${authHost}/user/oauth2/authorize`;
const tokenPath = 'stageToken';
const userApi =`${authHost}/user/user`;
const loginOptionsUrl = `${authHost}/user/login`;

module.exports = {
  oauthResponseType,
  oauthScope,
  authUrl,
  clientId,
  redirectUrl,
  tokenPath,
  userApi,
  apiHost,
  loginOptionsUrl,
};
