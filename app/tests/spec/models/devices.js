/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

define(function (require, exports, module) {
  'use strict';

  var assert = require('chai').assert;
  var Devices = require('models/devices');
  var Notifier = require('lib/channels/notifier');

  describe('models/devices', function () {
    var devices;
    var notifier;

    beforeEach(function () {
      notifier = new Notifier();

      devices = new Devices([], {
        notifier: notifier
      });
    });

    describe('devices model has devices', function () {
      assert.ok(devices);
    });
  });
});

