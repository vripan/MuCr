"use strict";
let request = require('request');
let settings = require('../settings');
let logic = require('../logic');
let fs = require('fs');
let ejs = require('ejs');

exports.album_get = function (req, res, path) {
    let spotify_album_id = path[0];
    let template_info = {};
    LOG('here');
    logic.spotify.get_album(spotify_album_id, (album_info) => {
        if (album_info === null) {
            message_page(req, res, path, "Invalid album ID.");
            return;
        }

        template_info.name = logic.utils.assignCheck(album_info.name, settings.album_default_name);
        template_info.popularity = logic.utils.assignCheck(album_info.popularity, settings.default_artist_popularity);
        template_info.album_type = logic.utils.assignCheck(album_info.album_type, settings.default_album_type);
        template_info.release_date = logic.utils.assignCheck(album_info.release_date, settings.album_default_release_date);
        template_info.label = logic.utils.assignCheck(album_info.label, settings.default_album_label);

        template_info.picture = logic.utils.assignCheck(album_info.images[0].url, null);
        if (template_info.picture === null)
            template_info.picture = logic.utils.assignCheck(album_info.images[1].url, null);
        if (template_info.picture === null)
            template_info.picture = logic.utils.assignCheck(album_info.images[2].url, settings.default_album_pic);

        logic.spotify.get_tracks_by_album(spotify_album_id, (track_info) => {
            template_info.tracks = [];


            if (track_info.items !== null && track_info.items !== undefined)
                for (let track of track_info.items) {
                    let template_track = {};
                    template_track.explicit = track.explicit;
                    template_track.name = track.name;
                    template_track.preview_url = track.preview_url;
                    template_track.minutes = Math.floor(track.duration_ms / 1000 / 60);
                    template_track.seconds = Math.floor((track.duration_ms % 60000) / 1000);

                    template_info.tracks.push(template_track);
                }

            fs.readFile(settings.templatesPath + 'album.html', 'utf-8', function (err, data) {
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

exports.default_album_get = function (req, res, path) {
    message_page(req, res, path, "Give me an album");
};