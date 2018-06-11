'use strict';

let url = require('url');
let resource = require("./resource");
let staticRes = require("./static");
let user = require("./user");
let error = require("./error");
let logic = require("../logic");
let artist = require('./artist');

let URLMap = {
    '': staticRes.landing,
    'index': staticRes.landing,
    'static': staticRes.requestListener,

    'user': user.requestListener,

    'artist': artist.requestListener,

    'js': resource.resource,
    'css': resource.resource,
    'img': resource.resource,
    'resource': resource.requestListener
};

exports.requestListener = function (request, response) {
    let URL = url.parse(request.url, true);
    let path = URL.pathname.split('/');

    let resolver = URLMap[path[1]];

    path.push('');

    if (resolver === undefined) error_page(request, response, path.slice(1), 404);
    else try {
        logic.utils.JSONparse(request, response, path.slice(1),resolver);
    } catch (err) {
        response.writeHead(500, {'Content-Type': 'text/html'});
        response.write("Something went wrong");
        response.end();
    }

    LOG(request.method + ' ' + URL.pathname);
};


// URL.query
// let urlMapper = {
// '': staticRes.landing,
// 'index': _g.resolvers.resolveLanding,
// 'register': _g.resolvers.resolveRegister,
// 'login': _g.resolvers.resolveLogin,
// 'documentation': _g.resolvers.resolveDocumentation,
// 'profile': _g.resolvers.resolveProfile,
//
// 'css': _g.resolvers.resolveResource,
// 'js': _g.resolvers.resolveResource,
// 'img': _g.resolvers.resolveResource,
//
// 'mucr': _g.mucrc.mucrListener,
// 'api': _g.apic.apiListener
// };