"use strict";

let utils = require("./utils");
let model = require("../models");

let check = function (req) {
    try {
        if (!model.vinyl.isOk(req.body))
            return "Incomplete data";

        if (!(utils.checkLength(req.body.artist, 3, 20) &&
            utils.checkLength(req.body.title, 3, 20) &&
            utils.checkLength(req.body.label, 3, 20)))
            return "Name too short";

        if (!(utils.isAlfanumeric(req.body.artist) &&
            utils.isAlfanumeric(req.body.title) &&
            utils.isAlfanumeric(req.body.label)))
            return "Invalid characters";

        if (req.body.rpm !== 33 && req.body.rpm !== 45 && req.body.rpm !== 78)
            return "Invalid RPM";

        if (req.body.state < 1 || req.body.state > 10)
            return "Invalid state";

        if (COLOR[req.body.color] === undefined)
            return "Invalid color";

        if (CHANNEL[req.body.channel] === undefined)
            return "Invalid channel";

        if (WEIGHT[req.body.weight] === undefined)
            return "Invalid weight";

        if (SPECIAL[req.body.special] === undefined)
            return "Invalid special option";

        if (GENRE[req.body.genre_id] === undefined)
            return "Invalid genre";

    } catch (err) {
        return "Something went wrong";
    }
    return undefined;
};

exports.check_vinyl = function (req, res, path) {
    let message = check(req);

    if (message !== undefined) {
        LOG("Invalid ticket data");
        error_object(req, res, path, {
            msg: message,
            code: 6
        });
        return false;
    }
    return true;
};