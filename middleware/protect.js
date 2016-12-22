'use strict';

const UUID = require('./../uuid');

function forceLogin (leadsauth, request, response) {
  let host = request.hostname;
  let headerHost = request.headers.host.split(':');
  let port = headerHost[1] || '';
  let protocol = request.protocol;
  let hasQuery = ~(request.originalUrl || request.url).indexOf('?');

  let redirectUrl = protocol + '://' + host + (port === '' ? '' : ':' + port) + (request.originalUrl || request.url) + (hasQuery ? '&' : '?') + 'auth_callback=1';

  if (request.session) {
    request.session.auth_redirect_uri = redirectUrl;
  }

  let uuid = UUID();
  let loginURL = leadsauth.loginUrl(uuid, redirectUrl);
  response.redirect(loginURL);
}

function simpleGuard (role, token) {
  return token.hasRole(role);
}

module.exports = function (leadsauth, spec) {
  let guard;

  if (typeof spec === 'function') {
    guard = spec;
  } else if (typeof spec === 'string') {
    guard = simpleGuard.bind(undefined, spec);
  }

  return function protect (request, response, next) {
    if (request.lauth && request.lauth.grant) {
      if (!guard || guard(request.lauth.grant.access_token, request, response)) {
        return next();
      }

      return leadsauth.accessDenied(request, response, next);
    }

    if (leadsauth.redirectToLogin(request)) {
      forceLogin(leadsauth, request, response);
    } else {
      return leadsauth.accessDenied(request, response, next);
    }
  };
};
