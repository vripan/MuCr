'use strict';
//======================================================================================================================
let _g = require('./global');
//======================================================================================================================

let APIMapper = {
    'register': _g.apiresolver.resolveRegisterAPI,
    'login': _g.apiresolver.resolveLoginAPI,
};

let parseRequestBody = function (res, req, path, query, resolver) {
    let body = [];
    req.on('data', (chunk) => {
        body.push(chunk);
    });

    req.on('end', () => {
        body = Buffer.concat(body).toString();
        body = _g.utils.JSONparse(body);

        if (body === null) {
            _g.apiresolver.JSONsend(res, req, path, query, {
                msg: 'No request body found.',
                code: 5
            });
            return;
        }
        req.body = body;
        resolver(res, req, path, query);
    });
};

exports.apiListener = function (res, req, path, query) {
    if (req.method !== 'GET' && req.method !== 'POST') {
        _g.error.errorResolver(res, req, 404);
        return;
    }

    let resolver = APIMapper[path[1]];
    if (resolver === undefined) _g.error.errorResolver(res, req, 404);
    else parseRequestBody(res, req, path, query, resolver);
};

//======================================================================================================================

