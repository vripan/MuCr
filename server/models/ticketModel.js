module.exports = {
    event_name: "string",
    genre_id: "number",
    start_date: "string",
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