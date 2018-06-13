"use strict";

let utils = require("./utils");
let model = require("../models");

let check = function (req) {
    try {
        if (!model.ticket.isOk(req.body))
            return "Incomplete data";

        if (!(utils.checkLength(req.body.event_name, 3, 20) &&
            utils.checkLength(req.body.location, 3, 20) &&
            utils.checkLength(req.body.artist, 3, 20)))
            return "Name too short";

        if (!(utils.isAlfanumeric(req.body.event_name) &&
            utils.isAlfanumeric(req.body.location) &&
            utils.isAlfanumeric(req.body.artist)))
            return "Invalid characters";

        let date = new Date(req.body.start_date);
        if (date.toJSON() === null)
            return "Invalid event date and time";

        if (req.body.price < 0)
            return "Invalid price";

        if (GENRE[req.body.genre_id] === undefined)
            return "Invalid genre";

    } catch (err) {
        return "Something went wrong";
    }
    return undefined;
};

exports.check_ticket = function (req, res, path) {
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