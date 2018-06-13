"use strict";
let logic = require("../logic");
let databaseOracle = require('oracledb');
let settings = require('../settings');
let fs = require('fs');
let ejs = require('ejs');
let async = require("async");


exports.cd_delete = function (req, res, path) {
    error_object(req, res, path, 501);
};

exports.cd_update = function (req, res, path) {
    error_object(req, res, path, 501);
};

exports.cd_group_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;

    let request_group_cd = logic.utils.get_id_from_path(path, 1, req, res);
    if (request_group_cd === false) return;

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            logic.utils.realeaseConnection(connection);
            message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com");
            return;
        }


        connection.execute('select * from users join belongs on users.id =belongs.member_id join cds item on item.owner_id=users.id  where belongs.group_id = :id', [request_group_cd], (err, result) => {
            if (err) {
                LOG(err.message);
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            let item_data = {cds: []};

            for (let idx = 0; idx < result.rows.length; idx++) {
                let cd = {};
                cd.page = "/cd/" + result.rows[idx][12];
                cd.title = result.rows[idx][13];
                cd.album_link = logic.spotify.get_album_search_link(result.rows[idx][13]);
                cd.artist = result.rows[idx][14];
                cd.artist_link = logic.spotify.get_artist_search_link(result.rows[idx][14]);
                cd.duration = result.rows[idx][15];
                cd.label = result.rows[idx][16];
                cd.genre = GENRE[result.rows[idx][17]];
                cd.owner_link = "/user/" + result.rows[idx][18];

                item_data.cds.push(cd);
            }

            connection.execute('select * from groups where id = :id', [request_group_cd], (err, result) => {
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

                fs.readFile(settings.templatesPath + 'group_cds.html', 'utf8', function (err, data) {
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

exports.cd_all_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;

    let request_user_cd = undefined;
    if (/^[0-9]+$/.test(path[1]))
        request_user_cd = Number(path[1]);

    if (request_user_cd === undefined) {
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

        connection.execute('select * from cds where owner_id = :id', [request_user_cd], (err, result) => {
            if (err) {
                LOG(err.message);
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            let cds_data = {cds: []};

            for (let idx = 0; idx < result.rows.length; idx++) {
                let cd = {};
                cd.page = "/cd/" + result.rows[idx][0];
                cd.title = result.rows[idx][1];
                cd.album_link = logic.spotify.get_album_search_link(result.rows[idx][1]);
                cd.artist = result.rows[idx][2];
                cd.artist_link = logic.spotify.get_artist_search_link(result.rows[idx][2]);
                cd.duration = result.rows[idx][3];
                cd.label = result.rows[idx][4];
                cd.genre = GENRE[result.rows[idx][5]];
                cd.owner_link = "/user/" + result.rows[idx][6];

                cds_data.cds.push(cd);
            }

            connection.execute('select * from users where id = :id', [request_user_cd], (err, result) => {
                if (err) {
                    LOG(err.message);
                    logic.utils.realeaseConnection(connection);
                    message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                    return;
                }

                if(result.rows.length === 0)
                {
                    logic.utils.realeaseConnection(connection);
                    message_page(req, res, path, "Invalid ID");
                    return;
                }


                cds_data.user = {};


                cds_data.user.picture = result.rows[0][7];
                if (cds_data.user.picture === null)
                    cds_data.user.picture = settings.default_profile_pic;

                cds_data.user.firstname = result.rows[0][1];
                cds_data.user.lastname = result.rows[0][2];


                cds_data.user.description = result.rows[0][6];
                if (cds_data.user.description === null)
                    cds_data.user.description = settings.default_description;


                cds_data.current_user_id = req.user_id;

                DEBUG(JSON.stringify(cds_data));

                fs.readFile(settings.templatesPath + 'cds.html', 'utf8', function (err, data) {
                    res.writeHead(404, {'Content-Type': 'text/html'});
                    data = ejs.render(data, cds_data);
                    res.write(data);
                    res.end();
                });
                logic.utils.realeaseConnection(connection);
            });
        });
    });
};

exports.cd_get = function (req, res, path) {
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;

    let request_cd = undefined;
    if (/^[0-9]+$/.test(path[0]))
        request_cd = Number(path[0]);

    if (request_cd === undefined) {
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

        connection.execute('select * from cds where id = :id', [request_cd], (err, result) => {
            if (err) {
                LOG(err.message);
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            if (result.rows.length === 0) {
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Invalid cd ID");
                return;
            }

            let cd = {};
            cd.page = "/cd/" + result.rows[0][0];
            cd.title = result.rows[0][1];
            cd.album_link = logic.spotify.get_album_search_link(result.rows[0][1]);
            cd.artist = result.rows[0][2];
            cd.artist_link = logic.spotify.get_artist_search_link(result.rows[0][2]);
            cd.duration = result.rows[0][3];
            cd.label = result.rows[0][4];
            cd.genre = GENRE[result.rows[0][5]];
            cd.owner_link = "/user/" + result.rows[0][6];

            cd.current_user_id = req.user_id;
            DEBUG(JSON.stringify(cd));

            fs.readFile(settings.templatesPath + 'cd.html', 'utf8', function (err, data) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                data = ejs.render(data, cd);
                res.write(data);
                res.end();
            });
            logic.utils.realeaseConnection(connection);
        });
    });
};

exports.cd_create = function (req, res, path) {
    if (!logic.utils.check_request_body(req, res, path)) return;
    if (!logic.utils.mustBeLoggedIn(req, res, path)) return;
    if (!logic.cd.check_cd(req, res, path)) return;

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

        connection.execute('select count(*) from cds where title = :name and owner_id = :own_id', {
            "name": req.body.title,
            "own_id": req.user_id,
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
                    msg: 'CD with this title already exists.', code: 4
                });
                return;
            }

            DEBUG(JSON.stringify(req.body));

            req.body.owner_id = req.user_id;
            connection.execute("insert into cds values(NULL,:title,:artist,:duration,:label,:genre_id,:owner_id)", req.body, settings.queryOptions, (err, result) => {
                if (err) {
                    console.log(err);
                    logic.utils.realeaseConnection(connection);
                    error_object(req, res, path, {msg: 'Something went wrong. Try again.', code: 5});
                    return;
                }

                send_object(req, res, path, {msg: 'CD successfully created.', code: 0});
                logic.utils.realeaseConnection(connection);
            });
        });
    });
};

