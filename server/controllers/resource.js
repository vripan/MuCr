"use strict";
let views = require("../views");
let url = require("url");


let resource = function (req, res, path) {
    switch (req.method) {
        case 'GET':
            views.resource.resource_get(req, res, path);
            break;
        default:
            error_page(req,res,path,405);
            break;
    }
};

let favicon = function (req, res, path) {
    res.writeHead(404, {'Content-Type': 'application/json'});
    res.end();
};

let URLMap = {
    'css': resource,
    'js': resource,
    'img': resource,
};

exports.requestListener = function (request, response, path) {
    let resolver = URLMap[path[1]];
    if (resolver === undefined) error_page(request,response,path.slice(1),404);
    else resolver(request, response, path.slice(1));
};

exports.resource = resource;


