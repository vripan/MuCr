"use strict";

let utils = require("./utils");
let model = require("../models");

let check = function (req) {
    try {
        if (!model.cassette.isOk(req.body))
            return "Incomplete data";

        if (!(utils.checkLength(req.body.artist, 3, 50) &&
            utils.checkLength(req.body.title, 3, 20) &&
            utils.checkLength(req.body.label, 3, 50)))
            return "Too short artist, title or label.";

        if (!(utils.isAlfanumeric(req.body.artist) &&
            utils.isAlfanumeric(req.body.title) &&
            utils.isAlfanumeric(req.body.label)))
            return "Invalid characters in artist or title or label";

        if (req.body.duration < 0)
            return "Invalid cassette duration";

        if(req.body.state !== 0 && req.body.state !== 1)
            return "Invalid cassette state";

        if(req.body.channel !== 0 && req.body.channel !== 1)
            return "Invalid cassette channel";

        if(req.body.type !== 0 && req.body.type !== 1)
            return "Invalid cassette type";

        if (GENRE[req.body.genre_id] === undefined)
            return "Invalid cassette genre";

            } catch (err) {
        return "Something went wrong";
    }
    return undefined;
};

exports.check_cassette = function (req,res,path) {
    let message = check(req);

    if (message !== undefined) {
        LOG("Invalid cassette data");
        error_object(req, res, path, {
            msg: message,
            code: 6
        });
        return false;
    }
    return true;
};