App({
  data: {
    procUrl: "wxapi.vastzhang.cn",
    devUrl: "192.168.0.113",
    proLiveUrl: "aliyun1.vastzhang.cn",
    devLiveUrl: "192.168.0.113",
    videoUrl: "video.vastzhang.cn",
    picUrl: "pic.vastzhang.cn",
    isOnline: true//true:线上，false:线下
  },
  onLaunch: function() {
    console.log("App launch!")
    var isOnline = false;
    //
    isOnline = this.data.isOnline;
    //
    if (isOnline) {
      this.globalData.requestUrl = this.data.procUrl
      this.globalData.liveUrl = this.data.proLiveUrl
      this.globalData.videoUrl = this.data.videoUrl
      this.globalData.picUrl = this.data.picUrl
    } else {
      this.globalData.requestUrl = this.data.devUrl
      this.globalData.liveUrl = this.data.devLiveUrl
      this.globalData.videoUrl = this.data.requestUrl
      this.globalData.picUrl = this.data.requestUrl
    }


    // this.doLogin()
  },
  doLogin: function(e) {
    wx.login({
      success: res => {
        const that = this
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: "https://" + this.globalData.requestUrl + '/web_service' + '/user/login',
            header: {
              'content-type': 'application/json' // 默认值
            },
            data: {
              code: res.code
            },
            success(res) {
              var resToken = res.data.token
              that.globalData.token = resToken
              console.log(that.globalData.token)
              console.log(res.data)
              wx.setStorageSync('uid', res.data.uid)
              wx.setStorageSync('token', resToken)
              wx.setStorageSync('hasRegister', res.data.hasRegister)
            },
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
  globalData: {
    token: "",
    userInfo: null,
    requestUrl: "",
    picUrl: "",
    videoUrl: ""
  }
})