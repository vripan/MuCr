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
            message_page(req, res, path, "Something went wrong. Try again");
            return;
        }

        connection.execute('select * from users where UPPER(firstname) like :q or UPPER(lastname) like :q', {"q": q}, (err, result) => {
            if (err) {
                LOG(err.message);
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
            message_page(req, res, path, "Something went wrong. Try again");
            return;
        }

        connection.execute('select * from groups where UPPER(name) like :q', {"q": q}, (err, result) => {
            if (err) {
                LOG(err.message);
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

let SearchType = {
    "artist": search_artist,
    "album": search_album,
    "user": search_user,
    "group": search_group,
    // "ticket": search_ticket,
    // "vinyl": search_vinyl,
    // "cd": search_cd,
    // "cassette": search_cassette
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