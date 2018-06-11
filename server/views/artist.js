"use strict";
let request = require('request');
let settings = require('../settings');
let logic = require('../logic');
let fs = require('fs');
let ejs = require('ejs');

exports.artist_get = function (req, res, path) {
    let spotify_artist_id = path[0];
    let template_info = {};

    logic.spotify.get_artist(spotify_artist_id, (artist_info) => {
        if (artist_info === null) {
            message_page(req, res, path, "Invalid artist ID.");
            return;
        }

        template_info.name = logic.utils.assignCheck(artist_info.name, settings.default_artist_name);
        //Intre 0 si 100 relativ la toti artistii
        template_info.popularity = logic.utils.assignCheck(artist_info.popularity, settings.default_artist_popularity);

        //Vine un array de 3 elemente
        template_info.artist_profile_picture = logic.utils.assignCheck(artist_info.images[0].url, null);
        if (template_info.artist_profile_picture === null)
            template_info.artist_profile_picture = logic.utils.assignCheck(artist_info.images[1].url, null);
        if (template_info.artist_profile_picture === null)
            template_info.artist_profile_picture = logic.utils.assignCheck(artist_info.images[2].url, settings.default_artist_pic);


        logic.spotify.get_albums_by_artist(spotify_artist_id, (albums_info) => {
            template_info.albums = [];
            if (albums_info.items !== null && albums_info.items !== undefined)
                for (let album of albums_info.items) {
                    let tempalte_album = {};
                    tempalte_album.name = logic.utils.assignCheck(album.name, settings.album_default_name);
                    tempalte_album.release_date = logic.utils.assignCheck(album.release_date, settings.album_default_release_date);
                    tempalte_album.type = logic.utils.assignCheck(album.album_type, settings.default_album_type);
                    tempalte_album.id = logic.utils.assignCheck(album.id, settings.default_album_id);


                    tempalte_album.picture = logic.utils.assignCheck(album.images[0].url, null);
                    if (tempalte_album.picture === null)
                        tempalte_album.picture = logic.utils.assignCheck(album.images[1].url, null);
                    if (tempalte_album.picture === null)
                        tempalte_album.picture = logic.utils.assignCheck(album.images[2].url, settings.default_album_pic);

                    template_info.albums.push(tempalte_album);
                }

            fs.readFile(settings.templatesPath + 'artist.html', 'utf-8', function (err, data) {
                if (err) {
                    res.writeHead(200, {'Content-Type': 'text/html'});
                    res.write("Something went wrong");
                    res.end();
                    return;
                }

                data = ejs.render(data, template_info);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.write(data);
                res.end();
            });
        });
    });
};

exports.default_artist_get = function (req, res, path) {
    message_page(req,res,path,"Give me an artist");
};