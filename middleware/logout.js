'use strict';

module.exports = function (leadsauth, logoutUrl) {
  return function logout (request, response, next) {
    if (request.url !== logoutUrl) {
      return next();
    }

    if (request.lauth.grant) {
      leadsauth.deauthenticated(request);
      request.lauth.grant.unstore(request, response);
      delete request.lauth.grant;
    }

    let host = request.hostname;
    let headerHost = request.headers.host.split(':');
    let port = headerHost[1] || '';
    let redirectUrl = request.protocol + '://' + host + (port === '' ? '' : ':' + port) + '/';
    let leadsauthLogoutUrl = leadsauth.logoutUrl(redirectUrl);

    response.redirect(leadsauthLogoutUrl);
  };
};
