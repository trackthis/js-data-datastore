var path   = require('path'),
    assert = require('assert'),
    fs     = require('fs-extra');

process.env.DEBUG = '1';
var helpers       = require('trackthis-helpers');

// Defining globals
global.approot = path.dirname(__dirname);
global.co      = require('co');
global.Promise = require('bluebird');

var DatastoreAdapter = require('../'),
    DS               = require('js-data').DataStore,
    Mocha            = global.Mocha || require('mocha'),
    Test             = Mocha.Test,
    Suite            = Mocha.Suite,
    mocha            = global.mocha || new Mocha(),
    suite            = Suite.create(mocha.suite, 'Creating entities');

suite.timeout(60000);

// Generate the file list
co(function* () {

  var opts = {
    config : {
      namespace   : 'test',
      keyFilename : path.join(approot, 'client-secret.json')
    }
  };

  // Initialize store
  var store = new DS();
  store.registerAdapter('gdatastore', new DatastoreAdapter(opts), {
    'default' : true
  });

  // Load all schemas
  var schemas = require('./resources/schemas')(store),
      localdb = JSON.parse(JSON.stringify(require('./resources/database')));
  Object.keys(schemas).forEach(function (kind) {
    store.defineMapper(kind, schemas[kind]);
  });

  suite.addTest(new Test('create', function (done) {
    co(function* () {
      var tasks = [];
      while (localdb.table.length > 0) {
        var table = localdb.table.shift();
        tasks.push(store.create('table', table));
      }

      Promise.all(tasks)
             .then(function (result) {
               console.log('resolve', arguments);
               done();
             }, function (err) {
               assert.equal(err, undefined);
               done();
             });
    });
  }));

  mocha.run();
});
