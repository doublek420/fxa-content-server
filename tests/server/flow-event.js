/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define([
  'intern!object',
  'intern/chai!assert',
  'intern/dojo/node!../../server/lib/flow-event',
  'intern/dojo/node!os',
  'intern/dojo/node!sinon',
], function (registerSuite, assert, flowEvent, os, sinon) {
  var time, write;

  registerSuite({
    name: 'flow-event',

    'interface is correct': function () {
      assert.isFunction(flowEvent);
      assert.lengthOf(flowEvent, 3);
    },

    'call flowEvent with service and entrypoint': {
      setup: function () {
        write = process.stderr.write;
        process.stderr.write = sinon.spy();
        return flowEvent('mock event', { a: 'b', c: 'd', time: 'wibble' }, {
          headers: { 'user-agent': 'foo' },
          originalUrl: 'bar',
          query: {
            context: 'mock context',
            entrypoint: 'mock entrypoint',
            migration: 'mock migration',
            service: 'mock service',
            /*eslint-disable camelcase*/
            utm_campaign: 'mock utm_campaign',
            utm_content: 'mock utm_content',
            utm_medium: 'mock utm_medium',
            utm_source: 'mock utm_source',
            utm_term: 'mock utm_term',
            /*eslint-enable camelcase*/
            zignore: 'ignore me'
          }
        });
      },

      teardown: function () {
        process.stderr.write = write;
      },

      'process.stderr.write was called correctly': function () {
        assert.equal(process.stderr.write.callCount, 1);

        var args = process.stderr.write.args[0];
        assert.lengthOf(args, 1);
        assert.equal(args[0][args[0].length - 1], '\n');

        var eventData = JSON.parse(args[0]);
        assert.isObject(eventData);
        assert.lengthOf(Object.keys(eventData), 18);
        assert.equal(eventData.op, 'flowEvent');
        assert.equal(eventData.hostname, os.hostname());
        assert.equal(eventData.pid, process.pid);
        assert.equal(eventData.v, 1);
        assert.equal(eventData.event, 'mock event');
        assert.equal(eventData.userAgent, 'foo');
        assert.equal(eventData.a, 'b');
        assert.equal(eventData.c, 'd');
        assert.equal(eventData.time, 'wibble');
        assert.equal(eventData.context, 'mock context');
        assert.equal(eventData.entrypoint, 'mock entrypoint');
        assert.equal(eventData.migration, 'mock migration');
        assert.equal(eventData.service, 'mock service');
        /*eslint-disable camelcase*/
        assert.equal(eventData.utm_campaign, 'mock utm_campaign');
        assert.equal(eventData.utm_content, 'mock utm_content');
        assert.equal(eventData.utm_medium, 'mock utm_medium');
        assert.equal(eventData.utm_source, 'mock utm_source');
        assert.equal(eventData.utm_term, 'mock utm_term');
        /*eslint-enable camelcase*/
      }
    },

    'call flowEvent with client_id': {
      setup: function () {
        write = process.stderr.write;
        process.stderr.write = sinon.spy();
        return flowEvent('wibble', {}, {
          headers: { 'user-agent': 'blee' },
          originalUrl: '/',
          query: {
            client_id: 'mock client id', //eslint-disable-line camelcase
            ignore: 'ignore me'
          }
        });
      },

      teardown: function () {
        process.stderr.write = write;
      },

      'process.stderr.write was called correctly': function () {
        assert.equal(process.stderr.write.callCount, 1);

        var eventData = JSON.parse(process.stderr.write.args[0][0]);
        assert.lengthOf(Object.keys(eventData), 7);
        assert.equal(eventData.op, 'flowEvent');
        assert.equal(eventData.hostname, os.hostname());
        assert.equal(eventData.pid, process.pid);
        assert.equal(eventData.v, 1);
        assert.equal(eventData.event, 'wibble');
        assert.equal(eventData.userAgent, 'blee');
        assert.equal(eventData.service, 'mock client id');
      }
    },

    'call flowEvent with service and client_id': {
      setup: function () {
        write = process.stderr.write;
        process.stderr.write = sinon.spy();
        return flowEvent('wibble', {}, {
          headers: { 'user-agent': 'blee' },
          originalUrl: '/',
          query: {
            client_id: 'mock client id', //eslint-disable-line camelcase
            service: 'mock service',
            zignore: 'ignore me'
          }
        });
      },

      teardown: function () {
        process.stderr.write = write;
      },

      'process.stderr.write was called correctly': function () {
        assert.equal(process.stderr.write.callCount, 1);

        var eventData = JSON.parse(process.stderr.write.args[0][0]);
        assert.lengthOf(Object.keys(eventData), 7);
        assert.equal(eventData.service, 'mock service');
      }
    },

    'call flowEvent with entryPoint': {
      setup: function () {
        write = process.stderr.write;
        process.stderr.write = sinon.spy();
        return flowEvent('wibble', {}, {
          headers: { 'user-agent': 'blee' },
          originalUrl: '/',
          query: {
            entryPoint: 'mock entryPoint', //eslint-disable-line camelcase
            ignore: 'ignore me'
          }
        });
      },

      teardown: function () {
        process.stderr.write = write;
      },

      'process.stderr.write was called correctly': function () {
        assert.equal(process.stderr.write.callCount, 1);

        var eventData = JSON.parse(process.stderr.write.args[0][0]);
        assert.lengthOf(Object.keys(eventData), 7);
        assert.equal(eventData.entrypoint, 'mock entryPoint');
      }
    },

    'call flowEvent with entrypoint and entryPoint': {
      setup: function () {
        write = process.stderr.write;
        process.stderr.write = sinon.spy();
        return flowEvent('wibble', {}, {
          headers: { 'user-agent': 'blee' },
          originalUrl: '/',
          query: {
            entryPoint: 'mock entryPoint', //eslint-disable-line camelcase
            entrypoint: 'mock entrypoint',
            zignore: 'ignore me'
          }
        });
      },

      teardown: function () {
        process.stderr.write = write;
      },

      'process.stderr.write was called correctly': function () {
        assert.equal(process.stderr.write.callCount, 1);

        var eventData = JSON.parse(process.stderr.write.args[0][0]);
        assert.lengthOf(Object.keys(eventData), 7);
        assert.equal(eventData.entrypoint, 'mock entrypoint');
      }
    },

    'call flowEvent with 101-character query parameter': {
      setup: function () {
        write = process.stderr.write;
        process.stderr.write = sinon.spy();
        return flowEvent('wibble', {}, {
          headers: { 'user-agent': 'blee' },
          originalUrl: '/',
          query: {
            context: (new Array(102)).join('0')
          }
        });
      },

      teardown: function () {
        process.stderr.write = write;
      },

      'process.stderr.write was called correctly': function () {
        assert.equal(process.stderr.write.callCount, 1);

        var eventData = JSON.parse(process.stderr.write.args[0][0]);
        assert.lengthOf(eventData.context, 100);
      }
    },

    'call flowEvent with 100-character query parameter': {
      setup: function () {
        write = process.stderr.write;
        process.stderr.write = sinon.spy();
        return flowEvent('wibble', {}, {
          headers: { 'user-agent': 'blee' },
          originalUrl: '/',
          query: {
            entrypoint: (new Array(101)).join('x')
          }
        });
      },

      teardown: function () {
        process.stderr.write = write;
      },

      'process.stderr.write was called correctly': function () {
        assert.equal(process.stderr.write.callCount, 1);

        var eventData = JSON.parse(process.stderr.write.args[0][0]);
        assert.lengthOf(eventData.entrypoint, 100);
      }
    },

    'call flowEvent with 101-character client_id': {
      setup: function () {
        write = process.stderr.write;
        process.stderr.write = sinon.spy();
        return flowEvent('wibble', {}, {
          headers: { 'user-agent': 'blee' },
          originalUrl: '/',
          query: {
            client_id: (new Array(102)).join(' ') //eslint-disable-line camelcase
          }
        });
      },

      teardown: function () {
        process.stderr.write = write;
      },

      'process.stderr.write was called correctly': function () {
        assert.equal(process.stderr.write.callCount, 1);

        var eventData = JSON.parse(process.stderr.write.args[0][0]);
        assert.lengthOf(eventData.service, 100);
      }
    },

    'call flowEvent with 101-character entryPoint': {
      setup: function () {
        write = process.stderr.write;
        process.stderr.write = sinon.spy();
        return flowEvent('wibble', {}, {
          headers: { 'user-agent': 'blee' },
          originalUrl: '/',
          query: {
            entryPoint: (new Array(102)).join(' ') //eslint-disable-line camelcase
          }
        });
      },

      teardown: function () {
        process.stderr.write = write;
      },

      'process.stderr.write was called correctly': function () {
        assert.equal(process.stderr.write.callCount, 1);

        var eventData = JSON.parse(process.stderr.write.args[0][0]);
        assert.lengthOf(eventData.entrypoint, 100);
      }
    },

    'call flowEvent with DNT header': {
      setup: function () {
        write = process.stderr.write;
        process.stderr.write = sinon.spy();
        return flowEvent('mock event', {}, {
          headers: { 'dnt': '1', 'user-agent': 'foo' },
          originalUrl: 'bar',
          query: {
            client_id: 'mock client_id', //eslint-disable-line camelcase
            context: 'mock context',
            entryPoint: 'mock entryPoint',
            entrypoint: 'mock entrypoint',
            migration: 'mock migration',
            service: 'mock service',
            /*eslint-disable camelcase*/
            utm_campaign: 'mock utm_campaign',
            utm_content: 'mock utm_content',
            utm_medium: 'mock utm_medium',
            utm_source: 'mock utm_source',
            utm_term: 'mock utm_term',
            /*eslint-enable camelcase*/
            zignore: 'ignore me'
          }
        });
      },

      teardown: function () {
        process.stderr.write = write;
      },

      'process.stderr.write was called correctly': function () {
        assert.equal(process.stderr.write.callCount, 1);

        var eventData = JSON.parse(process.stderr.write.args[0][0]);
        assert.lengthOf(Object.keys(eventData), 10);
        assert.equal(eventData.op, 'flowEvent');
        assert.equal(eventData.event, 'mock event');
        assert.equal(eventData.userAgent, 'foo');
        assert.equal(eventData.context, 'mock context');
        assert.equal(eventData.entrypoint, 'mock entrypoint');
        assert.equal(eventData.migration, 'mock migration');
        assert.equal(eventData.service, 'mock service');
      }
    },

    'call flowEvent with numeric time': {
      setup: function () {
        time = Date.now();
        write = process.stderr.write;
        process.stderr.write = sinon.spy();
        return flowEvent('wibble', { time: time }, {
          headers: { 'user-agent': 'blee' },
          originalUrl: '/',
          query: {}
        });
      },

      teardown: function () {
        process.stderr.write = write;
      },

      'process.stderr.write was called correctly': function () {
        assert.equal(process.stderr.write.callCount, 1);

        var eventData = JSON.parse(process.stderr.write.args[0][0]);
        assert.lengthOf(Object.keys(eventData), 7);
        assert.equal(eventData.time, new Date(time).toISOString());
      }
    },
  });
});
