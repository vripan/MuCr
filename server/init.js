"use strict";
let logic = require('./logic');

module.exports = function () {
    global.MIMEtypes = {
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
    global.ErrorMessages = {
        100: 'Continue',
        101: 'Switching Protocols',
        102: 'Processing (WebDAV; RFC 2518)',
        103: 'Early Hints (RFC 8297)',
        200: 'OK',
        201: 'Created',
        202: 'Accepted',
        203: 'Non-Authoritative Information (since HTTP/1.1)',
        204: 'No Content',
        205: 'Reset Content',
        206: 'Partial Content (RFC 7233)',
        207: 'Multi-Status (WebDAV; RFC 4918)',
        208: 'Already Reported (WebDAV; RFC 5842)',
        226: 'IM Used (RFC 3229)',
        300: 'Multiple Choices',
        301: 'Moved Permanently',
        302: 'Found',
        303: 'See Other (since HTTP/1.1)',
        304: 'Not Modified (RFC 7232)',
        305: 'Use Proxy (since HTTP/1.1)',
        306: 'Switch Proxy',
        307: 'Temporary Redirect (since HTTP/1.1)',
        308: 'Permanent Redirect (RFC 7538)',
        400: 'Bad Request',
        401: 'Unauthorized (RFC 7235)',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        405: 'Method Not Allowed',
        406: 'Not Acceptable',
        407: 'Proxy Authentication Required (RFC 7235)',
        408: 'Request Timeout',
        409: 'Conflict',
        410: 'Gone',
        411: 'Length Required',
        412: 'Precondition Failed (RFC 7232)',
        413: 'Payload Too Large (RFC 7231)',
        414: 'URI Too Long (RFC 7231)',
        415: 'Unsupported Media Type',
        416: 'Range Not Satisfiable (RFC 7233)',
        417: 'Expectation Failed',
        418: 'I\'m a teapot (RFC 2324, RFC 7168)',
        421: 'Misdirected Request (RFC 7540)',
        422: 'Unprocessable Entity (WebDAV; RFC 4918)',
        423: 'Locked (WebDAV; RFC 4918)',
        424: 'Failed Dependency (WebDAV; RFC 4918)',
        426: 'Upgrade Required',
        428: 'Precondition Required (RFC 6585)',
        429: 'Too Many Requests (RFC 6585)',
        431: 'Request Header Fields Too Large (RFC 6585)',
        451: 'Unavailable For Legal Reasons (RFC 7725)',
        500: 'Internal Server Error',
        501: 'Not Implemented',
        502: 'Bad Gateway',
        503: 'Service Unavailable',
        504: 'Gateway Timeout',
        505: 'HTTP Version Not Supported',
        506: 'Variant Also Negotiates (RFC 2295)',
        507: 'Insufficient Storage (WebDAV; RFC 4918)',
        508: 'Loop Detected (WebDAV; RFC 5842)',
        510: 'Not Extended (RFC 2774)',
        511: 'Network Authentication Required (RFC 6585)',
    };
    global.GENRE = {
        "1": "Alternative",
        "2": "Anime",
        "3": "Blues",
        "4": "Children’s Music",
        "5": "Classical",
        "6": "Comedy",
        "7": "Commercial",
        "8": "Country",
        "9": "Dance",
        "10": "Disney",
        "11": "Easy Listening",
        "12": "Electronic",
        "13": "Enka",
        "14": "French Pop",
        "15": "German Folk",
        "16": "German Pop",
        "17": "Fitness & Workout",
        "18": "Hip-Hop/Rap",
        "19": "Holiday",
        "20": "Indie Pop",
        "21": "Industrial",
        "22": "Inspirational",
        "23": "Instrumental",
        "24": "J-Pop",
        "25": "Jazz",
        "26": "K-Pop",
        "27": "Karaoke",
        "28": "Kayokyoku",
        "29": "Latin",
        "30": "New Age",
        "31": "Opera",
        "32": "Pop",
        "33": "R&B/Soul",
        "34": "Reggae",
        "35": "Rock",
        "36": "Singer/Songwriter",
        "37": "Soundtrack",
        "38": "Spoken Word",
        "39": "Tejano",
        "40": "Vocal"
    };
    global.MONTHS = {
        "0": "January",
        "1": "February",
        "2": "March",
        "3": "April",
        "4": "May",
        "5": "June",
        "6": "July",
        "7": "August",
        "8": "September",
        "9": "October",
        "10": "November",
        "11": "December"
    };
    global.CASSETTE_STATE = {
        "0": "USED",
        "1": "NEW"
    };
    global.CHANNEL = {
        "0": "MONO",
        "1": "STEREO"
    };
    global.CASSETTE_TYPE = {
        "0": "TAPE RECORDER", //MAGNETOFON
        "1": "CASSETTE PLAYER" //CASETOFON
    };

    global.COLOR = {
        "1": "Default/Black",
        "2": "Red",
        "3": "Green",
        "4": "Blue",
        "5": "Yellow",
        "6": "Pink",
        "7": "Multicolor",
    };

    global.WEIGHT = {
        "120": "120",
        "180": "180",
        "200": "200"
    };

    global.SPECIAL = {
        "1":"YES",
        "0":"NO"
    };

    global.CONDITION = {
        "1":"NEW",
        "0":"USED"
    };

    global.STATE = {
        "1":"NEW",
        "0":"USED"
    };

    global.spotify_access_token = null;

    logic.spotify.get_access_token();
    setInterval(logic.spotify.get_access_token, 1000 * 60 * 45); // 45 minutes
};