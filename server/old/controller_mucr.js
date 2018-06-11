'use strict';
//======================================================================================================================
let _g = require('./global');
//======================================================================================================================

let checkArrProperty = function (arr) {
    if (arr.length < 1)
        return undefined;

    return arr[0];
};

let checkProperty = function (prop) {
    if (prop === null || prop === "")
        return "Unknown";
    return prop;
};

let getText = function (prop) {
    if (prop)
        if (prop.firstChild !== undefined)
            if (prop.firstChild.nodeValue !== undefined)
                return prop.firstChild.nodeValue;
    return "Unknown";
};

let resolveRelationUrl = function (relation_list) {
    let relation = relation_list.getElementsByTagName("relation");

    let mbid;
    let name;
    let urls = [];

    for (let i = 0; i < relation.length; i++) {
        let type = relation[i].getAttribute("type");
        if (type) {
            if (relation[i].firstChild && relation[i].firstChild.firstChild) {
                let link = relation[i].firstChild.firstChild.nodeValue;
                urls.push({type: type, link: link});
            }
        }
    }
    return urls;
};

let resolveRelationRecording = function (relation_list) {
    let relation = relation_list.getElementsByTagName("relation");

    let mbid;
    let name;
    let recordings = [];

    for (let i = 0; i < relation.length; i++) {
        let recording = relation[i].getElementsByTagName("recording");
        if (recording && recording.length >= 1) {
            recording = recording[0];
            mbid = recording.getAttribute("id");
            mbid = "/mucr/recording/" + mbid;
            if (!mbid) mbid = undefined;
            let title = recording.getElementsByTagName("title");
            if (title.length >= 1) {
                title = title[0];
                name = title.firstChild.nodeValue;
                recordings.push({link: mbid, title: name});
            }
        }
    }

    return recordings;
};

let resolveRelationRelease = function (relation_list) {
    let relation = relation_list.getElementsByTagName("relation");

    let mbid;
    let name;
    let releases = [];

    for (let i = 0; i < relation.length; i++) {
        let release = relation[i].getElementsByTagName("release");
        if (release && release.length >= 1) {
            release = release[0];
            mbid = release.getAttribute("id");
            mbid = "/mucr/release/" + mbid;
            if (!mbid) mbid = undefined;
            let title = release.getElementsByTagName("title");
            if (title.length >= 1) {
                title = title[0];
                name = title.firstChild.nodeValue;
                releases.push({link: mbid, title: name});
            }
        }
    }

    return releases;
};

exports.resolveWikiImage = function (image, callback) {
    let name;
    if (!/commons.wikimedia.org\/wiki\/File:/.test(image)) {
        callback(image);
        return;
    }
    name = encodeURIComponent(image.substr(40));

    let request_options = {
        url: 'https://tools.wmflabs.org/magnus-toolserver/commonsapi.php?image=' + name,
        method: 'GET',
        headers: {
            'User-Agent': 'MusicCollector/1.0'
        }
    };

    _g.request(request_options, (err, response, body) => {
        if (err) {
            callback(image);
            return;
        }
        if (response.statusCode !== 200) {
            callback(image);
            return;
        }
        let document = new _g.dom().parseFromString(body, "application/xml");
        let files = document.getElementsByTagName("file");
        for (let i = 0; i < files.length; i++) {
            if (files[i].childNodes.length === 1) {
                callback(files[i].firstChild.nodeValue);
                return;
            }
        }
        return image;
    });
};

exports.parseXMLArtist = function (xml) {
    let page_info = {};
    let document = new _g.dom().parseFromString(xml, "application/xml");
    let artist;

    if (document.getElementsByTagName("artist").length >= 1)
        artist = document.getElementsByTagName("artist")[0];
    else return null;

    page_info.type = checkProperty(artist.getAttribute("type"));
    page_info.name = getText(checkArrProperty(artist.getElementsByTagName("name")));
    page_info.disambiguation = getText(checkArrProperty(artist.getElementsByTagName("disambiguation")));
    page_info.gender = getText(checkArrProperty(artist.getElementsByTagName("gender")));

    let life_span = checkArrProperty(artist.getElementsByTagName("life-span"));
    if (!life_span)
        page_info.life_begin = page_info.life_end = "Unknown";
    else {
        page_info.life_begin = getText(checkArrProperty(life_span.getElementsByTagName("begin")));
        page_info.life_end = getText(checkArrProperty(life_span.getElementsByTagName("end")));
    }

    //init with black array
    page_info.releases = [];
    page_info.urls = [];
    page_info.recordings = [];

    let relation_list = artist.getElementsByTagName("relation-list");
    if (relation_list)
        for (let i = 0; i < relation_list.length; i++) {
            if (relation_list[i].getAttribute("target-type") === "release")
                page_info.releases = resolveRelationRelease(relation_list[i]);
            else if (relation_list[i].getAttribute("target-type") === "url")
                page_info.urls = resolveRelationUrl(relation_list[i]);
            else if (relation_list[i].getAttribute("target-type") === "recording")
                page_info.recordings = resolveRelationRecording(relation_list[i]);
        }
    return page_info;
};

exports.resolveArtistMUCR = function (res, req, path, query) {
    if (path.length < 3) {
        _g.error.errorResolver(res, req, 400);
        return;
    }

    let mbid = path[2];
    let entity = "artist/";

    let request_options = {
        url: _g.mbrainz + entity + mbid + '?inc=' + _g.relationships.default,
        method: 'GET',
        headers: {
            'User-Agent': 'MusicCollector/1.0'
        }
    };

    _g.request(request_options, (err, response, body) => {
        if (err) {
            _g.error.messageResolver(res, req, "Invalid mbid");
            return;
        }

        if (response.statusCode !== 200) {
            console.log(body);
            _g.error.messageResolver(res, req, "Something went wrong");
            return;
        }

        let page_info = exports.parseXMLArtist(body);
        page_info.image = _g.default_artist_pic;

        for (let i = 0; i < page_info.urls.length; i++) {
            if (page_info.urls[i].type === "image")
                page_info.image = page_info.urls[i].link;
        }

        exports.resolveWikiImage(page_info.image, (img) => {
            page_info.image = img;
            _g.fs.readFile(_g.templatesPath + 'artist.html', 'utf8', function (err, data) {
                res.writeHead(404, {'Content-Type': 'text/html'});
                data = _g.ejs.render(data, page_info);
                res.write(data);
                res.end();
            });
        });
    })
};

//======================================================================================================================
let MUCRMapper = {
    artist: exports.resolveArtistMUCR
};

exports.mucrListener = function (res, req, path, query) {
    if (req.method !== 'GET') {
        _g.error.errorResolver(res, req, 404);
        return;
    }

    let resolver = MUCRMapper[path[1]];
    if (resolver === undefined) _g.error.errorResolver(res, req, 404);
    else resolver(res, req, path, query);
};

//======================================================================================================================

