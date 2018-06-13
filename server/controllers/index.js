'use strict';

let url = require('url');
let resource = require("./resource");
let staticRes = require("./static");
let user = require("./user");
let logic = require("../logic");
let error = require("./error");
let artist = require('./artist');
let album = require('./album');
let group = require('./group');
let ticket = require('./ticket');
let cd = require('./cd');
let cassette = require('./cassete');
let vinyl = require('./vinyl');

let URLMap = {
    '': staticRes.landing,
    'index': staticRes.landing,
    'static': staticRes.requestListener,

    'user': user.requestListener,
    'group': group.requestListener,

    'album': album.requestListener,
    'artist': artist.requestListener,

    'cd': cd.requestListener,
    'cassette': cassette.requestListener,
    'ticket': ticket.requestListener,
    'vinyl':vinyl.requestListener,

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