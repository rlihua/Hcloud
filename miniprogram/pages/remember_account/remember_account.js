// miniprogram/pages/remember_account/remember_account.js
const db = wx.cloud.database()
const util = require('../../units/units.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id:'',
        date1: '2019-05-09',
        labelArr: ['支付宝大', '微信', '建设银行', '招商银行','支付宝小','建设基金'],
        index: 0,
        price: '',
        totalPrice: 0,
        isShow: false,
        accountItem: null,
        focus: false,
        accountGroup: []
            /*{'label':'微信支付','price':'100'},
            {'label':'支付宝支付','price':'100'}*/
        ,
        account: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.account){
            let account = JSON.parse(options.account)
            this.setData({
                account: account,
                accountGroup: account.accountGroup,
                date1: account.recordDate,
                id: account._id,
                totalPrice: account.totalPrice
            })
        }
        this.setData({
            date1: util.myFormatDate(new Date(),2)
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
    onShow: function (options) {
         
        console.log('show')
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
//  分类的选择
    bindPickerChange: function (e) {
        this.setData({
            index: e.detail.value.replace(/\s+/g, '')
        })
    },
    changePrice: function (e) {
        this.setData({
            price: e.detail.value.replace(/\s+/g, '')
        })
    },
    //加一个单据触发事件
    addAccountItem: function () {
        let that = this
        that.setData({
            isShow: true,
            focus: true,
            price: '',
            index: ''
        })
    },
    doClose: function () {
        this.setData({
            isShow: false
        })
    },
    doEnsure: function () {
        let that = this,
            price = that.data.price,
            index = that.data.index,
            item = new Object(),
            labelArr = that.data.labelArr,
            accountGroup = that.data.accountGroup,
            label = null
        if(!price) {
            wx.showModal({
                title: '提示',
                content: '请输入金额',
                showCancel: false,
                success: (res) => {
                    if (res.confirm) {
                        that.setData({
                            focus: true
                        })
                    }
                }
            })
            return false;
        }
        if(!index) {
            wx.showModal({
                title: '提示',
                content: '请选择分类',
                showCancel: false
            })
            return false;
        }
        label = labelArr[index]
        //判断如果分类已经存在了，提示
        for(let i=0;i<accountGroup.length;i++) {
            if(accountGroup[i]['label'] == label){
                wx.showModal({
                    title: '提示',
                    content: '该分类已经存在',
                    showCancel: false
                })
                return false
            }
        }
        item['price'] = price
        item['label'] = label
        accountGroup.push(item)
        that.setData({
            accountGroup: accountGroup,
            isShow: false
        })
        that.countTotalPrice()
    },
    //计算总金额
    countTotalPrice: function () {
        let that = this,accountGroup = that.data.accountGroup,totalPrice = 0
        for(let i=0;i<accountGroup.length;i++) {
            totalPrice += Number(accountGroup[i]['price'])
        }
        that.setData({
            totalPrice: totalPrice
        })
    },
    submitAccount: function () {
        let that = this,accountGroup = that.data.accountGroup
        if(accountGroup.length <= 0){
            wx.showModal({
                title: '提示',
                content: '请添加单据',
                showCancel: false
            })
            return false
        }
        wx.showModal({
            title: '提示',
            content: '是否保存',
            success: (res) => {
                if (res.confirm) {
                    that.doSubmitMain()
                }
            }
        })
    },
    doSubmitMain: function () {
        let that = this,
            id = that.data.id,
            date1 = that.data.date1,
            accountGroup = that.data.accountGroup
            wx.cloud.callFunction({
                name: 'add_account',
                data: {id:id,recordDate:date1,accountGroup:accountGroup},
                success: res => {
                    console.log(res)
                    // console.log('[云函数] [login] user openid: ', res.result.sum)
                },
                fail: err => {
                    console.error('[云函数] [login] 调用失败', err)
                }
            })
    },
    doDel: function (e) {
        console.log(e)
        let itemid = e.currentTarget.dataset.itemid,
            that = this,
            accountGroup = that.data.accountGroup,
            newAccountGroup = []
        newAccountGroup = accountGroup.filter((item,index) => {
            if(index != itemid) {
                return item
            }
        })
        that.setData({
            accountGroup: newAccountGroup
        })
        that.countTotalPrice()
        console.log('新')
        console.log(newAccountGroup)
    }
})