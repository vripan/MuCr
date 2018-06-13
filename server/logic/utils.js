"use strict";
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
    if (req.user_id === undefined) {
        LOG("Not logged in");
        error_page(req, res, path, 401);
        return false;
    }
    return true;
};

exports.checkLength = function (str, min, max) {
    return !(str.length < min || str.length > max);
};

exports.checkEmail = function (email) {
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
};

exports.isAlfanumeric = function (str) {
    let regx = /^[a-zA-Z0-9 ]+$/;
    return regx.test(str);

};

exports.realeaseConnection = function (connection) {
    connection.close((err) => {
        if (err) console.log("Cannot release connection\n" + err.message);
    });
};

global.send_object = function (req, res, path, object) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(object));
    res.end();
};

exports.assignCheck = assignCheck;
exports.parse = parse;

exports.check_request_body = function (req, res, path) {
    if (req.body === undefined) {
        LOG("Unable to parse JSON");
        error_object(req, res, path, {
            msg: 'Something went wrong. Try again.',
            code: 1
        });
        return false;
    }
    return true;
};

exports.get_id_from_path= function (path, idx, req, res) {
    let id = undefined;
    if (/^[0-9]+$/.test(path[idx]))
        id = Number(path[idx]);

    if (id === undefined) {
        message_page(req, res, path, "Invalid ID");
        return false;
    }
    return true;
};