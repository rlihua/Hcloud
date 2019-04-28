//index.js
const app = getApp()
const db = wx.cloud.database()
Page({
  data: {
    avatarUrl: './user-unlogin.png',
    userInfo: {},
    logged: false,
    takeSession: false,
    requestResult: ''
  },

  onLoad: function() {
    let that = this
    if (!wx.cloud) {
      wx.redirectTo({
        url: '../chooseLib/chooseLib',
      })
      return
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                userInfo: res.userInfo
              })
            }
          })
        }
      }
    })

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
  //查询openid是否已存在数据库，如果不存在写入数据库
  isOpenid: async function (openid) {
    let that = this
    let resOpenid = await that.isExitOpenid(openid)
    if(resOpenid.length <= 0) {
      let resDa = await that.addOpenid(openid)
    }
    console.log('最终结果')
    console.log(resOpenid)
    // console.log(resDa)
  },
  //添加openid到数据库
  addOpenid: function(openid) {
     return new Promise((resolve,reject) => {
      db.collection('user_info').add({
        data: {
          openid: openid,
          createtime: new Date()
        },
        success: res => {
          console.log('写入数据库成功')
          resolve(res)
        },
        fail: err => {
          console.log('写入失败')
          console.log(err)
        }
      })
    })
  },
  //判断该openid是否存在
   isExitOpenid: function(openid) {
    return new Promise((resolve,reject) => {
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
  onGetUserInfo: function(e) {
    if (!this.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        userInfo: e.detail.userInfo
      })
    }
  },

  onGetOpenid: function() {
    // 调用云函数
    wx.cloud.callFunction({
      name: 'login',
      data: {},
      success: res => {
        console.log('[云函数] [login] user openid: ', res.result.openid)
        app.globalData.openid = res.result.openid
        wx.navigateTo({
          url: '../userConsole/userConsole',
        })
      },
      fail: err => {
        console.error('[云函数] [login] 调用失败', err)
        wx.navigateTo({
          url: '../deployFunctions/deployFunctions',
        })
      }
    })
  },

  // 上传图片
  doUpload: function () {
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {

        wx.showLoading({
          title: '上传中',
        })

        const filePath = res.tempFilePaths[0]
        
        // 上传图片
        const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
        wx.cloud.uploadFile({
          cloudPath,
          filePath,
          success: res => {
            console.log('[上传文件] 成功：', res)

            app.globalData.fileID = res.fileID
            app.globalData.cloudPath = cloudPath
            app.globalData.imagePath = filePath
            
            wx.navigateTo({
              url: '../storageConsole/storageConsole'
            })
          },
          fail: e => {
            console.error('[上传文件] 失败：', e)
            wx.showToast({
              icon: 'none',
              title: '上传失败',
            })
          },
          complete: () => {
            wx.hideLoading()
          }
        })

      },
      fail: e => {
        console.error(e)
      }
    })
  },

})
