module.exports = {
    code: 0,
    msg: 0,
    isOk: function () {
        return !(this.code === undefined || this.msg === undefined);
    }
};