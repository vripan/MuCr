module.exports = {
    title: "string",
    artist: "string",
    duration: "number",
    label: "string",
    genre_id: "number",
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