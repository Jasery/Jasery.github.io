
module.exports = {
    /**
     * 获取好友数据 
     * @param {Array} keyList key列表
     */
    getFriendCloudStorage(keyList) {
        return new Promise((resolve, reject) => {
            wx.getFriendCloudStorage({
                keyList: keyList,
                success: (res) => {
                    resolve(res);
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    },

    /**
     * 获取用户数据 
     * @param {Array} keyList key列表
     */
    getUserCloudStorage(keyList) {
        return new Promise((resolve, reject) => {
            wx.getUserCloudStorage({
                keyList: keyList,
                success: (res) => {
                    resolve(res);
                },
                fail: (err) => {
                    reject(err);
                }
            });
        });
    },

    /**
     * 设置用户数据
     * 托管数据的限制:
     *  1. 每个openid所标识的微信用户在每个游戏上托管的数据不能超过128个key-value对。
     *  2. 上报的key-value列表当中每一项的key+value长度都不能超过1K(1024)字节。
     *  3. 上报的key-value列表当中每一个key长度都不能超过128字节。
     * @param {Object} data 要保存的数据，会针对每个key转换为KVDataList格式
     */
    setUserCloudStorage(data) {
        return new Promise((resolve, reject) => {
            let keys = Object.keys(data);
            let kvDataList = [];
            for (const key of keys) {
                let dataItem = {
                    key: key,
                    value: data[key].toString()
                };
                kvDataList.push(dataItem);
            }

            wx.setUserCloudStorage({
                KVDataList: kvDataList,
                success: (res) => {
                    resolve(res);
                },
                fail: (err) => {
                    reject(err);
                }
            })
        })
    },

    /**
     * 移除用户数据
     * @param {Array} keyList key列表
     */
    removeUserCloudStorage(keyList) {
        return new Promise((resolve, reject) => {
            wx.removeUserCloudStorage({
                keyList: keyList,
                success: (res) => {
                    resolve(res);
                },
                fail: (err) => {
                    reject(err);
                }
            })
        })
    }
}