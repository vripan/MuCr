"use strict";
let views = require("../views");
let url = require("url");
let logic = require("../logic");

let album = function (req, res, path) {
    switch (req.method) {
        case 'GET':
            views.album.album_get(req, res, path);
            break;
        default:
            error_page(request, response, path, 405);
            break;
    }
};

let default_album = function (req, res, path) {
    switch (req.method) {
        case 'GET':
            views.album.default_album_get(req, res, path);
            break;
        default:
            error_page(request, response, path, 405);
            break;
    }
};

let URLMap = {
    '^[0-9A-Za-z]+$': album,
    '': default_album
};

exports.requestListener = function (request, response, path) {
    let resolver = URLMap[path[1]];

    if (resolver === undefined)
        for (let key in URLMap) {
            if (URLMap.hasOwnProperty(key)) {
                if (key === '') {
                    break;
                }
                let r = new RegExp(key);
                if (r.test(path[1])) {
                    resolver = URLMap[key];
                    break;
                }
            }
        }

    if (resolver === undefined) error_page(request, response, path.slice(1), 404);
    else resolver(request, response, path.slice(1));
};



