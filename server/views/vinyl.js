"use strict";
let logic = require("../logic");
let databaseOracle = require('oracledb');
let settings = require('../settings');
let fs = require('fs');
let ejs = require('ejs');

exports.vinyl_delete = function (req, res, path) {
    error_object(req, res, path, 501);
};

exports.vinyl_update = function (req, res, path) {
    error_object(req, res, path, 501);
};

exports.vinyl_group_get = function (req, res, path) {
    //Todo: here
};

exports.vinyl_all_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;

    let request_user_vinyl = logic.utils.get_id_from_path(path, 0, req, res);
    if (request_user_vinyl === false) return;

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com");
            return;
        }

        connection.execute('select * from vinyl where owner_id = :id', [request_user_vinyl], (err, result) => {
            if (err) {
                LOG(err.message);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            let vinyl_data = {vinyls: []};

            for (let idx = 0; idx < result.rows.length; idx++) {
                let vinyl = {};
                vinyl.page = "/vinyl/" + result.rows[idx][0];
                vinyl.rpm = result.rows[idx][1];
                vinyl.state = STATE[result.rows[idx][2]];
                vinyl.color = COLOR[result.rows[idx][3]];
                vinyl.channel = CHANNEL[result.rows[idx][4]];
                vinyl.weight = WEIGHT[result.rows[idx][5]];
                vinyl.special = SPECIAL[result.rows[idx][6]];
                vinyl.condition = result.rows[idx][7];
                vinyl.artist = result.rows[idx][8];
                vinyl.artist_link = logic.spotify.get_artist_search_link(result.rows[idx][8]);
                vinyl.title = result.rows[idx][9];
                vinyl.album_link = logic.spotify.get_album_search_link(result.rows[idx][9]);
                vinyl.label = result.rows[idx][10];
                vinyl.genre = GENRE[result.rows[idx][11]];
                vinyl.owner_link = "/user/" + result.rows[idx][12];

                vinyl_data.vinyls.push(vinyl);
            }

            connection.execute('select * from users where id = :id', [request_user_vinyl], (err, result) => {
                if (err) {
                    LOG(err.message);
                    message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                    return;
                }

                vinyl_data.user = {};

                vinyl_data.user.picture = result.rows[0][7];
                if (vinyl_data.user.picture === null)
                    vinyl_data.user.picture = settings.default_profile_pic;

                vinyl_data.user.firstname = result.rows[0][1];
                vinyl_data.user.lastname = result.rows[0][2];


                vinyl_data.user.description = result.rows[0][6];
                if (vinyl_data.user.description === null)
                    vinyl_data.user.description = settings.default_description;


                vinyl_data.current_user_id = req.user_id;
                DEBUG(JSON.stringify(vinyl_data));

                fs.readFile(settings.templatesPath + 'vinyls.html', 'utf8', function (err, data) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    data = ejs.render(data, vinyl_data);
                    res.write(data);
                    res.end();
                });
                logic.utils.realeaseConnection(connection);
            });
        });
    });
};

exports.vinyl_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;

    let request_vinyl = logic.utils.get_id_from_path(path, 0, req, res);
    if (request_vinyl === false) return;

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com");
            return;
        }

        connection.execute('select * from vinyl where id = :id', [request_vinyl], (err, result) => {
            if (err) {
                LOG(err.message);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            if (result.rows.length === 0) {
                message_page(req, res, path, "Invalid vinyl id");
                return;
            }

            let vinyl = {};

            vinyl.page = "/vinyl/" + result.rows[0][0];
            vinyl.rpm = result.rows[0][1];
            vinyl.state = STATE[result.rows[0][2]];
            vinyl.color = COLOR[result.rows[0][3]];
            vinyl.channel = CHANNEL[result.rows[0][4]];
            vinyl.weight = WEIGHT[result.rows[0][5]];
            vinyl.special = SPECIAL[result.rows[0][6]];
            vinyl.condition = result.rows[0][7];
            vinyl.artist = result.rows[0][8];
            vinyl.artist_link = logic.spotify.get_artist_search_link(result.rows[0][8]);
            vinyl.title = result.rows[0][9];
            vinyl.album_link = logic.spotify.get_album_search_link(result.rows[0][9]);
            vinyl.label = result.rows[0][10];
            vinyl.genre = GENRE[result.rows[0][11]];
            vinyl.owner_link = "/user/" + result.rows[0][12];

            vinyl.current_user_id = req.user_id;
            DEBUG(JSON.stringify(vinyl));

            fs.readFile(settings.templatesPath + 'vinyl.html', 'utf8', function (err, data) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                data = ejs.render(data, vinyl);
                res.write(data);
                res.end();
            });
            logic.utils.realeaseConnection(connection);
        });
    });
};

exports.vinyl_create = function (req, res, path) {
    if (!logic.utils.check_request_body(req, res, path)) return;
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;
    if (!logic.vinyl.check_vinyl(req, res, path)) return;

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            error_object(req, res, path, {
                msg: 'Something went wrong. Try again.',
                code: 2
            });
            return;
        }

        connection.execute('select count(*) from vinyl where title = :name and owner_id = :own_id', {
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
                    msg: 'You already have a vinyl with this title', code: 4
                });
                return;
            }

            req.body.owner_id = req.user_id;

            DEBUG(JSON.stringify(req.body));

            connection.execute("insert into vinyl values(NULL,:rpm,:state,:color,:channel,:weight,:special,:condition,:artist,:title,:label,:genre_id,:owner_id)", req.body, settings.queryOptions, (err, result) => {
                if (err) {
                    console.log(err);
                    error_object(req, res, path, {msg: 'Something went wrong. Try again.', code: 5});
                    return;
                }

                send_object(req, res, path, {msg: 'Vinyl successfully created.', code: 0});
                logic.utils.realeaseConnection(connection);
            });
        });
    });
};

