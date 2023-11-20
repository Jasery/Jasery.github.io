const promiseWx = require('./utils/promiseWx');
const util = require('./utils/util');
const helper = require('./utils/helper');

class OpenContexts {
    constructor() {

        this.a = 0;
        this.b = 0;
        this.c = 0;
        this.d = 0;
        this.w = 0;
        this.h = 0;
        this.tx = 0;
        this.ty = 0;

        // 微信共享画布
        this.sharedCanvas = null;
        this.context = null;

        // 所有好友排行信息
        this.friendsRankData = [];

        // 分页相关配置
        this.currentPage = 1;
        this.totalPageCount = 1;
        this.pageSize = 6;
        this.rankType = '';


        // 业务相关缓存
        this.selfOpenId = '';
        this.nowScore = '';
        // 超越的好友索引
        this.surpassIndex = -1;

        this.init();
    }

    init() {
        this.sharedCanvas = wx.getSharedCanvas();
        this.context = this.sharedCanvas.getContext('2d');
        this.initWxMessage();
    }

    /**
     * 初始化消息监听
     */
    initWxMessage() {
        wx.onMessage((data) => {
            if (data.type == "changeMatrix") {
                this.a = data.a;
                this.b = data.b;
                this.c = data.c;
                this.c = data.c;
                this.d = data.d;
                this.w = data.w;
                this.h = data.h;
                this.tx = data.tx;
                this.ty = data.ty;

            } else if (data.msgType) {
                switch (data.msgType) {
                    case "showFriendRank":
                        this.rankType = 'friendRank';
                        this.selfOpenId = data.val && data.val.openId;
                        this.showFriendRank();
                        break;

                    case "rankPageUp":
                        this.changeRankPage("friendRank", "up");
                        break;

                    case "rankPageDown":
                        this.changeRankPage("friendRank", "down");
                        break;

                    case "showThreeFriend":
                        this.selfOpenId = data.openId;
                        this.showThreeFriend(data.score);
                        break;

                    case "setRankInfo":
                        this.setRankInfo(data.val);
                        break;

                    case "showNextSurpassFriend":

                        break;

                    case "showSurpassedFriend":

                        break;

                    case "showHelpRank":
                        break;

                    default:
                }
            }
        });
    }

    showFriendRank() {
        this.getFriendsRankData(['score'])
            .then(() => {
                // 需要先排序
                this.friendsRankData.sort((a, b) => b.score - a.score);

                let frinedRankData = this.getPageOfFriendsData(this.currentPage, this.pageSize);

                this.initContexts();

                let index = (this.currentPage - 1) * this.pageSize + 1;
                let baseY = 0;
                for (const frinedDataItem of frinedRankData) {
                    // 转换过，KVDataList的数据可以直接在对象上获取
                    let score = frinedDataItem.score;
                    let nickName = frinedDataItem.nickname;
                    let avatarUrl = frinedDataItem.avatarUrl;
                    this.drawItem(score, nickName, avatarUrl, index, baseY);
                    baseY += 90;
                    index++;
                }
                this.drawPageNum();
                this.drawSelf();
            });
    }

    drawItem(score, nickName, avatarUrl, index, baseY, isDrawLine = true) {

        // 画排名
        if (index <= 3) {
            helper.drawImage(`openContexts/resource/icon${index}.png`, 60, 66, 25, baseY + 15);
        } else {
            helper.fillText(index.toString(), 50, baseY + 55, '32px Arial', '#1d8fd7');
        }

        // 画头像
        this.drawAvatar(avatarUrl, 115, baseY + 15, 65);

        // 画昵称
        helper.fillText(util.fixNickName(nickName, 6), 200, baseY + 75, '24px Arial', '#1d8fd7');

        // 画段位
        this.drawDanGrading(score, baseY);

        // 画分数
        this.drawScore(score, baseY);

        // 画分隔线
        if (isDrawLine) {
            helper.drawLine(0, baseY + 90, 630, '#b4e1ff', 2);
        }
    }

    drawDanGrading(score, baseY) {
        let danGradingText = helper.getDanGradingText(score);
        helper.fillText(danGradingText, 240, baseY + 35, '24px Arial', '#ef9d33');
        let danGradingIcon = helper.getDanGradingIcon(score);
        helper.drawImage(danGradingIcon, 37.6, 35.2, 200, baseY + 10);
    }

    drawScore(score, baseY) {
        helper.drawImage('openContexts/resource/bgTrophy.png', 160, 40, 425, baseY + 25, () => {
            helper.drawImage('openContexts/resource/iconTrophy.png', 68, 52, 405, baseY + 20);
            helper.fillText('x', 475, baseY + 53, '24px Arial', '#fff');
            helper.fillText(score.toString(), 490, baseY + 53, '28px Arial', '#fff');
        });
    }

    drawSelf() {
        for (let i = 0; i < this.friendsRankData.length; i++) {
            let firendRankDataItem = this.friendsRankData[i];
            let index = i + 1;
            if (firendRankDataItem.openid === this.selfOpenId) {
                let score = firendRankDataItem.score;
                let nickName = firendRankDataItem.nickname;
                let avatarUrl = firendRankDataItem.avatarUrl;
                this.drawItem(score, nickName, avatarUrl, index, 685, false);

                break;
            }
        }
    }

