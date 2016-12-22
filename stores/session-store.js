'use strict';

function SessionStore (store) {
  this.store = store;
}

SessionStore.TOKEN_KEY = 'leadsauth-token';

SessionStore.prototype.get = (request) => request.session[SessionStore.TOKEN_KEY];

SessionStore.prototype.clear = function (sessionId) {
  let self = this;
  this.store.get(sessionId, (err, session) => {
    if (err) {
      console.log(err);
    }
    if (session) {
      delete session[SessionStore.TOKEN_KEY];
      self.store.set(sessionId, session);
    }
  });
};

let store = (grant) => {
  return (request, response) => {
    request.session[SessionStore.TOKEN_KEY] = grant.__raw;
  };
};

let unstore = (request, response) => {
  delete request.session[SessionStore.TOKEN_KEY];
};

SessionStore.prototype.wrap = (grant) => {
  grant.store = store(grant);
  grant.unstore = unstore;
};

module.exports = SessionStore;
