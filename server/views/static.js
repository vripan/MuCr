"use strict";

let fs              = require("fs");
let settings        = require("../settings");
let logic           = require("../logic");

exports.landing_get = function (req,res,path) {
    fs.readFile(settings.templatesPath + 'index.html', function (err, data) {
        if (err) {
            LOG(err.message);
            error_page(request,response,path,500);
            return;
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
};

exports.create_group_get = function (req,res,path) {
    fs.readFile(settings.templatesPath + 'create-group.html', function (err, data) {
        if (err) {
            LOG(err.message);
            error_page(request,response,path,500);
            return;
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
};

exports.register_get = function (req,res,path) {
    fs.readFile(settings.templatesPath + 'register.html', function (err, data) {
        if (err) {
            LOG(err.message);
            error_page(request,response,path,500);
            return;
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
};

exports.login_get = function (req,res,path) {
    fs.readFile(settings.templatesPath + 'login.html', function (err, data) {
        if (err) {
            LOG(err.message);
            error_page(request,response,path,500);
            return;
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
};

exports.documentation_get = function (req,res,path) {
    fs.readFile(settings.templatesPath + 'documentation.html', function (err, data) {
        if (err) {
            LOG(err.message);
            error_page(request,response,path,500);
            return;
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
};

exports.create_get = function (req,res,path) {
    // if (!logic.utils.mustBeLoggedIn(req, res, path)) return;

    fs.readFile(settings.templatesPath + 'add-item.html', function (err, data) {
        if (err) {
            LOG(err.message);
            error_page(request,response,path,500);
            return;
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
};

exports.search_get = function (req,res,path) {
    // if (!logic.utils.mustBeLoggedIn(req, res, path)) return;

    fs.readFile(settings.templatesPath + 'search.html', function (err, data) {
        if (err) {
            LOG(err.message);
            error_page(request,response,path,500);
            return;
        }

        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
};