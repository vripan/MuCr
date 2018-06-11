//======================================================================================================================
// let _g = require('./global');
//======================================================================================================================
//Todo: check for unique error codes
// exports.JSONsend = function (res, req, path, query, obj) {
//     res.writeHead(200, {'Content-Type': 'application/json'});
//     res.write(JSON.stringify(obj));
//     res.end();
// };

// exports.resolveLoginAPI = function (res, req, path, query) {
//     if (!checkLoginBodyAPI(res, req, path, query)) return;
//
//     _g.oracledb.getConnection((err, connection) => {
//         if (err) {
//             console.log(err.message);
//             exports.JSONsend(res, req, path, query, {
//                 msg: 'Something went wrong. Try again.',
//                 code: 6
//             });
//             return;
//         }
//
//         connection.execute('select id from users where email = :email and password = :password', [req.body.email, req.body.password], (err, result) => {
//             if (err) {
//                 console.log(err);
//                 exports.JSONsend(res, req, path, query, {
//                     msg: 'Something went wrong. Try again.',
//                     code: 3
//                 });
//                 return;
//             }
//
//             if (result.rows.length === 0) {
//                 exports.JSONsend(res, req, path, query, {
//                     msg: 'Email or password incorrect.', code: 4
//                 });
//                 return;
//             }
//
//             let sessionToken = _g.sha256(req.body.email + req.body.password + result.rows[0][0] + Date.now());
//             let cookies = new _g.cookies(req, res);
//             Todo: find a way to check if token is unique without repeated queries to server
            //
            // connection.execute("insert into sessions values(NULL,:id,:token)", {
            //     id: result.rows[0][0],
            //     token: sessionToken
            // }, _g.queryOptions, (err, result) => {
            //     if (err) {
            //         console.log(err);
            //         exports.JSONsend(res, req, path, query, {msg: 'Something went wrong. Try again.', code: 5});
            //         return;
            //     }
            //
            //     cookies.set("session_id", sessionToken);
            //     exports.JSONsend(res, req, path, query, {
            //         msg: 'Your are logged in.',
            //         session_id: sessionToken,
            //         code: 0
            //     });
            //     _g.utils.realeaseConnection(connection);
            // });
        // });
    // });
// };

// exports.resolveRegisterAPI = function (res, req, path, query) {
//     if (!checkRegisterBodyAPI(res, req, path, query)) return;
//
//     _g.oracledb.getConnection((err, connection) => {
//         if (err) {
//             console.log(err.message);
//             exports.JSONsend(res, req, path, query, {
//                 msg: 'Something went wrong. Try again.',
//                 code: 2
//             });
//             return;
//         }
//
//         connection.execute('select count(*) from users where email = :email', [req.body.email], (err, result) => {
//             if (err) {
//                 console.log(err);
//                 exports.JSONsend(res, req, path, query, {
//                     msg: 'Something went wrong. Try again.',
//                     code: 3
//                 });
//                 return;
//             }
//
//             if (result.rows[0][0] !== 0) {
//                 exports.JSONsend(res, req, path, query, {
//                     msg: 'Email already exists.', code: 4
//                 });
//                 return;
//             }
//
//             connection.execute("insert into users values(NULL,:firstname,:lastname,:email,:password,1,'','','')", req.body, _g.queryOptions, (err, result) => {
//                 if (err) {
//                     console.log(err);
//                     exports.JSONsend(res, req, path, query, {msg: 'Something went wrong. Try again.', code: 5});
//                     return;
//                 }
//
//                 exports.JSONsend(res, req, path, query, {msg: 'Account successfully created.', code: 0});
//                 _g.utils.realeaseConnection(connection);
//             });
//         });
//     });
// };
//

//====================================================DATA VALIDATION====================================================
// let checkLoginBodyAPI = function (res, req, path, query) {
//     //ToDo: check if email valid, check length, check password, check for undefined, respond with specific error message
//     return true;
// };

// let checkRegisterBodyAPI = function (res, req, path, query) {
//     if (req.body.email === undefined || req.body.firstname === undefined || req.body.lastname === undefined || req.body.password === undefined) {
//         exports.JSONsend(res, req, path, query, {msg: "Incomplete data.", code: 7});
//         return false;
//     }

//     if (!(_g.utils.checkLen(req.body.email, 3, 20) && _g.utils.checkLen(req.body.firstname, 3, 20) && _g.utils.checkLen(req.body.lastname, 3, 20) && _g.utils.checkLen(req.body.password, 3, 20))) {
//         exports.JSONsend(res, req, path, query, {msg: "Invalid data length", code: 8});
//         return false;
//     }
//
//     if (!(_g.utils.isEmail(req.body.email) && _g.utils.isAlfaNumeric(req.body.firstname) && _g.utils.isAlfaNumeric(req.body.lastname) && _g.utils.isAlfaNumeric(req.body.password))) {
//         exports.JSONsend(res, req, path, query, {msg: "Invalid characters.", code: 9});
//         return false;
//     }
//     return true;
// };