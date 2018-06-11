"use strict"
let cookies_ = require("cookies");
let databaseOracle = require('oracledb');

let assignCheck = function (value, default_value) {
    if (value === null || value === undefined)
        return default_value;
    return value;
};

let parse = function (obj) {
    let res = null;
    try {
        res = JSON.parse(obj);
    } catch (e) {
        res = null;
    }
    return res;
};

let getLogIn = function (req, res, path, callback) {
    let cookies = cookies_(req, res);
    let session_id = cookies.get("session_id");
    req.user_id = undefined;


    if (session_id === undefined) {
        callback(req, res, path);
        return;
    }

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            callback(req, res, path);
            return;
        }

        connection.execute('select user_id from sessions where token = :token ', [session_id], (err, result) => {
            if (err) {
                LOG(err.message);
                callback(req, res, path);
                return;
            }

            if (result.rows.length === 0) {
                callback(req, res, path);
                return;
            }

            exports.realeaseConnection(connection);
            req.user_id = result.rows[0][0];
            callback(req, res, path);
        });
    });
};

exports.JSONparse = function (req, res, path, callback) {
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    });

    req.on('end', () => {
        body = Buffer.concat(body).toString();
        body = parse(body);

        req.body = body;
        if (body === null) req.body = undefined;

        getLogIn(req, res, path, callback);
    });
};

exports.mustBeLoggedIn = function (req, res, path) {
    return req.user_id !== undefined;

};

exports.checkLength = function (str, min, max) {
    return !(str.length < min || str.length > max);
};

exports.checkEmail = function (email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

exports.isAlfanumeric = function (str) {
    let regx = /^[a-z0-9]+$/;
    return regx.test(str);

};

exports.realeaseConnection = function (connection) {
    connection.close((err) => {
        if (err) console.log("Cannot release connection\n" + err.message);
    });
};

exports.assignCheck = assignCheck;
exports.parse = parse;