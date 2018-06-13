"use strict";

let utils = require("./utils");
let model = require("../models");

let check = function (req) {
    try {
        if (!model.cd.isOk(req.body))
            return "Incomplete data";

        if (!(utils.checkLength(req.body.title, 3, 50) &&
            utils.checkLength(req.body.artist, 3, 20) &&
            utils.checkLength(req.body.label, 3, 50)))
            return "Title or artist name or label too short";

        if (!(utils.isAlfanumeric(req.body.title) &&
            utils.isAlfanumeric(req.body.artist) &&
            utils.isAlfanumeric(req.body.label)))
            return "Invalid characters in title, artist or label";

        if (req.body.duration < 0)
            return "Invalid duration";

        if (GENRE[req.body.genre_id] === undefined)
            return "Invalid genre";

    } catch (err) {
        return "Something went wrong";
    }
    return undefined;
};

exports.check_cd = function (req, res, path) {
    let message = check(req);

    if (message !== undefined) {
        LOG("Invalid CD data");
        error_object(req, res, path, {
            msg: message,
            code: 6
        });
        return false;
    }
    return true;
};