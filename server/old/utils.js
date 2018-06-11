// var _g = require('./global');
//
// exports.realeaseConnection = function (connection) {
//     connection.close((err) => {
//         if (err) console.log("Cannot release connection\n" + err.message);
//     });
// };
//
// exports.JSONparse = function (obj) {
//     let res = null;
//     try {
//         res = JSON.parse(obj);
//     } catch (e) {
//         res = null;
//     }
//     return res;
// };
//
//
// exports.checkLen = function (str, min, max) {
//     return !(str.length < min || str.length > max);
// };
//
// exports.isAlfaNumeric = function (str) {
//     let regx = /^[a-z0-9]+$/;
//     return regx.test(str);
//
// };
// exports.isLoggedIn = function (res, req, path, query, callback) {
//     let cookies =  _g.cookies(req,res);
//     let session_id = cookies.get("session_id");
//
//     if(session_id === undefined) {
//         callback({msg: "Not logged in"}, res, req, path, query);
//         return;
//     }
//
//     _g.oracledb.getConnection((err, connection) => {
//         if (err) {
//             console.log("isLogged fct:  "+err.message);
//             callback({msg: "Cannot get connection"}, res, req, path, query);
//             return;
//         }
//
//         connection.execute('select user_id from sessions where token = :token ', [session_id], (err, result) => {
//             if (err) {
//                 console.log("isLogged fct:  "+err.message);
//                 callback({msg: "Cannot query DB"}, res, req, path, query);
//                 return;
//             }
//
//             if (result.rows.length === 0) {
//                 console.log("isLogged fct:  empty row result");
//                 callback({msg: "Empty DB query response"}, res, req, path, query);
//                 return;
//             }
//
//             exports.realeaseConnection(connection);
//             callback(undefined,res,req,path,query,result.rows[0][0]);
//         });
//     });
// };
//
// exports.isEmail = function (email) {
//     var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
//     return re.test(String(email).toLowerCase());
// };