// miniprogram/pages/myIndex/myIndex.js
const app = getApp()
const db = wx.cloud.database()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        labelGroup: [
            {'title': '账单管理', 'page': '../bill_manage/bill_manage', 'img': '../../common/images/icons/bill.png'},
            {'title': '挣零花钱', 'page': '../earn_money', 'img': '../../common/images/icons/bill.png'},
            {'title': '失物招领', 'page': '../earn_money', 'img': '../../common/images/icons/bill.png'},
            {'title': '同城说说', 'page': '../earn_money', 'img': '../../common/images/icons/bill.png'},
            {'title': '同城刷刷', 'page': '../earn_money', 'img': '../../common/images/icons/bill.png'},
            {'title': '你好刷刷', 'page': '../earn_money', 'img': '../../common/images/icons/bill.png'},
            {'title': '萌宠世界', 'page': '../earn_money', 'img': '../../common/images/icons/bill.png'},
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this
        wx.cloud.callFunction({
          name: 'login',
          data: {a:1,b:2},
          success: res => {
            console.log(res)
            that.isOpenid(res.result.openid)
            console.log('[云函数] [login] user openid: ', res.result.sum)
          },
          fail: err => {
            console.error('[云函数] [login] 调用失败', err)

          }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },
    //查询openid是否已存在数据库，如果不存在写入数据库
    isOpenid: async function (openid) {
        let that = this
        let resOpenid = await that.isExitOpenid(openid)
        if (resOpenid.length <= 0) {
            let resDa = await that.addOpenid(openid,that)
        }
        console.log('最终结果')
        console.log(resOpenid)
        // console.log(resDa)
    },
    //添加openid到数据库
    addOpenid: function (openid,that) {
        return new Promise((resolve, reject) => {
            db.collection('user_info').add({
                data: {
                    openid: openid,
                    createtime: new Date()
                },
                success: res => {
                    console.log('写入数据库成功')
                    that.addLabelGroup(openid)
                    resolve(res)
                },
                fail: err => {
                    console.log('写入失败')
                    console.log(err)
                }
            })
        })
    },
    //添加标签
    addLabel: function (openid,label) {
        return new Promise((resolve, reject) => {
            db.collection('label_info').add({
                data: {
                    openid: openid,
                    createtime: new Date(),
                    label: label
                },
                success: res => {
                    console.log('标签写入数据库成功')
                    resolve(res)
                },
                fail: err => {
                    console.log('标签写入失败')
                    console.log(err)
                }
            })
        })
    },
    addLabelGroup1: async function(openid) {
        let that = this,promiseArr
        promiseArr = await that.getLabelGroup(openid)

    },
    addLabelGroup: async function (openid) {
        let labelArr = ['微信','支付宝','建设银行'],that = this,promiseArr = []
        for(let i=0;i<labelArr.length; i++) {
            await that.addLabel(openid,labelArr[i])
        }
        // return promiseArr
    },
    //判断该openid是否存在
    isExitOpenid: function (openid) {
        return new Promise((resolve, reject) => {
            db.collection('user_info').where({
                openid: openid
            }).get({
                success: res => {
                    console.log('查询的结果集')
                    console.log(res)
                    resolve(res.data)
                },
                fail: err => {
                    wx.showToast({
                        icon: 'none',
                        title: '查询记录失败'
                    })
                }
            })
        })
    },
})