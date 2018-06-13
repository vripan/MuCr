"use strict";
let views = require("../views");
let url = require("url");


let landing = function (req, res, path) {
    switch (req.method) {
        case 'GET':
            views.staticRes.landing_get(req, res, path);
            break;
        default:
            error_page(request, response, path, 405);
            break;
    }
};

let register = function (req, res, path) {
    switch (req.method) {
        case 'GET':
            views.staticRes.register_get(req, res, path);
            break;
        default:
            error_page(request, response, path, 405);
            break;
    }
};

let login = function (req, res, path) {
    switch (req.method) {
        case 'GET':
            views.staticRes.login_get(req, res, path);
            break;
        default:
            error_page(request, response, path, 405);
            break;
    }
};

let documentation = function (req, res, path) {
    switch (req.method) {
        case 'GET':
            views.staticRes.documentation_get(req, res, path);
            break;
        default:
            error_page(request, response, path, 405);
            break;
    }
};

let create = function(req,res,path)
{
    switch (req.method) {
        case 'GET':
            views.staticRes.create_get(req, res, path);
            break;
        default:
            error_page(request, response, path, 405);
            break;
    }
};

let search = function(req,res,path)
{
    switch (req.method) {
        case 'GET':
            views.staticRes.search_get(req, res, path);
            break;
        default:
            error_page(request, response, path, 405);
            break;
    }
};

let URLMap = {
    '': landing,
    'index': landing,
    'register': register,
    'login': login,
    'documentation': documentation,
    'create': create,
    'search':search
};

exports.requestListener = function (request, response, path) {
    if(path[1] === undefined) path.push('');
    let resolver = URLMap[path[1]];
    if (resolver === undefined) error_page(request, response, path.slice(1), 404);
    else resolver(request, response, path.slice(1));
};

exports.landing = landing;



