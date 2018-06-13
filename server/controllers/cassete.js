"use strict";
let views = require("../views");

let cassette_action = function (req, res, path) {
    switch (req.method) {
        case 'DELETE':
            views.cassette.cassette_delete(req, res, path);
            break;
        case 'PATCH':
            views.cassette.cassette_update(req, res, path);
            break;
        case 'GET':
            views.cassette.cassette_get(req, res, path);
            break;
        case 'POST':
            views.cassette.cassette_create(req, res, path);
            break;
        default:
            error_page(request, response, path, 405);
            break;
    }
};

let cassette_all_action = function (req, res, path) {
    switch (req.method) {
        case 'GET':
            views.cassette.cassette_all_get(req, res, path);
            break;
    }
};

let cassette_group_action = function (req, res, path) {
    switch (req.method) {
        case 'GET':
            views.cassette.cassette_group_get(req, res, path);
            break;
    }
};

let URLMap = {
    '^[0-9]+$': cassette_action,
    'all': cassette_all_action,
    'group': cassette_group_action,
    '': cassette_action,
};

exports.requestListener = function (request, response, path) {
    if (path[1] === undefined) path.push('');
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



