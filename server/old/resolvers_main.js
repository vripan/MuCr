// 'use strict';
// let _g = require('./global');
//



// exports.resolveProfile = function (res, req, path, query) {
//     _g.utils.isLoggedIn(res, req, path, query, (err, res, req, path, query, user_id) => {
//         if (err) {
//             _g.error.messageResolver(res, req, "Not logged in");
//             return;
//         }
//
//         if(path.length>=2 && path[1]!==undefined && path[1].length>=1)
//             user_id = parseInt(path[1]);
//         Todo: check for alfanumeric string  66a => 66
        //
        //
        // _g.oracledb.getConnection((err, connection) => {
        //     if (err) {
        //         console.log(err.message);
        //         _g.error.messageResolver(res, req, "Something went wrong. Contact admin at admin@admin.com");
        //         return;
        //     }
        //
        //     connection.execute('select * from users where id = :id', [user_id], (err, result) => {
        //         if (err) {
        //             console.log(err);
        //             _g.error.messageResolver(res, req, "Something went wrong. Contact admin at admin@admin.com. Code: 123");
        //             return;
        //         }
        //
        //         if (result.rows.length === 0) {
        //             _g.error.messageResolver(res, req, "Invalid user");
        //             return;
        //         }
        //
        //         let info = {};
        //         info.firstname = result.rows[0][1];
        //         info.lastname = result.rows[0][2];
        //
        //         if (result.rows[0][7] === null)
        //             info.profile_pic = _g.default_profile_pic;
        //         else info.profile_pic = result.rows[0][7];
        //
        //         if (result.rows[0][8] === null)
        //             info.cover_pic = _g.default_cover_pic;
        //         else info.cover_pic = result.rows[0][8];
        //
        //         if (result.rows[0][6] === null)
        //             info.description = "";
        //         else info.description = result.rows[0][6];
        //
        //         _g.fs.readFile(_g.templatesPath + 'profile.html', 'utf8', function (err, data) {
        //             res.writeHead(404, {'Content-Type': 'text/html'});
        //             data = _g.ejs.render(data, info);
        //             res.write(data);
        //             res.end();
        //         });
        //         _g.utils.realeaseConnection(connection);
        //     });
        // });
    // });
// };
// /