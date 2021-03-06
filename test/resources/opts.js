var path = require('path'),
    url  = require('url');

var apiEndPoint = url.parse(process.env.DATASTORE_EMULATOR_HOST || 'http://localhost:8081');

module.exports = {
  config : {
    namespace : 'test',

    projectId   : process.env.DATASTORE_PROJECT_ID || process.env.DATASTORE_PROJECTID || 'testing',
    apiEndpoint : url.format(apiEndPoint),
    port        : apiEndPoint.port

    // keyFilename : path.join(approot, 'client-secret.json')
  }
};
