'use strict';

let url = require('url');
let resource = require("./resource");
let staticRes = require("./static");
let user = require("./user");
let error = require("./error");
let logic = require("../logic");
let artist = require('./artist');
let album = require('./album');
let group = require('./group');

let URLMap = {
    '': staticRes.landing,
    'index': staticRes.landing,
    'static': staticRes.requestListener,

    'user': user.requestListener,

    'album': album.requestListener,
    'artist': artist.requestListener,
    'group':group.requestListener,

    'js': resource.resource,
    'css': resource.resource,
    'img': resource.resource,
    'favicon.ico': resource.favicon,
    'resource': resource.requestListener
};

exports.requestListener = function (request, response) {
    let URL = url.parse(request.url, true);
    let path = URL.pathname.split('/');

    let resolver = URLMap[path[1]];

    path.push('');

    if (resolver === undefined) error_page(request, response, path.slice(1), 404);
    else try {
        logic.utils.JSONparse(request, response, path.slice(1), resolver);
    } catch (err) {
        response.writeHead(500, {'Content-Type': 'text/html'});
        response.write("Something went wrong");
        response.end();
    }

    LOG(request.method + ' ' + URL.pathname);
};