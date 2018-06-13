"use strict";

exports.checkIfGroup = function (req, res, path, connection, callback) {

    req.group_id = null;
    if (req.body.owner_type === "group") {
        connection.execute('select * from groups where owner_id = :id and name = :name', [req.user_id, req.body.group_name], (err, result) => {
            if (err) {
                LOG(err);
                error_object(req, res, path, {
                    msg: 'Something went wrong. Try again.',
                    code: 465
                });
                return;
            }

            if (result.rows.length !== 0)
                req.group_id = result.rows[0][0];
            else {
                error_object(req, res, path, {
                    msg: 'Invalid group, check if you own this group or if it exists',
                    code: 321
                });
                return;
            }
            callback();
        });
    }
    else {
        callback();
    }
};