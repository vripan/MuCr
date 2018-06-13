"use strict";
let logic = require("../logic");
let databaseOracle = require('oracledb');
let settings = require('../settings');
let fs = require('fs');
let ejs = require('ejs');

exports.cd_delete = function (req, res, path) {
    error_object(req, res, path, 501);
};

exports.cd_update = function (req, res, path) {
    error_object(req, res, path, 501);
};

exports.cd_group_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) {
        error_page(req, res, path, 401);
        return;
    }


    let request_group_ticket = undefined;
    if (/^[0-9]+$/.test(path[1]))
        request_group_ticket = Number(path[1]);

    if (request_group_ticket === undefined) {
        message_page(req, res, path, "Invalid group ID");
        return;
    }

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com");
            return;
        }

        connection.execute('select * from tickets join genre on tickets.genre_id=genre.id where owner_type = \'group\' and owner_id = :id', [request_group_ticket], (err, result) => {
            if (err) {
                LOG(err.message);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }


            let info = {tickets: []};

            for (let idx = 0; idx < result.rows.length; idx++) {
                let ticket = {};

                ticket.page = "/ticket/" + result.rows[idx][0];
                ticket.event_name = result.rows[idx][1];
                ticket.genre = result.rows[idx][7];
                ticket.start_date = result.rows[idx][3];
                ticket.owner_id = result.rows[idx][4];
                ticket.owner_type = result.rows[idx][5];
                ticket.owner_link = "/" + ticket.owner_type + "/" + ticket.owner_id;

                delete ticket.owner_type;
                delete ticket.owner_id;

                let d = new Date(ticket.start_date);
                ticket.start_date = d.toUTCString();

                info.tickets.push(ticket);
            }


            LOG(JSON.stringify(info));

            fs.readFile(settings.templatesPath + 'tickets.html', 'utf8', function (err, data) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                data = ejs.render(data, info);
                res.write(data);
                res.end();
            });
            logic.utils.realeaseConnection(connection);
        });
    });
};

exports.cd_all_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) {
        error_page(req, res, path, 401);
        return;
    }

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com");
            return;
        }

        connection.execute('select * from tickets join genre on tickets.genre_id=genre.id where owner_type = \'user\' and owner_id = :id', [req.user_id], (err, result) => {
            if (err) {
                LOG(err.message);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }


            let info = {tickets: []};

            for (let idx = 0; idx < result.rows.length; idx++) {
                let ticket = {};

                ticket.page = "/ticket/" + result.rows[idx][0];
                ticket.event_name = result.rows[idx][1];
                ticket.genre = result.rows[idx][7];
                ticket.start_date = result.rows[idx][3];
                ticket.owner_id = result.rows[idx][4];
                ticket.owner_type = result.rows[idx][5];
                ticket.owner_link = "/" + ticket.owner_type + "/" + ticket.owner_id;

                delete ticket.owner_type;
                delete ticket.owner_id;

                let d = new Date(ticket.start_date);
                ticket.start_date = d.toUTCString();

                info.tickets.push(ticket);
            }


            LOG(JSON.stringify(info));

            fs.readFile(settings.templatesPath + 'tickets.html', 'utf8', function (err, data) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                data = ejs.render(data, info);
                res.write(data);
                res.end();
            });
            logic.utils.realeaseConnection(connection);

        });
    });
};

exports.cd_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) {
        error_page(req, res, path, 401);
        return;
    }

    let request_cd = undefined;
    if (/^[0-9]+$/.test(path[0]))
        request_cd = Number(path[0]);

    if (request_cd === undefined) {
        message_page(req, res, path, "Invalid cd ID");
        return;
    }

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com");
            return;
        }

        connection.execute('select * from cds join genre on cds.genre_id=genre.id where id = :id', [request_cd], (err, result) => {
            if (err) {
                LOG(err.message);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            if (result.rows.length === 0) {
                message_page(req, res, path, "Invalid cd");
                return;
            }

            let info = {};
            info.page = "/cd/" + result.rows[0][0];
            info.title = result.rows[0][1];
            info.artist_id = result.rows[0][2];
            info.duration = result.rows[0][3];
            info.label = result.rows[0][4];
            info.genre = result.rows[0][9];
            info.owner_id = result.rows[0][6];
            info.owner_type = result.rows[0][7];


            info.owner_link = "/" + info.owner_type + "/" + info.owner_id;

            delete info.owner_type;
            delete info.owner_id;

            LOG(JSON.stringify(info));

            fs.readFile(settings.templatesPath + 'cd.html', 'utf8', function (err, data) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                data = ejs.render(data, info);
                res.write(data);
                res.end();
            });
            logic.utils.realeaseConnection(connection);
        });
    });
};

exports.cd_create = function (req, res, path) {
    if (req.body === undefined) {
        LOG("Unable to parse JSON");
        error_object(req, res, path, {
            msg: 'Something went wrong. Try again.',
            code: 1
        });
        return;
    }

    if (!logic.utils.mustBeLoggedIn(req, res, path)) {
        error_page(req, res, path, 401);
        return;
    }

    let message = logic.cd.check_cd(req);
    if (message !== undefined) {
        LOG("Invalid cd data");
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

        logic.collection.checkIfGroup(req, res, path, connection, () => {
            if (req.body.owner_type === "group")
                req.body.owner_id = req.group_id;
            else
                req.body.owner_id = req.user_id;

            delete req.body.group_name;

            connection.execute('select count(*) from cds where title = :name and owner_id = :own_id and owner_type = :type', {
                "name": req.body.title,
                "own_id": req.body.owner_id,
                "type": req.body.owner_type
            }, (err, result) => {
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
                        msg: 'CD with this title already exists.', code: 4
                    });
                    return;
                }

                connection.execute('select count(*) from genre where id = :genre_id', [req.body.genre_id], (err, result) => {
                    if (err) {
                        LOG(err);
                        error_object(req, res, path, {
                            msg: 'Something went wrong. Try again.',
                            code: 3
                        });
                        return;
                    }

                    if (result.rows[0][0] === 0) {
                        error_object(req, res, path, {
                            msg: 'Invalid genre_id.', code: 4
                        });
                        return;
                    }

                    if (req.body.owner_type === "user")
                        req.body.owner_id = req.user_id;

                    LOG(JSON.stringify(req.body));

                    connection.execute("insert into cds values(NULL,:title,:artist,:duration,:label,:genre_id,:owner_id,:owner_type)", req.body, settings.queryOptions, (err, result) => {
                        if (err) {
                            console.log(err);
                            error_object(req, res, path, {msg: 'Something went wrong. Try again.', code: 5});
                            return;
                        }

                        send_object(req, res, path, {msg: 'Cd successfully created.', code: 0});
                        logic.utils.realeaseConnection(connection);
                    });

                });
            });
        });
    });
};

