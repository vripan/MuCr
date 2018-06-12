"use strict";

let fs = require("fs");
let settings = require("../settings");


exports.favicon_get = function(req,res,path){
    // let path =
};

exports.resource_get = function (req, res, path) {
    let pathToResource = path.reduce(function (prev, current) {
        return prev + '/' + current;
    }, settings.resourcesPath.slice(0, -1));

    if (fs.existsSync(pathToResource))
        fs.readFile(pathToResource, function (err, data) {
            if (err) {
                error_response(request,response,path,500);
                return;
            }

            path.pop();

            res.writeHead(200, {'Content-Type': MIMEtypes['.' + path.pop().split('.').pop()]});
            res.write(data);
            res.end();
        });
};