    drawPageNum() {
        let text = `${this.currentPage}/${this.totalPageCount}`;
        helper.fillText(text, 300, 610, '32px Arial', '#6e6d6d', 'center');
    }

    changeRankPage(rankType, changeType) {
        if (!this.friendsRankData || !changeType) {
            return;
        }

        if (changeType === "up") {
            this.currentPage--;
            if (this.currentPage < 1) {
                this.currentPage = this.totalPageCount;
            }
        } else if (changeType === "down") {
            this.currentPage++;
            if (this.currentPage > this.totalPageCount) {
                this.currentPage = 1;
            }
        }

        if (this.rankType === "friendRank") {
            this.showFriendRank();
        } else if (this.rankType === 'helpRank') {
            this.drawHelpRank()
        }
    }

    showThreeFriend(score) {
        let nowScore = score;
        this.getFriendsRankData(['score'])
            .then(() => {

                for (let rankDataItem of this.friendsRankData) {
                    if (rankDataItem.openid === this.selfOpenId) {
                        if (nowScore > rankDataItem.score) {
                            rankDataItem.score = nowScore;
                        }
                        break;
                    }
                }

                // 需要先排序
                this.friendsRankData.sort((a, b) => b.score - a.score).map((item, index) => {
                    item.index = index;
                    return item;
                });

                let selfIndex = this.friendsRankData.findIndex(item => item.openid === this.selfOpenId);
                let sliceStartIndex = selfIndex - 1;
                if (sliceStartIndex < 0) {
                    sliceStartIndex = 0;
                } else if (sliceStartIndex === this.friendsRankData.length - 2) {
                    sliceStartIndex = selfIndex - 2;
                }
                let threeRankData = this.friendsRankData.slice(sliceStartIndex, sliceStartIndex + 3);

                this.initContexts();
                let baseX = 0;
                for (let rankDataItem of threeRankData) {
                    let score = rankDataItem.score;
                    let nickName = rankDataItem.nickname;
                    let avatarUrl = rankDataItem.avatarUrl;

                    // 画排名
                    helper.fillText((rankDataItem.index + 1).toString(), baseX + 33, 30, '24px Arial', '#fff556', 'center');

                    // 画头像    
                    this.drawAvatar(avatarUrl, baseX, 45, 65);

                    // 画昵称
                    helper.fillText(nickName, baseX + 33, 140, '24px Arial', '#fff', 'center')


                    baseX += 145;
                }
            })
    }

    /**
     * 画头像
     * @param {String} avatarUrl 头像Url
     * @param {Number} x x坐标
     * @param {Number} y y坐标
     * @param {Number} size 头像尺寸
     * @param {Boolean} isCircle 是否是圆的
     */
    drawAvatar(avatarUrl, x, y, size, complete) {
        let avatar = wx.createImage();
        avatar.src = avatarUrl ? avatarUrl : "openContexts/rescources/default_avatar.png";
        // TODO: 支持圆角头像
        avatar.onload = () => {
            this.context.save();
            this.context.drawImage(avatar, x, y, size, size);
            this.context.restore();
            if (typeof complete === 'function ') {
                complete();
            }
        }
    }

    /**
     * 初始化画布
     */
    initContexts() {
        this.context.restore();
        this.context.clearRect(0, 0, this.w, this.h);
    }

    /**
     * 获取好友数据，会转换后保存到this.friendsRankData并且返回
     * @param {Array<String>} keyList 键值列表
     */
    getFriendsRankData(keyList) {
        return promiseWx.getFriendCloudStorage(keyList)
            .then((res) => {
                this.friendsRankData = this.convertFriendsRankData(res.data);
                this.totalPageCount = Math.ceil(this.friendsRankData.length / this.pageSize);
                return this.friendsRankData;
            });
    }

    /**
     * 上传用户数据
     * @param {Object} data 要保存的数据，对象的每一个key都会转换为微信要求的KVDataList格式
     */
    setUserRankData(data) {
        return promiseWx.setUserCloudStorage(data);
    }
    setRankInfo(score) {
        if (!score) {
            return;
        }
        promiseWx.setUserCloudStorage({
            'score': score
        });
    }
    /**
     * 获取指定分页的用户好友数据
     * @param {Number} pageNum 页码
     * @param {Number} pageSize 分页大小
     */
    getPageOfFriendsData(pageNum, pageSize) {
        let startIndex = (pageNum - 1) * pageSize
        return this.friendsRankData.slice(startIndex, startIndex + pageSize);
    }

    /**
     * 将用户数据中KVDataList的数据转移到对象本身上以方便使用
     * @param {Object} userData 用户数据
     */
    convertUserData(userData) {
        let kvDataList = userData.KVDataList;
        for (const kvDataItem of kvDataList) {
            userData[kvDataItem.key] = kvDataItem.value;
        }
        return userData;
    }

    /**
     * 转换全部好友数据的KVDataList
     * @param {Array} friendsRankData 好友数据
     */
    convertFriendsRankData(friendsRankData) {
        for (const friendRankDataItem of friendsRankData) {
            this.convertUserData(friendRankDataItem);
        }
        return friendsRankData;
    }

}

new OpenContexts();
