module.exports = {
    rpm:"number",
    state:"number", // 1--10
    color:"number",
    channel:"number",
    weight:"number",
    special:"number",
    condition:"number", //0 sau 1
    genre_id:"number",
    artist:"string",
    title:"string",
    label:"string",
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