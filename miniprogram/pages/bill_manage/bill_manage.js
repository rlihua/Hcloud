// miniprogram/pages/bill_manage/bill_manage.js
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
      date2: '2019-04-28'
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

  }
})