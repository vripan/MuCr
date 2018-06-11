"use strict";
let settings = require('../settings');
let request = require('request');

exports.get = function (url, headers, callback) {
    headers['User-Agent'] = settings.user_agent;

    let request_options = {
        url: url,
        method: 'GET',
        headers: headers
    };

    request(request_options, callback);
};

exports.post_form = function (url, headers, obj, callback) {
    headers['User-Agent'] = settings.user_agent;
    headers['Content-Type'] = 'application/x-www-form-urlencoded';

    let request_options = {
        url: url,
        method: 'POST',
        headers: headers,
        form: obj
    };

    request.post(request_options,callback);
};