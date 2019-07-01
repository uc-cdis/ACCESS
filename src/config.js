const authHost = 'https://gen3.datastage.io';
const apiHost = 'https://access-api.datastage.io';
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
