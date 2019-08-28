// Backend API URL. By default, use QA backend
const apiHost = process.env.REACT_APP_API_HOST || 'https://qa-access-api.planx-pla.net';

const authHost = 'https://gen3.datastage.io';
const oauthResponseType='id_token+token';
const oauthScope='openid+user'
const authUrl = `${authHost}/user/oauth2/authorize`;
const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUrl = process.env.REACT_APP_REDIRECT_URL;
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
