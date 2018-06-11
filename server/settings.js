'use strict';

exports.PORT = 8010;

exports.databaseInfo = {
    user: 'root',
    password: 'qwertyqwerty',
    connectString: 'orcl.caswm9vgkp9j.us-east-2.rds.amazonaws.com/ORCL'
};

exports.templatesPath = './resources/';
exports.resourcesPath = './resources/';

exports.queryOptions = {
    autoCommit: true
};

exports.default_profile_pic = "/img/user.png";
exports.default_cover_pic = "/img/cover.jpg";
exports.default_artist_pic = "/img/user.png";
exports.default_description = "This is me. A default desciption. Love music. Play guitar, piano. Like sports, chess."
