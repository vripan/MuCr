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

exports.user_agent = 'MusicCollector/1.0';

exports.spotify_base_url = "https://api.spotify.com/v1/";


exports.default_artist_name = "John Doe";
exports.default_artist_popularity = 0;
exports.album_default_name = "My album";
exports.album_default_release_date = "2000";
exports.default_album_type = "album";
exports.default_album_id = 0;
exports.default_album_label = 'Label Records';
exports.default_album_pic = "/img/default_album.png";
exports.default_profile_pic = "/img/user.png";
exports.default_cover_pic = "/img/cover.jpg";
exports.default_vinyl_pic = "/img/default_vinyl.jpg";
exports.default_disk_pic = "/img/default_disk.jpg";
exports.default_cassette_pic = "/img/default_cassette.jpg";
exports.default_ticket_pic = "/img/default_ticket.jpg";
exports.default_artist_pic = "/img/default_artist.jpg";
exports.default_group_pic = "/img/default_group.jpg";
exports.default_description = "I think I am a nice person though have negligible weaknesses, have a good amount of likeable good qualities too. I am sincere and responsible. I am capable of managing and handling serious and difficult situations easily and finish all tasks well. I like to stay simple and uncomplicated and live joyously enjoying every moment of my life.";
