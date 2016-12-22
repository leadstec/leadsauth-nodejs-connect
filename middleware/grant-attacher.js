'use strict';

module.exports = function (leadsauth) {
  return function grantAttacher (request, response, next) {
    leadsauth.getGrant(request, response)
      .then(grant => {
        request.lauth.grant = grant;
      })
      .then(next).catch(() => next());
  };
};
