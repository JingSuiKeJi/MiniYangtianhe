/**
 * Created by hou on 19/05/2017.
 */
function config() {
}

config.prototype = {

    debug: true,
    // debug: false,
    version: '1.0.1', // 版本号 正式: v1.0.0 体验: v0.0.1
    appName: '养天和', // 内容展示小程序

    tokenKey: '',

    // env: 'dev', // 切换版本(提交正式必须改为 pro): dev 开发 | test  测试 | pro 生产
    env: 'test', // 切换版本(提交正式必须改为 pro): dev 开发 | test  测试 | pro 生产
    // env: 'pro', // 切换版本(提交正式必须改为 pro): dev 开发 | test  测试 | pro 生产

    defaultPage: 1,// 页码 默认1
    defaultPageSize: 15,// 每页数 默认15
    appId: 'wxbded9a418bae447e',// appId
    appIndex: 'pages/home/index',// app的第一个页面, 分享时如果没定义那个页面就默认分享这个配置的页面
    shareTitle: '',// app分享时的公共title

    /**
     * 服务器地址
     */
    host: {
        // test: 'http://192.168.199.108:9537',
        // test: 'http://123.207.33.101:10008', // 测试
        test: 'http://120.79.36.152:10008', // 测试
        pro: 'https://app.yth-yx.com', // 生产
        dev: 'http://localhost:9528', // 开发
    },

    formIdType: {
        // 导航
        navigation: 1,
    },

    /**
     * local storage keys对象
     */
    sessionKeyExpireTime: 1000 * 60 * 60 * 24 * 7 - 5000,
    promoCodeExpireTime: 1000 * 60 * 60 * 24 * 7 ,
    LSKeys: {
        sessionKey: 'sessionKey',
        userInfo: 'userInfo',
        promoCode: 'promoCode',
        checkLogin: 'checkLogin_{today}',
        systemInfo: 'systemInfo',
        storeInfo: 'storeInfo',
        shareQRCode: 'shareQRCode',
    },

    pages: {
        home: {
            index: 'pages/home/index'
        }
    },

    /**
     * 接口地址对象
     */
    apiUrls: {
        ajaxUpload: '/app/ajaxUpload.do', // 参数为 base64Str
        //平台相关
        platfrom: {
            getCurrTime: '/app/common/getCurrTime.do',
            getCommonData: '/app/home/getCommonData.do',
            getSecKill: '/app/home/getSecKill.do',
            getRecommend: '/app/home/getRecommend.do',
            getStoreList: '/app/home/getStoreList.do',
            getStoreInfo: '/app/home/getStoreInfo.do',
            getClassifyList: '/app/classify/getClassifyList.do',
            getBrandList: '/app/brand/getBrandList.do',
            getGoodsList: '/app/goods/getGoodsList.do',
            getOccasion:'/app/assemble/getOccasion.do',
            getArticle: '/app/common/getArticle.do',
            getStepInfo: '/app/step/getStepInfo.do',
            uploadStep: '/app/step/uploadStep.do',
            getShareQR: '/app/common/getShareQR.do',
            uploadStep: '/app/step/uploadStep.do',
            formId: '/app/common/saveFormId.do'
        },
        user: {
            login: '/app/account/login.do',
			logout:'/app/account/logout.do',
            getMyInfo: '/app/user/getMyInfo.do',
            getLeyouList: '/app/step/getLeyouList.do',
            getRecordList: '/app/step/getRecordList.do',
            getAddressAdd: '/app/address/add.do', 
			update:'/app/address/update.do',
            getAddressList: '/app/address/list.do',
			bindWX:'/app/user/bindWX.do',
			sendCode:'/app/user/sendCode.do',
            bindPhone:'/app/user/bindPhone.do',
			bindRecommend:'/app/user/bindRecommend.do',
            getPoster:'/app/common/getPoster.do',
            msgToggle:'/app/user/msgToggle.do',
            getCouponList:'/app/user/getCouponList.do',
            getCompanyList:'/app/store/getCompanyList.do',
            apply:'/app/store/apply.do',
            getCompanyList:'/app/store/getCompanyList.do',
            apply:'/app/store/apply.do',
            msgToggle:'/app/user/msgToggle.do',
            getBaseInfo:'/app/store/getBaseInfo.do',
            getClientList:'/app/store/getClientList.do',
            getClientDetail:'/app/store/getClientDetail.do',
            getClientAddress:'/app/store/getClientAddress.do',
            getClientOrder:'/app/store/getClientOrder.do',
            getLeyouList: '/app/step/getLeyouList.do',
            chooseDefault: '/app/address/chooseDefault.do',
            deleteAddress: '/app/address/delete.do',
            myCommentList: '/app/comment/list.do',
            deleteComment: '/app/comment/delete.do',
			getVerifierList:'/app/store/getVerifierList.do',
			deleteVerifier:'/app/store/deleteVerifier.do',
			searchVerifier:'/app/store/searchVerifier.do',
			addVerifier:'/app/store/addVerifier.do',
			getOrderList:'/app/store/getOrderList.do',
			getOrderDetail:'/app/store/getOrderDetail.do',
			verification:'/app/order/verifyOrder.do',
			myCommentList: '/app/comment/list.do',
            deleteComment: '/app/comment/delete.do',
			getFinanceInfo:'/app/store/getFinanceInfo.do',
			getVerifierInfo:'/app/store/getVerifierInfo.do',
			getVerifierQR:'/app/store/getVerifierQR.do',
			getCommissionBaseInfo:'/app/distribution/getBaseInfo.do',
			getCommissionClientList:'/app/distribution/getClientList.do',
            getCommissionRecordList:'/app/distribution/getRecordList.do',
            verifyOrder: '/app/order/findVerifyOrder.do',
            rankingList: '/app/step/rankingList.do'

            
        },
        goods: {
            getGoodsDetail: '/app/goods/getGoodsDetail.do',
            addCart: '/app/cart/add.do',
            cartList: '/app/cart/list.do',
            addNum: '/app/cart/addNum.do',
            subtractNum: '/app/cart/subtractNum.do',
            deleteCart: '/app/cart/delete.do',
            batchDeleteCart: '/app/cart/batchDelete.do',
            getOccasion:'/app/assemble/getOccasion.do',
            getAssembleList:'/app/assemble/getAssembleList.do',
            getUserAssembleList:'/app/assemble/getUserAssembleList.do',
            getCommentList: '/app/goods/getCommentList.do',
            getBrandDetail:'/app/brand/getBrandDetail.do',
            getHotSearchList: '/app/home/getHotSearchList.do',
            listCut: '/app/cut/listCut.do',
            cutDetail: '/app/cut/details.do',
            createCut: '/app/cut/createCut.do',
            helpCut: '/app/cut/helpCut.do',
            myCut: '/app/cut/myCut.do',
        },
        store: {
            storeList: '/app/home/getStoreList.do',
            applyDetail: '/app/store/applyDetail.do',
            updateApply: '/app/store/updateApply.do',
            selectStore: '/app/home/selectStore.do'
        },
        order: {
            placeOrder: '/app/order/placeOrder.do',
            preOrder: '/app/preOrder/common.do',
            addressList: '/app/preOrder/addressList.do',
            commentOrder: '/app/order/commentOrder.do',
            myOrderList: '/app/order/myOrderList.do',
            myOrderDetail: '/app/order/myOrderDetail.do',
            cancelOrder: '/app//order/cancelOrder.do',
            confirmOrder: '/app//order/confirmOrder.do',
            prePay: '/pay/order/prePay.do',
            preOrderCart: '/app/preOrder/cart.do',
            getDeliveryTime: '/app/preOrder/getDeliveryTime.do',
            goodsCouponList: '/app/preOrder/couponList.do',
            preferentialPolicies: '/app/preOrder/preferentialPolicies.do',
            

        },
        point: {
            getBaseInfo: '/app/points/getBaseInfo.do',
            prePay: '/pay/points/prePay.do',
            charge: '/app/points/charge.do',
            getRecordList: '/app/points/getRecordList.do',
            gift: '/app/points/gift.do',
            verifier: '/app/points/verifier.do',
        }
    }

};

config.prototype.constructor = config;
module.exports = new config();
