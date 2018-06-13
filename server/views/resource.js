"use strict";

let fs = require("fs");
let settings = require("../settings");


exports.favicon_get = function(req,res,path){
    error_object(req,res,path,501);
};

exports.resource_get = function (req, res, path) {
    let pathToResource = path.reduce(function (prev, current) {
        return prev + '/' + current;
    }, settings.resourcesPath.slice(0, -1));

    if (fs.existsSync(pathToResource))
        fs.readFile(pathToResource, function (err, data) {
            if (err) {
                error_response(req,res,path,404);
                return;
            }

            let mimeType = MIMEtypes['.' + path.pop().split('.').pop()];
            if(mimeType === undefined) mimeType = MIMEtypes[".html"];
            res.writeHead(200, {'Content-Type': mimeType});
            res.write(data);
            res.end();
        });
    else error_response(req,res,path,404);
};