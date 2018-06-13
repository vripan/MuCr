"use strict";
let views = require("../views");
let url = require("url");
let logic = require("../logic");

let user_action = function (req, res, path) {
    switch (req.method) {
        case 'DELETE':
            views.user.user_delete(req, res, path);
            break;
        case 'PATCH':
            views.user.user_update(req, res, path);
            break;
        case 'GET':
            views.user.user_get(req, res, path);
            break;
        case 'POST':
            views.user.login_post(req, res, path);
            break;
        case 'PUT':
            views.user.register_put(req, res, path);
            break;
        default:
            error_page(request, response, path, 405);
            break;
    }
};


let URLMap = {
    '^[0-9]+$': user_action,
    '': user_action,
};

exports.requestListener = function (request, response, path) {
    if(path[1] === undefined) path.push('');
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



