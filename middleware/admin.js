'use strict';

function Admin (leadsauth, url) {
  this._leadsauth = leadsauth;
  if (url[ url.length - 1 ] !== '/') {
    url += '/;';
  }
  this._url = url + 'la_logout';
}

Admin.prototype.getFunction = function () {
  return this._adminRequest.bind(this);
};

function adminLogout (request, response, leadsauth) {
  let data = '';

  request.on('data', d => {
    data += d.toString();
  });

  request.on('end', function () {
    let parts = data.split('.');
    let payload = JSON.parse(new Buffer(parts[1], 'base64').toString());
    if (payload.action === 'LOGOUT') {
      let sessionIDs = payload.adapterSessionIds;
      if (!sessionIDs) {
        leadsauth.grantManager.notBefore = payload.notBefore;
        response.send('ok');
        return;
      }
      if (sessionIDs && sessionIDs.length > 0) {
        let seen = 0;
        sessionIDs.forEach(id => {
          leadsauth.unstoreGrant(id);
          ++seen;
          if (seen === sessionIDs.length) {
            response.send('ok');
          }
        });
      } else {
        response.send('ok');
      }
    }
  });
}

function adminNotBefore (request, response, leadsauth) {
  let data = '';

  request.on('data', d => {
    data += d.toString();
  });

  request.on('end', function () {
    let parts = data.split('.');
    let payload = JSON.parse(new Buffer(parts[1], 'base64').toString());
    if (payload.action === 'PUSH_NOT_BEFORE') {
      leadsauth.grantManager.notBefore = payload.notBefore;
      response.send('ok');
    }
  });
}

module.exports = function (leadsauth, adminUrl) {
  let url = adminUrl;
  if (url[ url.length - 1 ] !== '/') {
    url = url + '/';
  }
  let urlLogout = url + 'la_logout';
  let urlNotBefore = url + 'la_push_not_before';

  return function adminRequest (request, response, next) {
    switch (request.url) {
      case urlLogout:
        adminLogout(request, response, leadsauth);
        break;
      case urlNotBefore:
        adminNotBefore(request, response, leadsauth);
        break;
      default:
        return next();
    }
  };
};
