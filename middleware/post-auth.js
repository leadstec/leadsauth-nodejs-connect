'use strict';

const URL = require('url');

module.exports = function (leadsauth) {
  return function postAuth (request, response, next) {
    if (!request.query.auth_callback) {
      return next();
    }

    if (request.query.error) {
      return leadsauth.accessDenied(request, response, next);
    }

    leadsauth.getGrantFromCode(request.query.code, request, response)
      .then(grant => {
        let urlParts = {
          pathname: request.path,
          query: request.query
        };

        delete urlParts.query.code;
        delete urlParts.query.auth_callback;
        delete urlParts.query.state;

        let cleanUrl = URL.format(urlParts);

        request.lauth.grant = grant;
        try {
          leadsauth.authenticated(request);
        } catch (err) {
          console.log(err);
        }
        response.redirect(cleanUrl);
      });
  };
};
