'use strict';
//=======================REQUIREMENTS===========================
exports.http = require('http');
exports.https = require('https');
exports.url = require('url');
exports.fs = require('fs');
exports.ejs = require('ejs');
exports.oracledb = require('oracledb');
exports.Sync = require('sync');
exports.sha256 = require('sha256');
exports.cookies = require('cookies');
exports.request = require('request');
exports.dom = require ('xmldom').DOMParser;
exports.xml2js = require('xml2js');

exports.error = require('./controller_error');
exports.resolvers = require('./resolvers_main');
exports.apiresolver = require('./resolvers_api');
exports.apic = require('./controller_api');
exports.mucrc = require('./controller_mucr');
exports.controller = require('./controller_main.js');
exports.utils = require('./utils.js');
//=============================VARS=============================
exports.MIMEtypes = {
    '.aac': 'audio/aac',
    '.abw': 'application/x-abiword',
    '.arc': 'application/octet-stream',
    '.avi': 'video/x-msvideo',
    '.azw': 'application/vnd.amazon.ebook',
    '.bin': 'application/octet-stream',
    '.bz': 'application/x-bzip',
    '.bz2': 'application/x-bzip2',
    '.csh': 'application/x-csh',
    '.css': 'text/css',
    '.csv': 'text/csv',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.eot': 'application/vnd.ms-fontobject',
    '.epub': 'application/epub+zip',
    '.es': 'application/ecmascript',
    '.gif': 'image/gif',
    '.html': 'text/html',
    '.htm': 'text/html',
    '.ico': 'image/x-icon',
    '.ics': 'text/calendar',
    '.jar': 'application/java-archive',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.mid': 'audio/midi',
    '.midi': 'audio/midi',
    '.mpeg': 'video/mpeg',
    '.mpkg': 'application/vnd.apple.installer+xml',
    '.odp': 'application/vnd.oasis.opendocument.presentation',
    '.ods': 'application/vnd.oasis.opendocument.spreadsheet',
    '.odt': 'application/vnd.oasis.opendocument.text',
    '.oga': 'audio/ogg',
    '.ogv': 'video/ogg',
    '.ogx': 'application/ogg',
    '.otf': 'font/otf',
    '.png': 'image/png',
    '.pdf': 'application/pdf',
    '.ppt': 'application/vnd.ms-powerpoint',
    '.pptx': 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    '.rar': 'application/x-rar-compressed',
    '.rtf': 'application/rtf',
    '.sh': 'application/x-sh',
    '.svg': 'image/svg+xml',
    '.swf': 'application/x-shockwave-flash',
    '.tar': 'application/x-tar',
    '.tiff': 'image/tiff',
    '.tif': 'image/tiff',
    '.ts': 'application/typescript',
    '.ttf': 'font/ttf',
    '.vsd': 'application/vnd.visio',
    '.wav': 'audio/wav',
    '.weba': 'audio/webm',
    '.webm': 'video/webm',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.xhtml': 'application/xhtml+xml',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    '.xml': 'application/xml',
    '.xul': 'application/vnd.mozilla.xul+xml',
    '.zip': 'application/zip',
};
exports.default_profile_pic = "/img/user.png";
exports.default_cover_pic = "/img/cover.jpg";
exports.default_artist_pic = "/img/user.png";
//========================SETTINGS=============================
exports.PORT = 8010;
exports.shouldInitDB = true;
exports.mbrainz = "https://musicbrainz.org/ws/2/";
exports.relationships = {
    'area':'area-rels',
    'artist':'artist-rels',
    'event':'event-rels',
    'instrument':'instrument-rels',
    'label':'label-rels',
    'place':'place-rels',
    'recording':'recording-rels',
    'release':'release-rels',
    'release-group':'release-group-rels',
    'series':'series-rels',
    'url':'url-rels',
    'work':'work-rels',

    'default':'area-rels+artist-rels+event-rels+instrument-rels+label-rels+place-rels+recording-rels+release-rels+release-group-rels+series-rels+url-rels+work-rels'
};




exports.queryOptions = {
    autoCommit: true
};

exports.templatesPath = './resources/';
exports.resourcesPath = './resources/';