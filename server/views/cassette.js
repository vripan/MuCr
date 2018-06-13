"use strict";
let logic = require("../logic");
let databaseOracle = require('oracledb');
let settings = require('../settings');
let fs = require('fs');
let ejs = require('ejs');

exports.cassette_delete = function (req, res, path) {
    error_object(req, res, path, 501);
};

exports.cassette_update = function (req, res, path) {
    error_object(req, res, path, 501);
};

exports.cassette_group_get = function (req, res, path) {
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

exports.cassette_all_get = function (req, res, path) {
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

exports.cassette_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;

    let request_cassette = undefined;
    if (/^[0-9]+$/.test(path[0]))
        request_cassette = Number(path[0]);

    if (request_cassette === undefined) {
        message_page(req, res, path, "Invalid ticket ID");
        return;
    }

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com");
            return;
        }

        connection.execute('select * from cassetes where id = :id', [request_cassette], (err, result) => {
            if (err) {
                LOG(err.message);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            if (result.rows.length === 0) {
                message_page(req, res, path, "Invalid cassette ID");
                return;
            }

            let cassette = {};
            cassette.page = "/cd/" + result.rows[0][0];
            cassette.artist = result.rows[0][1];
            cassette.artist_link = logic.spotify.get_artist_search_link(result.rows[0][1]);
            cassette.duration = result.rows[0][2];
            cassette.title = result.rows[0][3];
            cassette.album_link = logic.spotify.get_album_search_link(result.rows[0][3]);
            cassette.state = STATE[result.rows[0][4]];
            cassette.channel = CHANNEL[result.rows[0][5]];
            cassette.type = CASSETTE_TYPE[result.rows[0][6]];
            cassette.label = result.rows[0][7];
            cassette.genre = GENRE[result.rows[0][8]];
            cassette.owner_link = "/user/" + result.rows[0][9];

            DEBUG(JSON.stringify(cassette));

            fs.readFile(settings.templatesPath + 'cassette.html', 'utf8', function (err, data) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                data = ejs.render(data, cassette);
                res.write(data);
                res.end();
            });
            logic.utils.realeaseConnection(connection);
        });
    });
};

exports.cassette_create = function (req, res, path) {
    if (!logic.utils.check_request_body(req, res, path)) return;
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;
    if (!logic.cassette.check_cassette(req, res, path)) return;

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            error_object(req, res, path, {
                msg: 'Something went wrong. Try again.',
                code: 2
            });
            return;
        }

        connection.execute('select count(*) from cassetes where title = :name and owner_id = :own_id', {
            "name": req.body.title,
            "own_id": req.user_id
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
                    msg: 'There is already a cassette with this title.',
                    code: 4
                });
                return;
            }

            req.body.owner_id = req.user_id;

            DEBUG(JSON.stringify(req.body));

            connection.execute("insert into cassetes values(NULL,:artist,:duration,:title,:state,:channel,:type,:label,:genre_id,:owner_id)", req.body, settings.queryOptions, (err, result) => {
                if (err) {
                    console.log(err);
                    error_object(req, res, path, {msg: 'Something went wrong. Try again.', code: 5});
                    return;
                }

                send_object(req, res, path, {msg: 'Cassette successfully created.', code: 0});
                logic.utils.realeaseConnection(connection);
            });
        });
    });
};

