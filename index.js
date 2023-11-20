/**
 * 设置LayaNative屏幕方向，可设置以下值
 * landscape           横屏
 * portrait            竖屏
 * sensor_landscape    横屏(双方向)
 * sensor_portrait     竖屏(双方向)
 */
window.screenOrientation = "sensor_landscape";

// 警告：libs-begin 注释的内容不能删除，需要被识别并复制的小游戏环境
//-----libs-begin-----
loadLib("libs/laya.core.js")
loadLib("libs/laya.webgl.js")
loadLib("libs/laya.ui.js")
loadLib("libs/laya.ani.js")
window.Matter = loadLib("libs/matter.min.js");
window.dayjs = loadLib("libs/dayjs.min.js");
// loadLib("libs/tt-adapter.js");
// loadLib("libs/ald-game.js");
// loadLib("libs/ald-game-conf.js");
//-----libs-end-------
loadLib("config/commonConfig.js");

loadLib("js/bundle.js");
