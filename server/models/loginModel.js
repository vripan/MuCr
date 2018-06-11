module.exports = {
    email: "string",
    remember: "boolean",
    password: "string",
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