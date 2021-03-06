var ERR = require('async-stacktrace');
var _ = require('lodash');
var async = require('async');
var pg = require('pg');

var config = require('../lib/config');
var sqldb = require('../lib/sqldb');
var models = require('../models');
var sprocs = require('../sprocs');
var cron = require('../cron');
var courseDB = require('../lib/course-db');
var syncFromDisk = require('../sync/syncFromDisk');

config.startServer = false;
config.serverPort = 3007;
var server = require('../server');

var logger = require('./dummyLogger');
var helperDb = require('./helperDb');

var courseDir = 'exampleCourse';

module.exports = {
    before: function(callback) {
        var that = this;
        async.series([
            function(callback) {
                // pass "this" explicitly to enable this.timeout() calls
                helperDb.before.call(that, function(err) {
                    if (ERR(err, callback)) return;
                    callback(null);
                });
            },
            function(callback) {
                server.insertDevUser(function(err) {
                    if (ERR(err, callback)) return;
                    callback(null);
                });
            },
            function(callback) {
                syncFromDisk.syncOrCreateDiskToSql(courseDir, logger, function(err) {
                    if (ERR(err, callback)) return;
                    callback(null);
                });
            },
            function(callback) {
                server.startServer(function(err) {
                    if (ERR(err, callback)) return;
                    callback(null);
                });
            },
        ], function(err) {
            if (ERR(err, callback)) return;
            callback(null);
        });
    },

    after: function(callback) {
        async.series([
            function(callback) {
                helperDb.after(function(err) {
                    if (ERR(err, callback)) return;
                    callback(null);
                });
            },
            function(callback) {
                server.stopServer(function(err) {
                    if (ERR(err, callback)) return;
                    callback(null);
                });
            },
        ], function(err) {
            if (ERR(err, callback)) return;
            callback(null);
        });
    },
};
