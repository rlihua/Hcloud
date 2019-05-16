// miniprogram/pages/bill_manage/bill_manage.js
const app = getApp()
const db = wx.cloud.database()
const _ = db.command
const util = require('../../units/units.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    startDate: '2009-01-01',//默认起始时间
    endDate: '2050-01-01',//默认结束时间D
    dataGroup: [
      {'id': '1','createDate': '2018-01-11 20:11:01','recordDate': '2018-03-22','totalPrice': '200'},
      {'id': '2','createDate': '2018-01-11 20:11:01','recordDate': '2018-02-22','totalPrice': '200'},
      {'id': '3','createDate': '2018-01-11 20:11:01','recordDate': '2018-01-22','totalPrice': '200'},
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date1: '2019-04-22',
      date2: '2019-05-09'
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
    this.doQuery()
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
  // 时间段选择
  bindDateChange(e) {
    let that = this;
    console.log(e.detail.value)
    that.setData({
      date1: e.detail.value,
    })
  },
  bindDateChange2(e) {
    let that = this;
    that.setData({
      date2: e.detail.value,
    })
  },
  //查询事件
  doQuery: function () {
    let that = this,
    openid = 'oKc-K5Xgg1vztCQM8_O8s2Nx8n6Y',
    date1 = that.data.date1,
    date2 = that.data.date2
    console.log(new Date(date1 + ' 00:00:00'))
    console.log(date2)
    db.collection('account_water').where({
      openid: openid,
      recordDate: _.gte(new Date(date1 + ' 00:00:00')).and(_.lte(new Date(date2 + ' 23:59:59')))
    }).orderBy('recordDate','desc').get({
      success: res => {
        console.log(res)
        let newData = that.dataHandle(res.data)
        if(newData){
          that.setData({
            dataGroup: newData
          })
        }
        console.log(newData)
        /*that.setData({
          dataGroup:res
        })*/
      }
    })
  },
  dataHandle: function(data){
    let that = this,totalPrice = 0,accountGroup = null,newData = null
    newData = data.filter((item,index) => {
      accountGroup = item['accountGroup']
      totalPrice = 0
      accountGroup.forEach((v,k) => {
        totalPrice += Number(v['price'])
      })
      item['totalPrice'] = totalPrice
      item['recordDate'] = that.formatDate(item['recordDate'],2)
      item['createDate'] = that.formatDate(item['createDate'],1)
      return item
    })
    return newData
  },
  // flag 1表示显示时分秒  2表示不显示
  formatDate: function(date,flag = 1){
    let that = this,
        d = new Date(date),
        year = d.getFullYear(),
        month = that.preAdd((d.getMonth() + 1)),
        day =  that.preAdd(d.getDate()),
        hour = that.preAdd(d.getHours()),
        minute = that.preAdd(d.getMinutes()),
        seconds = that.preAdd(d.getSeconds()),
        newDate = year + '-' + month + '-' + day,
    datetime = flag == 2? newDate : newDate + ' ' + hour + ':' + minute + ':' + seconds
    return datetime;
  },
  preAdd(value) {
    return value < 10 ? '0' + value : value
  },
  gotoAccount: function(e) {
    let that = this,account = e.currentTarget.dataset.account
    wx.navigateTo({
      url: '/pages/remember_account/remember_account?account='+JSON.stringify(account)
    })
    console.log(e)
    console.log(account)
  }
})