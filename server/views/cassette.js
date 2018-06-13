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
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;

    let request_group_cassette = logic.utils.get_id_from_path(path, 1, req, res);
    if (request_group_cassette === false) return;

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            logic.utils.realeaseConnection(connection);
            message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com");
            return;
        }


        connection.execute('select * from users join belongs on users.id =belongs.member_id join cassetes item on item.owner_id=users.id  where belongs.group_id = :id', [request_group_cassette], (err, result) => {
            if (err) {
                LOG(err.message);
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            LOG(result);
            let item_data = {cassettes: []};

            for (let idx = 0; idx < result.rows.length; idx++) {
                let cassette = {};
                cassette.page = "/cassette/" + result.rows[idx][12];
                cassette.artist = result.rows[idx][13];
                cassette.artist_link = logic.spotify.get_artist_search_link(result.rows[idx][13]);
                cassette.duration = result.rows[idx][14];
                cassette.title = result.rows[idx][15];
                cassette.album_link = logic.spotify.get_album_search_link(result.rows[idx][15]);
                cassette.state = STATE[result.rows[idx][16]];
                cassette.channel = CHANNEL[result.rows[idx][17]];
                cassette.type = CASSETTE_TYPE[result.rows[idx][18]];
                cassette.label = result.rows[idx][19];
                cassette.genre = GENRE[result.rows[idx][20]];
                cassette.owner_link = "/user/" + result.rows[idx][21];

                item_data.cassettes.push(cassette);
            }

            connection.execute('select * from groups where id = :id', [request_group_cassette], (err, result) => {
                if (err) {
                    LOG(err.message);
                    logic.utils.realeaseConnection(connection);
                    message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                    return;
                }

                if (result.rows.length === 0) {
                    logic.utils.realeaseConnection(connection);
                    message_page(req, res, path, "Invalid group id");
                    return;
                }

                item_data.group = {};
                item_data.group.id = result.rows[0][0];
                item_data.group.name = result.rows[0][1];
                item_data.group.owner_id = result.rows[0][2];

                DEBUG(JSON.stringify(item_data));

                fs.readFile(settings.templatesPath + 'group_cassettes.html', 'utf8', function (err, data) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    data = ejs.render(data, item_data);
                    res.write(data);
                    res.end();
                });
                logic.utils.realeaseConnection(connection);
            });
        });
    });
};

exports.cassette_all_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;

    let request_user_cassette = undefined;
    if (/^[0-9]+$/.test(path[1]))
        request_user_cassette = Number(path[1]);

    if (request_user_cassette === undefined) {
        message_page(req, res, path, "Invalid user ID");
        return;
    }

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            logic.utils.realeaseConnection(connection);
            message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com");
            return;
        }

        connection.execute('select * from cassetes where owner_id = :id', [request_user_cassette], (err, result) => {
            if (err) {
                LOG(err.message);
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            let cassettes_data = {cassettes: []};

            for (let idx = 0; idx < result.rows.length; idx++) {
                let cassette = {};
                cassette.page = "/cassette/" + result.rows[idx][0];
                cassette.artist = result.rows[idx][1];
                cassette.artist_link = logic.spotify.get_artist_search_link(result.rows[idx][1]);
                cassette.duration = result.rows[idx][2];
                cassette.title = result.rows[idx][3];
                cassette.album_link = logic.spotify.get_album_search_link(result.rows[idx][3]);
                cassette.state = STATE[result.rows[idx][4]];
                cassette.channel = CHANNEL[result.rows[idx][5]];
                cassette.type = CASSETTE_TYPE[result.rows[idx][6]];
                cassette.label = result.rows[idx][7];
                cassette.genre = GENRE[result.rows[idx][8]];
                cassette.owner_link = "/user/" + result.rows[idx][9];

                cassettes_data.cassettes.push(cassette);
            }

            connection.execute('select * from users where id = :id', [request_user_cassette], (err, result) => {
                if (err) {
                    LOG(err.message);
                    logic.utils.realeaseConnection(connection);
                    message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                    return;
                }

                if (result.rows.length === 0) {
                    logic.utils.realeaseConnection(connection);
                    message_page(req, res, path, "Invalid user id");
                    return;
                }


                cassettes_data.user = {};


                cassettes_data.user.picture = result.rows[0][7];
                if (cassettes_data.user.picture === null)
                    cassettes_data.user.picture = settings.default_profile_pic;

                cassettes_data.user.firstname = result.rows[0][1];
                cassettes_data.user.lastname = result.rows[0][2];


                cassettes_data.user.description = result.rows[0][6];
                if (cassettes_data.user.description === null)
                    cassettes_data.user.description = settings.default_description;


                DEBUG(JSON.stringify(cassettes_data));

                fs.readFile(settings.templatesPath + 'cassettes.html', 'utf8', function (err, data) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    data = ejs.render(data, cassettes_data);
                    res.write(data);
                    res.end();
                });
                logic.utils.realeaseConnection(connection);
            });
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
            logic.utils.realeaseConnection(connection);
            message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com");
            return;
        }

        connection.execute('select * from cassetes where id = :id', [request_cassette], (err, result) => {
            if (err) {
                LOG(err.message);
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            if (result.rows.length === 0) {
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Invalid cassette ID");
                return;
            }

            let cassette = {};
            cassette.page = "/cassette/" + result.rows[0][0];
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
            logic.utils.realeaseConnection(connection);
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
                    logic.utils.realeaseConnection(connection);
                    error_object(req, res, path, {msg: 'Something went wrong. Try again.', code: 5});
                    return;
                }

                send_object(req, res, path, {msg: 'Cassette successfully created.', code: 0});
                logic.utils.realeaseConnection(connection);
            });
        });
    });
};

