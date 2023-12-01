
module.exports = {
    /**
     * 获取当前时间戳（10位）
     */
    getNowTimestamp() {
        return this.getTimestamp(new Date());
    },

    /**
     * 获取指定时间的时间戳（10位）
     * @param {Date} date 时间
     */
    getTimestamp(date) {
        return Math.round(date.getTime() / 1000);
    },

    /**
     * 获取当月第一天的时间戳
     */
    getFirstDayOfMonth() {
        let date = new Date();
        date.setDate(1);
        date.setHours(0, 0, 0, 0);
        return this.getTimestamp(date);
    },

    /**
     * 获取本周星期一的时间
     * @param {Date} date 当前时间
     */
    getMonday(date) {
        let day = date.getDay() || 7;
        if (day !== 1)
            date.setHours(-24 * (day - 1));
        return date;
    },

    /**
     * 获取本周星期一凌晨的时间戳
     * @param {Date} date 当前时间
     */
    getMondayMidnight(date) {
        date.setHours(0, 0, 0, 0);
        return this.getTimestamp(this.getMonday(date))
    },

    
    /**
     * 截取指定长度的昵称，多余用...代替
     * @param {String} nickName 昵称
     * @param {Number} length 长度
     */
    fixNickName(nickName, length) {
        // TODO: 支持中英文
        length = length || 10;
        let res = nickName || "";
        if (res.length > length) {
            res = res.slice(0, length) + "...";
        }
        return res;
    }
}


