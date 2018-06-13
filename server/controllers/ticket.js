"use strict";
let views = require("../views");

let ticket_action = function (req, res, path) {
    switch (req.method) {
        case 'DELETE':
            views.ticket.ticket_delete(req, res, path);
            break;
        case 'PATCH':
            views.ticket.ticket_update(req, res, path);
            break;
        case 'GET':
            views.ticket.ticket_get(req, res, path);
            break;
        case 'POST':
            views.ticket.ticket_create(req, res, path);
            break;
        default:
            error_page(request, response, path, 405);
            break;
    }
};

let ticket_all_action = function (req, res, path) {
    switch (req.method) {
        case 'GET':
            views.ticket.ticket_all_get(req, res, path);
            break;
    }
};

let ticket_group_action = function (req, res, path) {
    switch (req.method) {
        case 'GET':
            views.ticket.ticket_group_get(req, res, path);
            break;
    }
};

let URLMap = {
    '^[0-9]+$': ticket_action,
    'all': ticket_all_action,
    'group': ticket_group_action,
    '': ticket_action,
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



