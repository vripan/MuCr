"use strict";
let settings = require('../settings');
let ajax = require('./ajax');
let utils = require('./utils');

let secret = 'Basic OGFmMjFiY2FkMDMyNDc1NzhiZGVmMmUzN2I5Nzc0Mzg6MTQ3MTViZDIwNmYxNDU2NGE3YWE0MTU3MGEwMzk3ZjA=';

exports.get_access_token = function () {
    ajax.post_form('https://accounts.spotify.com/api/token', {'Authorization': secret}, {'grant_type': 'client_credentials'}, (err, response, body) => {
        let obj_body = utils.parse(body);
        if (obj_body === null)
            global.spotify_access_token = "";
        else global.spotify_access_token = obj_body["access_token"];

        LOG("New acces token: " + global.spotify_access_token);
    });
};

exports.get_artist = function (artist_id, callback) {
    ajax.get(settings.spotify_base_url + "artists/" + artist_id, {'Authorization': 'Bearer ' + spotify_access_token}, (err, response, body) => {
        let artist_info = null;

        if (response.statusCode !== 200) {
            LOG("Invalid id: " + artist_id);
            let err = utils.parse(body);
            if (err != null && err.error !== undefined)
                LOG("Err: " + err.error.message);
            callback(artist_info);
            return;
        }

        artist_info = utils.parse(body);
        callback(artist_info);
    });
};

exports.get_albums_by_artist = function (artist_id, callback) {
    ajax.get(settings.spotify_base_url + "artists/" + artist_id + "/albums?limit=50&market=RO", {'Authorization': 'Bearer ' + spotify_access_token}, (err, response, body) => {
        let albums_info = null;

        if (response.statusCode !== 200) {
            LOG("Invalid id: " + artist_id);
            let err = utils.parse(body);
            if (err != null && err.error !== undefined)
                LOG("Err: " + err.error.message);
            callback(albums_info);
            return;
        }

        albums_info = utils.parse(body);
        callback(albums_info);
    });
};

exports.get_album = function (album_id, callback) {
    ajax.get(settings.spotify_base_url + "albums/" + album_id, {'Authorization': 'Bearer ' + spotify_access_token}, (err, response, body) => {
        let album_info = null;

        if (response.statusCode !== 200) {
            LOG("Invalid id: " + album_id);
            let err = utils.parse(body);
            if (err != null && err.error !== undefined)
                LOG("Err: " + err.error.message);
            callback(album_info);
            return;
        }

        album_info = utils.parse(body);
        callback(album_info);
    });
};

exports.get_tracks_by_album = function (album_id, callback) {
    ajax.get(settings.spotify_base_url + "albums/" + album_id + "/tracks?limit=50", {'Authorization': 'Bearer ' + spotify_access_token}, (err, response, body) => {
        let tracks_info = null;

        if (response.statusCode !== 200) {
            LOG("Invalid id: " + album_id);
            let err = utils.parse(body);
            if (err != null && err.error !== undefined)
                LOG("Err: " + err.error.message);
            callback(tracks_info);
            return;
        }

        tracks_info = utils.parse(body);
        callback(tracks_info);
    });
};

exports.get_artist_search_link = function (artist_name) {
    return "/search?type=artist&query=" + encodeURIComponent(artist_name);
};

exports.get_album_search_link = function (album_name) {
    return "/search?type=album&query=" + encodeURIComponent(album_name);
};