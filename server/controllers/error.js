"use strict";
let views           = require("../views");
let url             = require("url");
let fs              = require("fs");
let settings        = require("../settings");
let ejs             = require("ejs");

global.error_page = function (req, res, path, code) {
    fs.readFile(settings.templatesPath + 'error.html','utf-8', function (err, data) {
        if (err) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write("Something went wrong");
            res.end();
            return;
        }

        let message = ErrorMessages[code];
        if (message === undefined) {
            code = 400;
            message = ErrorMessages[code];
        }

        data = ejs.render(data, {code: code, message: message});
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
};

global.error_response = function(req,res,path,code){
    //Todo: here
};

global.error_object = function(req,res,path,object){
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.write(JSON.stringify(object));
    res.end();
};

global.message_page = function(req,res,path,msg){
    fs.readFile(settings.templatesPath + 'message.html','utf-8', function (err, data) {
        if (err) {
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write("Something went wrong");
            res.end();
            return;
        }

        data = ejs.render(data, {message: msg});
        res.writeHead(200, {'Content-Type': 'text/html'});
        res.write(data);
        res.end();
    });
};



