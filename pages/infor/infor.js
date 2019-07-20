//index.js
//获取应用实例
const app = getApp()
Page({
  data: {
    motto: 'Hello',
    userInfo: {},
    hasUserInfo: false,
    avatarUrl:"",
    userName: "",
    picUrl: "",
    token: app.globalData.token,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    hiddenPlayingLive: true,//有无正在直播的已订阅直播间（true隐藏-无/false显示-有,allPlayListArray是否为空）
    hiddenPlayer: true,//有无未开播的已订阅主播（true隐藏-无/false显示-有,playerArray是否为空）
    allPlayListArray: [{
      roomid: 1,
      type: '地下城与勇士',
      anchorName: '旭旭宝宝',
      onlinenum: 50.5,
      title: '国服第一红眼',
      cover: '../../images/dnf.jpg'
    }],
    playerArray: [{
      roomid: "99999",
      avatarurl: "../../images/live.png",
      nickname: "旭旭宝宝",
      playerTime: "2小时前",
      playerGame: "dnf",
      subscribeNum: "999.9万"
    }]
  },
  onLoad: function() {
    var userInfo = wx.getStorageSync('userInfo')
    this.setData({
      userInfo: userInfo,
      picUrl: app.globalData.picUrl
    })
    this.initInfo();
    var nickName = wx.getStorageSync('nickName')
    var avatarUrl = wx.getStorageSync('avatarUrl')
    this.setData({
      avatarUrl: avatarUrl,
      userName: nickName
    })
    // if (app.globalData.userInfo) {
    //   this.setData({
    //     userInfo: app.globalData.userInfo,
    //     hasUserInfo: true
    //   })
    // } else if (this.data.canIUse) {
    //   // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
    //   // 所以此处加入 callback 以防止这种情况
    //   app.userInfoReadyCallback = res => {
    //     this.setData({
    //       userInfo: res.userInfo,
    //       hasUserInfo: true
    //     })
    //   }
    // } else {
    //   // 在没有 open-type=getUserInfo 版本的兼容处理
    //   wx.getUserInfo({
    //     success: res => {
    //       app.globalData.userInfo = res.userInfo
    //       this.setData({
    //         userInfo: res.userInfo,
    //         hasUserInfo: true
    //       })
    //     }
    //   })
    // }
  },
  onShow:function(){
    this.initInfo();
  },
  initInfo(){
    var uid = wx.getStorageSync('uid');
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: "https://" + app.globalData.requestUrl + '/web_service' + "/live_controller/get_my_subscribe",
      header: {
        "Content-Type": "application/json",
        "token": token,
      },
      data: {
        "uid": uid
      },
      success: function (res) {
        var result = res.data;
        console.log(result)
        var status = result.status

        if (status == 200) {
          var allPlayListArray = result.message.live;
          var playerArray = result.message.user;
          var hiddenPlayer = false;
          var hiddenPlayingLive = false;
          if (playerArray.length == 0) {
            hiddenPlayer = true
          } else {
            hiddenPlayer = false
          }
          if (allPlayListArray.length == 0) {
            hiddenPlayingLive = true
          } else {
            hiddenPlayingLive = false
          }
          for (var index = 0; index < allPlayListArray.length; index++) {
            var coverSrc = allPlayListArray[index].coverSrc;
            if (coverSrc == "" || coverSrc == null || coverSrc == undefined) {
              allPlayListArray[index].coverSrc = "../../images/cover.png"
            } else {
              allPlayListArray[index].coverSrc = "http://" + that.data.picUrl + coverSrc;
            }
          }
          that.setData({
            allPlayListArray: allPlayListArray,
            playerArray: playerArray,
            hiddenPlayer: hiddenPlayer,
            hiddenPlayingLive: hiddenPlayingLive
          })
        }
      },
      fail: function (err) {
        console.log(err)
        that.setData({
          disabled: false
        })
      }
    })
  },
  searchAllPlay(e){
    var roomid = Number(e.currentTarget.id);
    console.log("searchAllPlay:playId:" + roomid)
    wx.navigateTo({
      url: "../player/player?roomid=" + roomid,
    })
  },
  searchPlayer(e){
    var roomid = Number(e.currentTarget.id);
    console.log("searchPlayer:playId:" + roomid)
    wx.navigateTo({
      url: "../player/player?roomid=" + roomid,
    })
  },
  doLogin: function(e) {
    wx.login({
      success: res => {
        const that = this
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: "https://" + app.globalData.requestUrl + '/web_service'+'/user/login',
            header: {
              'content-type': 'application/json' // 默认值
            },
            data: {
              code: res.code
            },
            success(res) {
              var resToken = res.data.token
              app.globalData.token = resToken
              console.log(app.globalData.token)
              console.log(res.data)
              that.setData({
                token: resToken
              })
            },
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

})