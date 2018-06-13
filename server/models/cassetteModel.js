module.exports = {
    title: "string",
    artist: "string",
    album: "string",
    duration: "number",
    label: "string",
    genre_id: "number",
    owner_type: "string", /*user OR group*/
    group_name: "string", /* if user is "none"*/
    isOk: function (object) {
        for (let key in object) {
            if (key === "isOk") {
                return false;
            }

            if (object.hasOwnProperty(key)) {
                if (this[key] === undefined) return false;
                if (typeof object[key] !== this[key]) return false;
            }
        }
        return true;
    }
};