'use strict';

const test = require('tape');
const LeadsAuth = require('../../index');
const UUID = require('../../uuid');
const session = require('express-session');

let la = null;

test('setup', t => {
  let laConfig = {
    'realm': 'test-realm',
    'auth-server-url': 'http://localhost:8080/auth',
    'ssl-required': 'external',
    'resource': 'nodejs-connect',
    'public-client': true
  };

  let memoryStore = new session.MemoryStore();
  la = new LeadsAuth({store: memoryStore, scope: 'offline_support'}, laConfig);
  t.end();
});

test('Should verify the realm name of the config object.', t => {
  t.equal(la.config.realm, 'test-realm');
  t.end();
});

test('Should verify if login URL has the configured realm.', t => {
  t.equal(la.loginUrl().indexOf(la.config.realm) > 0, true);
  t.end();
});

test('Should verify if login URL has the custom scope value.', t => {
  t.equal(la.loginUrl().indexOf(la.config.scope) > 0, true);
  t.end();
});

test('Should verify if login URL has the default scope value.', t => {
  t.equal(la.loginUrl().indexOf('openid') > 0, true);
  t.end();
});

test('Should verify if logout URL has the configured realm.', t => {
  t.equal(la.logoutUrl().indexOf(la.config.realm) > 0, true);
  t.end();
});

test('Should generate a correct UUID.', t => {
  const rgx = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;
  t.equal(rgx.test(UUID()), true);
  t.end();
});

test('Should produce correct account url.', t => {
  t.equal(la.accountUrl(), 'http://localhost:8080/auth/realms/test-realm/account');
  t.end();
});
