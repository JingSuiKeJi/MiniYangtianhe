const _g = require('../libs/base');
const _c = require('../libs/config');
const mini = _c.apiUrls;

//定义类
class Game {

    constructor() {

    }
    goldenEggsHome(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.game.goldenEggsHome,
            data: reqData
        }, page);
    }
    breakEgg(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.game.breakEgg,
            data: reqData
        }, page);
    }
    turnplateHome(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.game.turnplateHome,
            data: reqData
        }, page);
    }
    turnplateAction(page, reqData) {
        _g.dm.canLoadMore = 1;
        return _g.ajax({
            url: mini.game.turnplateAction,
            data: reqData,
            showToast: false,
            hideToast: true
        }, page);
    }
    
    
}

module.exports = new Game();