'use strict';

let settings = require('./server/settings');
let databaseOracle = require('oracledb');
let http = require('http');
let controllers = require('./server/controllers');

require("./server/init")();

global.LOG = function (string) {
    console.log(string);
};

global.DEBUG = function (string) {
    console.log(string);
};

process.on('SIGTERM', () => {
    LOG("\nClosing server...");
    process.exit(0);
});

process.on('SIGINT', () => {
    LOG("\nClosing server...");
    process.exit(0);
});


LOG('Starting server...');
databaseOracle.createPool(settings.databaseInfo, (err) => {
    if (err) {
        LOG("Cannot connect database...\n" + err.message);
        process.exit(2);
    }

    LOG('Connected to database...');
    http.createServer(controllers.requestListener).listen(settings.PORT);
    LOG("Server listening to port " + settings.PORT + "...");
});

