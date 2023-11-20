
let context = wx.getSharedCanvas().getContext('2d');
const danGradingCupConfig = require('./danGradingCupConfig.js');
    

function getDanGradingByScore(score) {
    let danGradingKeys = Object.keys(danGradingCupConfig);
    let danGrading = '';
    for (let i = danGradingKeys.length - 1; i >= 0; i--) {
        if (score >= danGradingCupConfig[danGradingKeys[i]]) {
            danGrading = danGradingKeys[i];
            break;
        }
    }
    return danGrading;
}


module.exports = {

    /**
     * 画一张图片
     * @param {String} imageUrl 图片Url
     * @param {Number} width 宽度
     * @param {Number} height 图片高度
     * @param {Number} x x坐标
     * @param {Number} y y坐标
     */
    drawImage(imageUrl, width, height, x, y, complete) {
        let img = wx.createImage();
        img.src = imageUrl;
        img.onload = () => {
            context.save();
            context.drawImage(img, x, y, width, height);
            context.restore();
            if (typeof complete === 'function') {
                complete();
            }
        }
    },
    
    /**
     * 画字
     * @param {String} text 文本
     * @param {Number} x x坐标
     * @param {Number} y y坐标
     * @param {String} font 字体
     * @param {String} color 颜色，默认#fff
     * @param {String} align 对齐方式，默认left
     */
    fillText(text, x, y, font, color = '#fff', align = 'left') {
        context.fillStyle = color;
        context.font = font;
        context.textAlign = align;
        context.fillText(text, x, y);
    },

    
    drawLine(x, y, length, color, width, isVertical = false) {
        let targetPoint;
        if (isVertical) {
            targetPoint = {
                x: x,
                y: y + length
            }
        } else {
            targetPoint = {
                x: x + length,
                y: y
            }
        }

        context.beginPath();//开始绘制线条，若不使用beginPath，则不能绘制多条线条
        context.moveTo(x, y);//线条开始位置
        context.lineTo(targetPoint.x, targetPoint.y);//线条经过点
        context.closePath();//结束绘制线条，不是必须的

        context.lineWidth = width;//设置线条宽度
        context.strokeStyle = color;//设置线条颜色
        context.stroke();//用于绘制线条
    },

    /**
     * 画矩形
     * @param {Number} x x坐标
     * @param {Number} y y坐标
     * @param {Number} width 宽度
     * @param {Number} height 高度
     * @param {Number} radius 圆角半径
     * @param {Number} lineWidth 线宽
     * @param {String} color 线条颜色
     */
    drawRoundedRect(x, y, width, height, radius, lineWidth = 2, color = '#fff', isFill = false) {
        let rect = {
            x,
            y,
            width,
            height
        };
        let ptA = point(rect.x + radius, rect.y);
        let ptB = point(rect.x + rect.width, rect.y);
        let ptC = point(rect.x + rect.width, rect.y + rect.height);
        let ptD = point(rect.x, rect.y + rect.height);
        let ptE = point(rect.x, rect.y);

        context.strokeStyle = color;
        context.lineWidth = lineWidth;
        context.beginPath();
        context.moveTo(ptA.x, ptA.y);
        context.arcTo(ptB.x, ptB.y, ptC.x, ptC.y, radius);
        context.arcTo(ptC.x, ptC.y, ptD.x, ptD.y, radius);
        context.arcTo(ptD.x, ptD.y, ptE.x, ptE.y, radius);
        context.arcTo(ptE.x, ptE.y, ptA.x, ptA.y, radius);
        if (isFill) {
            context.fill();
        } else {
            context.stroke();
        }
    },
    point(x, y) {
        return {
            x,
            y
        }
    },
    getDanGradingIcon(score) {
        let danGrading = getDanGradingByScore(score);
        danGrading = danGrading.replace(/[1-9]/, '');
        return `openContexts/resource/danGradingIcons/${danGrading}.png`;
    },
    getDanGradingText(score) {
        let danGrading = getDanGradingByScore(score);
        danGrading = danGrading.replace('Bronze', '青铜');
        danGrading = danGrading.replace('Silver', '白银');
        danGrading = danGrading.replace('Gold', '黄金');
        danGrading = danGrading.replace('Platnum', '铂金');
        danGrading = danGrading.replace('Diamond', '钻石');
        danGrading = danGrading.replace('Master', '大师');
        danGrading = danGrading.replace('Chanllenger', '王者');
        return danGrading;
    }
}