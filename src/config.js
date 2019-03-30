const authHost = 'https://gen3.datastage.io';
const oauthResponseType='id_token+token';
const oauthScope='openid+user'
const authUrl = `${authHost}/user/oauth2/authorize`;
const clientId = process.env.REACT_APP_CLIENT_ID;
const redirectUrl = process.env.REDIRECT_URL;
const tokenPath = 'stageToken';
const userApi =`${authHost}/user/user`;

module.exports = {
  oauthResponseType,
  oauthScope,
  authUrl,
  clientId,
  tokenPath,
  userApi,
};
