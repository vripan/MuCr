"use strict";

let utils = require("./utils");
let model = require("../models");
let url = require('url');
let databaseOracle = require('oracledb');
let ejs = require('ejs');
let settings = require('../settings');
let fs = require('fs');
let logic = require('../logic');
let spotify = require('./spotify');

let send_ejs = function (res, results) {
    fs.readFile(settings.templatesPath + 'search.html', 'utf8', function (err, data) {
        res.writeHead(200, {'Content-Type': 'text/html'});
        data = ejs.render(data, results);
        res.write(data);
        res.end();
    });
};

let search_user = function (req, res, path, query) {
    let q = "%" + decodeURIComponent(query.query) + "%";
    q = q.toUpperCase();
    let results = {items: [], type: query.type, filters: []};

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            logic.utils.realeaseConnection(connection);
            message_page(req, res, path, "Something went wrong. Try again");
            return;
        }

        connection.execute('select * from users where UPPER(firstname) like :q or UPPER(lastname) like :q', {"q": q}, (err, result) => {
            if (err) {
                LOG(err.message);
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            for (let idx = 0; idx < result.rows.length; idx++) {
                let item = {};
                item.name = result.rows[idx][1] + " " + result.rows[idx][2];
                item.description = "Music Collector user";

                if (result.rows[idx][7] === null)
                    item.picture = settings.default_profile_pic;
                else item.picture = result.rows[idx][7];

                item.link = "/user/" + result.rows[idx][0];

                results.items.push(item);
            }

            send_ejs(res, results);
            logic.utils.realeaseConnection(connection);
        });
    });
};

let search_group = function (req, res, path, query) {
    let q = "%" + decodeURIComponent(query.query) + "%";
    q = q.toUpperCase();
    let results = {items: [], type: query.type, filters: []};

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            logic.utils.realeaseConnection(connection);
            message_page(req, res, path, "Something went wrong. Try again");
            return;
        }

        connection.execute('select * from groups where UPPER(name) like :q', {"q": q}, (err, result) => {
            if (err) {
                LOG(err.message);
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            for (let idx = 0; idx < result.rows.length; idx++) {
                let item = {};
                item.name = result.rows[idx][1];
                item.description = "Music Collector group";

                item.picture = settings.default_group_pic;

                item.link = "/group/" + result.rows[idx][0];

                results.items.push(item);
            }

            send_ejs(res, results);
            logic.utils.realeaseConnection(connection);
        });
    });
};

let search_artist = function (req, res, path, query) {
    let results = {items: [], type: query.type, filters: []};

    spotify.search_artist(query.query, (searchResults) => {

        if(searchResults !== null)
        searchResults.artists.items.forEach((arrItem, index) => {
            let item = {};
            item.name = arrItem.name;
            item.description = "Artist";

            if (arrItem.images.length > 0)
                item.picture = arrItem.images[0].url;
            else
                item.picture = settings.default_artist_pic;

            item.link = "/artist/" + arrItem.id;

            results.items.push(item);
        });

        send_ejs(res, results);
    });
};

let search_album = function (req, res, path, query) {
    let results = {items: [], type: query.type, filters: []};

    spotify.search_album(query.query, (searchResults) => {
        LOG(JSON.stringify(searchResults));

        if(searchResults !== null)
        searchResults.albums.items.forEach((arrItem) => {
            let item = {};
            item.name = arrItem.name;
            item.description = "Album";

            if (arrItem.images.length > 0)
                item.picture = arrItem.images[0].url;
            else
                item.picture = settings.default_album_pic;

            item.link = "/album/" + arrItem.id;

            results.items.push(item);
        });

        send_ejs(res, results);
    });
};

let search_ticket = function (req, res, path, query) {
    let q = "%" + decodeURIComponent(query.query) + "%";
    q = q.toUpperCase();
    let results = {items: [], type: query.type, filters: []};

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            logic.utils.realeaseConnection(connection);
            message_page(req, res, path, "Something went wrong. Try again");
            return;
        }


        connection.execute('select * from tickets where UPPER(event_name) like :q', {"q": q}, (err, result) => {
            if (err) {
                LOG(err.message);
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            for (let idx = 0; idx < result.rows.length; idx++) {
                let item = {};
                item.name = result.rows[idx][1];
                item.description = "Ticket: "+ result.rows[idx][2];

                item.picture = settings.default_ticket_pic;

                item.link = "/ticket/" + result.rows[idx][0];

                results.items.push(item);
            }

            send_ejs(res, results);
            logic.utils.realeaseConnection(connection);
        });
    });
};

