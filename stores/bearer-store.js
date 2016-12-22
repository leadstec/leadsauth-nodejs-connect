'use strict';

let BearerStore = {};

BearerStore.get = (request) => {
  let header = request.headers.authorization;

  if (header) {
    if (header.indexOf('bearer ') === 0 || header.indexOf('Bearer ') === 0) {
      let accessToken = header.substring(7);
      return {
        access_token: accessToken
      };
    }
  }
};

module.exports = BearerStore;
