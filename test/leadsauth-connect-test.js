'use strict';

const test = require('tape');
const roi = require('roi');

test('Should test unprotected route.', t => {
  const options = {
    'endpoint': 'http://localhost:3000/'
  };

  roi.get(options)
    .then(x => {
      t.equal(JSON.parse(x.body).name, 'unprotected');
      t.end();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});

test('Should test protected route.', t => {
  const options = {
    'endpoint': 'http://localhost:3000/login'
  };

  roi.get(options)
    .then(x => {
      t.equal(x.statusCode !== 404, true);
      t.end();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});

test('Should verify logout feature.', t => {
  const options = {
    'endpoint': 'http://localhost:3000/logout'
  };

  roi.get(options)
    .then(x => {
      t.equal(JSON.parse(x.body).name, 'unprotected');
      t.end();
    })
    .catch(e => {
      console.error(e);
      t.fail();
    });
});