let search_vinyl = function (req, res, path, query) {
    let q = "%" + decodeURIComponent(query.query) + "%";
    q = q.toUpperCase();
    let results = {items: [], type: query.type, filters: []};

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            logic.utils.realeaseConnection(connection);
            message_page(req, res, path, "Something went wrong. Try again");
            return;
        }

        let querySQL = 'select * from vinyl where UPPER(title) like :q';
        let obj = {"q": q};

        if(!isNaN(Number(query.rpm))) {
            querySQL += " and RPM = :RPM";
            obj.RPM = query.rpm;
        }

        if(!isNaN(Number(query.weight))) {
            querySQL += " and weight = :weight";
            obj.weight = query.weight;
        }

        if(!isNaN(Number(query.genre))) {
            querySQL += " and genre_id = :genre";
            obj.genre = query.genre;
        }

        if(!isNaN(Number(query.special))) {
            querySQL += " and special = :special";
            obj.special = query.special;
        }

        connection.execute( querySQL,obj, (err, result) => {
            if (err) {
                LOG(err.message);
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            for (let idx = 0; idx < result.rows.length; idx++) {
                let item = {};
                item.name = result.rows[idx][9];
                item.description = "Vinyl MUCR";

                item.picture = settings.default_vinyl_pic;

                item.link = "/vinyl/" + result.rows[idx][0];

                results.items.push(item);
            }

            send_ejs(res, results);
            logic.utils.realeaseConnection(connection);
        });
    });
};

let search_cd = function (req, res, path, query) {
    let q = "%" + decodeURIComponent(query.query) + "%";
    q = q.toUpperCase();
    let results = {items: [], type: query.type, filters: []};

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            logic.utils.realeaseConnection(connection);
            message_page(req, res, path, "Something went wrong. Try again");
            return;
        }

        let querySQL = 'select * from cds where UPPER(title) like :q';
        let obj = {"q": q};

        if(!isNaN(Number(query.genre))) {
            querySQL += " and genre_id = :genre";
            obj.genre = query.genre;
        }


        connection.execute( querySQL,obj, (err, result) => {
            if (err) {
                LOG(err.message);
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            for (let idx = 0; idx < result.rows.length; idx++) {
                let item = {};
                item.name = result.rows[idx][1];
                item.description = "CD MUCR";

                item.picture = settings.default_disk_pic;

                item.link = "/cd/" + result.rows[idx][0];

                results.items.push(item);
            }

            send_ejs(res, results);
            logic.utils.realeaseConnection(connection);
        });
    });
};

let search_cassette = function (req, res, path, query) {
    let q = "%" + decodeURIComponent(query.query) + "%";
    q = q.toUpperCase();
    let results = {items: [], type: query.type, filters: []};

    databaseOracle.getConnection((err, connection) => {
        if (err) {
            LOG(err.message);
            logic.utils.realeaseConnection(connection);
            message_page(req, res, path, "Something went wrong. Try again");
            return;
        }

        let querySQL = 'select * from cassetes where UPPER(title) like :q';
        let obj = {"q": q};

        if(!isNaN(Number(query.genre))) {
            querySQL += " and genre_id = :genre";
            obj.genre = query.genre;
        }

        connection.execute( querySQL,obj, (err, result) => {
            if (err) {
                LOG(err.message);
                logic.utils.realeaseConnection(connection);
                message_page(req, res, path, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
                return;
            }

            for (let idx = 0; idx < result.rows.length; idx++) {
                let item = {};
                item.name = result.rows[idx][1];
                item.description = "Cassette MUCR";

                item.picture = settings.default_cassette_pic;

                item.link = "/cassette/" + result.rows[idx][0];

                results.items.push(item);
            }

            send_ejs(res, results);
            logic.utils.realeaseConnection(connection);
        });
    });
};

let SearchType = {
    "artist": search_artist,
    "album": search_album,
    "user": search_user,
    "group": search_group,
    "ticket": search_ticket,
    "vinyl": search_vinyl,
    "cd": search_cd,
    "cassette": search_cassette
};

exports.search = function (req, res, path) {
    let query = url.parse(req.url, true).query;

    if (query.query === undefined || query.type === undefined) {
        message_page(req, res, path, "Invalid search request");
        return null;
    }

    let search_resolver = SearchType[query.type];
    if (search_resolver === undefined) {
        message_page(req, res, path, "Invalid search type");
        return null;
    }

    search_resolver(req, res, path, query);
};