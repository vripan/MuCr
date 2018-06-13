"use strict";
let utils = require("./utils");
let model = require("../models");

exports.check_register = function (req) {
    try {
        if (req.body.email === undefined || req.body.firstname === undefined || req.body.lastname === undefined || req.body.password === undefined)
            return "Incomplete data";

        if (!(utils.checkLength(req.body.email, 3, 20) && utils.checkLength(req.body.firstname, 3, 20) && utils.checkLength(req.body.lastname, 3, 20) && utils.checkLength(req.body.password, 3, 20)))
            return "Incomplete length";

        if (!(utils.checkEmail(req.body.email) && utils.isAlfanumeric(req.body.firstname) && utils.isAlfanumeric(req.body.lastname) && utils.isAlfanumeric(req.body.password)))
            return "Invalid data email or things";

        if (!model.register.isOk(req.body))
            return "Incomplete data";

    } catch (err) {
        return "Something went wrong";
    }
    return undefined;
};

exports.check_login = function (req) {
    //Todo: here
    return true;
};