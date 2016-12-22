'use strict';

let CookieStore = {};

CookieStore.TOKEN_KEY = 'leadsauth-token';

CookieStore.get = (request) => {
  let value = request.cookies[CookieStore.TOKEN_KEY];
  if (value) {
    try {
      return JSON.parse(value);
    } catch (err) {
      // ignore
    }
  }
};

let store = (grant) => {
  return (request, response) => {
    request.session[CookieStore.TOKEN_KEY] = grant.__raw;
  };
};

let unstore = (request, response) => {
  response.clearCookie(CookieStore.TOKEN_KEY);
};

CookieStore.wrap = (grant) => {
  grant.store = store(grant);
  grant.unstore = unstore;
};

module.exports = CookieStore;
