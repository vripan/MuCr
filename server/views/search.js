"use strict";
let logic = require("../logic");
let databaseOracle = require('oracledb');
let settings = require('../settings');
let fs = require('fs');
let ejs = require('ejs');

exports.search_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;
    logic.search.search(req, res, path);
};