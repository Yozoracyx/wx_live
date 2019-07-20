//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    isRegister: true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.doLogin();
    this.setData({
      isRegister: true,
      buttonValue: "welcome",
    })
  },

  doLogin: function(e) {
    wx.login({
      success: res => {
        const that = this
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: "https://" + app.globalData.requestUrl + '/web_service' + '/user/login',
            header: {
              'content-type': 'application/json' // 默认值
            },
            data: {
              code: res.code
            },
            success(res) {
              var result = res.data
              var resToken = result.message.token;
              console.log(result);
              wx.setStorageSync('uid', result.message.uid)
              wx.setStorageSync('token', resToken)
              var nickName = result.message.nickname;
              var avatarUrl = result.message.avatarurl;
              that.doRegister(result.message.hasRegister);
            },
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  doRegister(hasRegister) {
    var that = this;
    if (hasRegister) {
      wx.switchTab({
        url: '../index_page/index_page'
      });
    } else {
      that.setData({
        isRegister: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  //获取用户信息
  getUserInfo: function(e) {
    var userInfo = e.detail.userInfo
    app.globalData.userInfo = e.detail.userInfo
    // wx.setStorageSync('userInfo', e.detail.userInfo)
    console.log(app.globalData.userInfo);
    var token = wx.getStorageSync('token');
    var uid = wx.getStorageSync('uid');
    var nickName = userInfo.nickName;
    var avatarUrl = userInfo.avatarUrl;
    wx.setStorageSync('nickName', nickName)
    wx.setStorageSync('avatarUrl', avatarUrl)
    var gender = userInfo.gender;
    var language = userInfo.language;
    var city = userInfo.city;
    var province = userInfo.province;
    var country = userInfo.country;
    this.setData({
      userInfo: e.detail.userInfo
    })
    // request userInfo
    wx.request({
      url: "https://" + app.globalData.requestUrl + '/web_service' + "/user/register",
      header: {
        "Content-Type": "application/json",
        "token": token,
      },
      data: {
        "uid": uid,
        "nickName": nickName,
        "gender": gender,
        "language": language,
        "city": city,
        "province": province,
        "avatarUrl": avatarUrl,
        "country": country
      },
      success: function(res) {
        var result = res.data;
        console.log(result)
        var status = result.status
        if (status == 200) {
          wx.switchTab({
            url: '../index_page/index_page'
          });
        }
      },
      fail: function(err) {
        console.log(err)
        that.setData({
          isRegister:true
        })
      }
    })
  }
})