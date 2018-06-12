"use strict";

let utils = require("./utils");
let model = require("../models");

exports.check_cd = function (req) {
    try {

        if (!model.cd.isOk(req.body))
            return "Incomplete data";
        LOG(JSON.stringify(req.body));


        if (!(utils.checkLength(req.body.artist, 3, 50) &&
            utils.checkLength(req.body.label, 3, 20) &&
            utils.checkLength(req.body.title, 3, 20) &&
            utils.checkLength(req.body.group_name, 3, 20)))
            return "Name too short";

        if (!(utils.isAlfanumeric(req.body.artist) &&
            utils.isAlfanumeric(req.body.label) &&
            utils.isAlfanumeric(req.body.title) &&
            utils.isAlfanumeric(req.body.group_name)))
            return "Invalid characters";

        if (req.body.owner_type !== "user" && req.body.owner_type !== "group")
            return "Invalid owner";

        if(req.body.duration <0)
            return "Invalid cd duration";

    } catch (err) {
        return "Something went wrong";
    }
    return undefined;
};