"use strict";
let logic = require("../logic");
let databaseOracle = require('oracledb');
let settings = require('../settings');
let sha256 = require('sha256');
let cookies = require('cookies');
let fs = require('fs');
let ejs = require('ejs');

exports.user_delete = function (req, res, path) {
    error_object(req,res,path,501);
};

exports.user_update = function (req, res, path) {
    error_object(req,res,path,501);
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

            info.firstname = info.firstname.charAt(0).toUpperCase() + info.firstname.slice(1).toLowerCase();
            info.lastname = info.lastname.charAt(0).toUpperCase() + info.lastname.slice(1).toLowerCase();

            if (result.rows[0][7] === null)
                info.profile_pic = settings.default_profile_pic;
            else info.profile_pic = result.rows[0][7];

            if (result.rows[0][8] === null)
                info.cover_pic = settings.default_cover_pic;
            else info.cover_pic = result.rows[0][8];

            if (result.rows[0][6] === null)
                info.description = settings.default_description;
            else info.description = result.rows[0][6];


            info.groups_owner = [];
            info.groups_member = [];


            connection.execute('select * from groups where owner_id = :id', [request_user], (err, result) => {
                if (err) {
                    LOG(err.message);
                    message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                    return;
                }

                for (let idx = 0; idx < result.rows.length; idx++) {
                    let g_owner = {};
                    g_owner.id = result.rows[idx][0];
                    g_owner.name = result.rows[idx][1];
                    info.groups_owner.push(g_owner);
                }

                connection.execute('select * from belongs ' +
                    'join groups on belongs.group_id = groups.id ' +
                    'join users on belongs.member_id = users.id where users.id = :id', [request_user], (err, result) => {
                    if (err) {
                        LOG(err.message);
                        message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                        return;
                    }

                    for (let idx = 0; idx < result.rows.length; idx++) {
                        let g_member = {};
                        g_member.id = result.rows[idx][1];
                        g_member.name = result.rows[idx][4];
                        info.groups_member.push(g_member);
                    }

                    fs.readFile(settings.templatesPath + 'profile.html', 'utf8', function (err, data) {
                        res.writeHead(404, {'Content-Type': 'text/html'});
                        data = ejs.render(data, info);
                        res.write(data);
                        res.end();
                    });
                    logic.utils.realeaseConnection(connection);
                });
            });
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
                send_object(req, res, path, {
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

    let message = logic.user.check_register(req);
    if (message !== undefined) {
        LOG("Invalid register data");
        error_object(req, res, path, {
            msg: message,
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

                send_object(req, res, path, {msg: 'Account successfully created.', code: 0});
                logic.utils.realeaseConnection(connection);
            });
        });
    });
};
