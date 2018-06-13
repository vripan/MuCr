"use strict";
let logic = require("../logic");
let databaseOracle = require('oracledb');
let settings = require('../settings');
let fs = require('fs');
let ejs = require('ejs');

exports.group_delete = function (req, res, path) {
    error_object(req, res, path, 501);
};
exports.group_update = function (req, res, path) {
    error_object(req, res, path, 501);
};
exports.group_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;

    let request_group = logic.utils.get_id_from_path(path, 0, req, res);
    if (request_group === false) return;

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            logic.utils.realeaseConnection(connection);
            message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com");
            return;
        }

        connection.execute('select * from groups where id = :id', [request_group], (err, result) => {
            if (err) {
                LOG(err.message);
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            if (result.rows.length === 0) {
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Invalid group");
                return;
            }

            let info = {};
            info.isMember = 0;
            info.isOwner = 0;

            info.group_id = result.rows[0][0];
            info.name = result.rows[0][1];
            info.owner = {};
            info.owner.id = result.rows[0][2];

            if(info.owner.id === req.user_id)
                info.isOwner =1;


            connection.execute('select * from users where id = :id', [info.owner.id], (err, result) => {
                if (err) {
                    LOG(err.message);
                    logic.utils.realeaseConnection(connection);
                    message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                    return;
                }

                info.owner.firstname = result.rows[0][1];
                info.owner.lastname = result.rows[0][2];

                if (result.rows[0][7] === null)
                    info.owner.profile_pic = settings.default_profile_pic;
                else info.owner.profile_pic = result.rows[0][7];
                info.members = [];

                connection.execute('select * from belongs join users on belongs.member_id = users.id where group_id = :id', [request_group], (err, result) => {
                    if (err) {
                        LOG(err.message);
                        logic.utils.realeaseConnection(connection);
                        message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                        return;
                    }

                    for (let idx = 0; idx < result.rows.length; idx++) {
                        let member = {};

                        member.id = result.rows[idx][3];
                        member.firstname = result.rows[idx][4];
                        member.lastname = result.rows[idx][5];

                        if(member.id === req.user_id)
                            info.isMember = 1;

                        if (result.rows[idx][10] === null)
                            member.profile_pic = settings.default_profile_pic;
                        else member.profile_pic = result.rows[idx][10];
                        info.members.push(member);
                    }

                    info.current_user_id = req.user_id;


                    fs.readFile(settings.templatesPath + 'group.html', 'utf8', function (err, data) {
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

exports.group_create = function (req, res, path) {
    if (!logic.utils.check_request_body(req, res, path)) return;
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;
    if (!logic.group.check_group(req, res, path)) return;

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            logic.utils.realeaseConnection(connection);
            error_object(req, res, path, {
                msg: 'Something went wrong. Try again.',
                code: 2
            });
            return;
        }

        connection.execute('select count(*) from groups where name = :name', [req.body.name], (err, result) => {
            if (err) {
                LOG(err);
                logic.utils.realeaseConnection(connection);
                error_object(req, res, path, {
                    msg: 'Something went wrong. Try again.',
                    code: 3
                });
                return;
            }

            if (result.rows[0][0] !== 0) {
                logic.utils.realeaseConnection(connection);
                error_object(req, res, path, {
                    msg: 'Choose another group name.', code: 4
                });
                return;
            }

            req.body.owner_id = req.user_id;
            connection.execute("insert into groups values(NULL,:name,:owner_id)", req.body, settings.queryOptions, (err, result) => {
                if (err) {
                    DEBUG(err);
                    logic.utils.realeaseConnection(connection);
                    error_object(req, res, path, {msg: 'Something went wrong. Try again.', code: 5});
                    return;
                }

                send_object(req, res, path, {msg: 'Group successfully created.', code: 0});
                logic.utils.realeaseConnection(connection);
            });
        });
    });
};