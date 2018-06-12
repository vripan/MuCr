"use strict";
let logic = require("../logic");
let databaseOracle = require('oracledb');
let settings = require('../settings');
let sha256 = require('sha256');
let cookies = require('cookies');
let fs = require('fs');
let ejs = require('ejs');

//Todo: find a way to check if token is unique without repeated queries to server
//Todo: distinct error codes;
//Todo: specific error messages;
//Todo: add function to send normal object

exports.user_delete = function (req, res, path) {
    //Todo:here
    //Todo:Implement later, trebuie sters si din alte tabele
};

exports.user_update = function (req, res, path) {
    //Todo:here
    //Todo:verificare pentru undefined, se trimit doar campurile care vor fi modificate, celelate undefined, un switch pe un statement SQL
};

exports.user_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) {
        error_page(req, res, path, 401);
        return;
    }


    let request_user = req.user_id;
    if (/^[0-9]+$/.test(path[0]))
        request_user = Number(path[0]);

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com");
            return;
        }

        connection.execute('select * from users where id = :id', [request_user], (err, result) => {
            if (err) {
                LOG(err.message);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            if (result.rows.length === 0) {
                message_page(req, res, path, "Invalid user");
                return;
            }

            let info = {};
            info.firstname = result.rows[0][1];
            info.lastname = result.rows[0][2];

            if (result.rows[0][7] === null)
                info.profile_pic = settings.default_profile_pic;
            else info.profile_pic = result.rows[0][7];

            if (result.rows[0][8] === null)
                info.cover_pic = settings.default_cover_pic;
            else info.cover_pic = result.rows[0][8];

            if (result.rows[0][6] === null)
                info.description = settings.default_description;
            else info.description = result.rows[0][6];

            fs.readFile(settings.templatesPath + 'profile.html', 'utf8', function (err, data) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                data = ejs.render(data, info);
                res.write(data);
                res.end();
            });
            logic.utils.realeaseConnection(connection);
        });
    });
};

exports.login_post = function (req, res, path) {
    if (req.body === undefined) {
        LOG("Unable to parse JSON");
        error_object(req, res, path, {
            msg: 'Something went wrong. Try again.',
            code: 1
        });
        return;
    }

    if (!logic.user.check_login(req)) {
        LOG("Invalid register data");
        error_object(req, res, path, {
            msg: 'Invalid data',
            code: 6
        });
        return;
    }
    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            error_object(req, res, path, {
                msg: 'Something went wrong. Try again.',
                code: 6
            });
            return;
        }
        delete req.body.remember;
        connection.execute('select id from users where email = :email and password = :password', req.body, (err, result) => {
            if (err) {
                LOG(err);
                error_object(req, res, path, {
                    msg: 'Something went wrong. Try again.',
                    code: 3
                });
                return;
            }

            if (result.rows.length === 0) {
                error_object(req, res, path, {
                    msg: 'Email or password incorrect.', code: 4
                });
                return;
            }

            let sessionToken = sha256(req.body.email + req.body.password + result.rows[0][0] + Date.now());
            let cookiess = new cookies(req, res);

            connection.execute("insert into sessions values(NULL,:id,:token)", {
                id: result.rows[0][0],
                token: sessionToken
            }, settings.queryOptions, (err, result) => {
                if (err) {
                    LOG(err.message);
                    error_object(req, res, path, {msg: 'Something went wrong. Try again.', code: 5});
                    return;
                }

                cookiess.set("session_id", sessionToken);
                error_object(req, res, path, {
                    msg: 'Your are logged in.',
                    session_id: sessionToken,
                    code: 0
                });
                logic.utils.realeaseConnection(connection);
            });
        });
    });
};

exports.register_put = function (req, res, path) {
    if (req.body === undefined) {
        LOG("Unable to parse JSON");
        error_object(req, res, path, {
            msg: 'Something went wrong. Try again.',
            code: 1
        });
        return;
    }

    if (!logic.user.check_register(req)) {
        LOG("Invalid register data");
        error_object(req, res, path, {
            msg: 'Invalid data',
            code: 6
        });
        return;
    }

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            error_object(req, res, path, {
                msg: 'Something went wrong. Try again.',
                code: 2
            });
            return;
        }

        connection.execute('select count(*) from users where email = :email', [req.body.email], (err, result) => {
            if (err) {
                LOG(err);
                error_object(req, res, path, {
                    msg: 'Something went wrong. Try again.',
                    code: 3
                });
                return;
            }

            if (result.rows[0][0] !== 0) {
                error_object(req, res, path, {
                    msg: 'Email already exists.', code: 4
                });
                return;
            }

            connection.execute("insert into users values(NULL,:firstname,:lastname,:email,:password,1,'','','')", req.body, settings.queryOptions, (err, result) => {
                if (err) {
                    console.log(err);
                    error_object(req, res, path, {msg: 'Something went wrong. Try again.', code: 5});
                    return;
                }

                error_object(req, res, path, {msg: 'Account successfully created.', code: 0});
                logic.utils.realeaseConnection(connection);
            });
        });
    });
};
