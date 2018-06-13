"use strict";
let views = require("../views");
let url = require("url");
let logic = require("../logic");

let search_action = function (req, res, path) {
    switch (req.method) {
        case 'GET':
            views.search.search_get(req, res, path);
            break;
        default:
            error_page(request, response, path, 405);
            break;
    }
};


let URLMap = {
    '': search_action,
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



