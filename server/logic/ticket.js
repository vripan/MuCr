"use strict";

let utils = require("./utils");
let model = require("../models");

exports.check_ticket = function (req) {
    try {
        if (!model.ticket.isOk(req.body))
            return "Incomplete data";

        if (!(utils.checkLength(req.body.event_name, 3, 20) &&
            utils.checkLength(req.body.owner_type, 3, 20) &&
            utils.checkLength(req.body.group_name, 3, 20)))
            return "Name too short";

        if (!(utils.isAlfanumeric(req.body.event_name) &&
            utils.isAlfanumeric(req.body.owner_type) &&
            utils.isAlfanumeric(req.body.group_name)))
            return "Invalid characters";

        if (req.body.owner_type !== "user" && req.body.owner_type !== "group")
            return "Invalid owner";

        let date = new Date(req.body.start_date);
        if (date.toJSON() === null)
            return "Invalid event date and time";

    } catch (err) {
        return "Something went wrong";
    }
    return undefined;
};