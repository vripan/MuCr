"use strict";
let utils = require("./utils");
let model = require("../models");

let check_register_data = function (req) {
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

exports.check_register = function (req, res, path) {
    let message = check_register_data(req);

    if (message !== undefined) {
        LOG("Invalid user data");
        error_object(req, res, path, {
            msg: message,
            code: 6
        });
        return false;
    }
    return true;
};

let check_login_data = function (req) {
    try {
        if (!model.login.isOk(req.body))
            return "Wrong data";
        if (!(utils.checkLength(req.body.email, 3, 20) && utils.checkLength(req.body.password,3,20)))
            return "Wrong email or password";
        if (!(utils.checkEmail(req.body.email) && utils.isAlfanumeric(req.body.password)))
            return "Wrong email or password";
    }
    catch (err) {
        LOG(err);
        return "Something went wrong";
    }
    return undefined;
};

exports.check_login = function (req, res, path) {
    let message = check_login_data(req);

    if (message !== undefined) {
        LOG("Invalid user data");
        error_object(req, res, path, {
            msg: message,
            code: 6
        });
        return false;
    }
    return true;
};
