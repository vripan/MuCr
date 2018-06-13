"use strict";
let utils = require("./utils");
let model = require("../models");

exports.check = function (req) {
    try {
        if (req.body.name === undefined)
            return "Incomplete data";

        if (!(utils.checkLength(req.body.name, 3, 20)))
            return "Name too short";

        if (!(utils.isAlfanumeric(req.body.name)))
            return "Invalid characters";

        if (!model.group.isOk(req.body))
            return "Incomplete data";

    } catch (err) {
        return "Something went wrong";
    }
    return undefined;
};