"use strict";
let logic = require("../logic");
let databaseOracle = require('oracledb');
let settings = require('../settings');
let fs = require('fs');
let ejs = require('ejs');

exports.ticket_delete = function (req, res, path) {
    error_object(req, res, path, 501);
};

exports.ticket_update = function (req, res, path) {
    error_object(req, res, path, 501);
};

exports.ticket_group_get = function (req, res, path) {
    error_object(req, res, path, 501);

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

exports.ticket_all_get = function (req, res, path) {
    error_object(req, res, path, 501);

    let user_tickets_id = undefined;

    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;
    if(!(user_tickets_id=logic.utils.get_id_from_path(path,1,req,res))) return;


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

exports.ticket_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;

    let request_ticket = undefined;
    if (/^[0-9]+$/.test(path[0]))
        request_ticket = Number(path[0]);

    if (request_ticket === undefined) {
        message_page(req, res, path, "Invalid ticket ID");
        return;
    }

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com");
            return;
        }

        connection.execute('select * from tickets where id = :id', [request_ticket], (err, result) => {
            if (err) {
                LOG(err.message);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            if (result.rows.length === 0) {
                message_page(req, res, path, "Invalid ticket");
                return;
            }

            let ticket = {};
            ticket.page = "/ticket/" + result.rows[0][0];
            ticket.event_name = result.rows[0][1];
            ticket.location = result.rows[0][2];
            ticket.genre = GENRE[result.rows[0][3]];
            ticket.start_date = result.rows[0][4];
            ticket.artist = result.rows[0][5];
            ticket.artist_link = logic.spotify.get_artist_search_link(result.rows[0][5]);
            ticket.price = result.rows[0][6];
            ticket.owner_link = "/user/" + result.rows[0][7];

            let d = new Date(ticket.start_date);
            ticket.start_date = d.toUTCString();

            DEBUG(JSON.stringify(ticket));

            fs.readFile(settings.templatesPath + 'ticket.html', 'utf8', function (err, data) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                data = ejs.render(data, ticket);
                res.write(data);
                res.end();
            });
            logic.utils.realeaseConnection(connection);
        });
    });
};

exports.ticket_create = function (req, res, path) {
    if (!logic.utils.check_request_body(req, res, path)) return;
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;
    if (!logic.ticket.check_ticket(req, res, path)) return;

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            error_object(req, res, path, {
                msg: 'Something went wrong. Try again.',
                code: 2
            });
            return;
        }

        connection.execute('select count(*) from tickets where event_name = :name and owner_id = :own_id', {
            "name": req.body.event_name,
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
                    msg: 'You already own a ticket for this event.', code: 4
                });
                return;
            }

            req.body.owner_id = req.user_id;

            DEBUG(JSON.stringify(req.body));

            connection.execute("insert into tickets values(NULL,:event_name,:location,:genre_id,:start_date,:artist,:price,:owner_id)", req.body, settings.queryOptions, (err, result) => {
                if (err) {
                    console.log(err);
                    error_object(req, res, path, {msg: 'Something went wrong. Try again.', code: 5});
                    return;
                }

                send_object(req, res, path, {msg: 'Ticket successfully created.', code: 0});
                logic.utils.realeaseConnection(connection);
            });
        });
    });
};

