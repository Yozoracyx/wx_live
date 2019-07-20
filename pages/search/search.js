const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    picUrl:"",//封面url前缀
    inputValue: "",
    inputFocus: false,
    showLiveView: true,
    showPlayerView: true,
    showAllPalyerView:true,
    showAllLivererView:true,
    fulldata: app.globaldata,
    playerArray: [{
      roomid: "99999",
      avatarurl: "../../images/live.png",
      nickname: "旭旭宝宝",
      playerTime: "2小时前",
      playerGame: "dnf",
      subscribeNum: "999.9万"
    }],
    allPlayListArray: [{
      roomid: 1,
      type: '地下城与勇士',
      anchorName: '旭旭宝宝',
      onlinenum: 50.5,
      title: '国服第一红眼',
      cover: '../../images/dnf.jpg'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var cid = options.cid;
    var status = Number(options.status);
    var type = options.type;
    var showAllLivererView = true;
    if(status == 1){//从首页输入框跳转
      showAllLivererView = true;
      this.setData({
        inputFocus:true
      })
    }else{//从首页分类跳转
      showAllLivererView = false;
    }
    var token = wx.getStorageSync("token");
    var that = this;
    this.setData({
      picUrl: app.globalData.picUrl,
      showAllPalyerView: true,
      showAllLivererView: showAllLivererView,
      inputValue: type
    })
    if (cid != 0 && cid != null && cid != undefined && cid != "") {
      cid = Number(cid);
      console.log(cid)
      wx.request({
        url: "https://" + app.globalData.requestUrl + '/web_service' + "/live_controller/get_live_by_category",
        header: {
          "Content-Type": "application/json",
          "token": token,
        },
        data: {
          "cid": cid
        },
        success: function(res) {
          var result = res.data;
          console.log(result)
          var status = result.status
          var showLiveView = that.data.showLiveView;
          if (status == 200) {
            var allPlayListArray = result.message;
            if (allPlayListArray.length == 0) {
              showLiveView = true;
            }else{
              showLiveView = false;
            }
            console.log(allPlayListArray);
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
              showLiveView: showLiveView
            })
            console.log(that.data.allPlayListArray);
          }
        },
        fail: function(err) {
          console.log(err)
          that.setData({
            disabled: false
          })
        }
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

  //取消
  cancel: function() {
    this.setData({
      inputValue: "",
      inputFocus: false
    })
  },
  //获取输入框的值
  saerchInput: function(e) {
    this.setData({
      inputValue: e.detail.value
    })
  },
  //搜索
  searchSubmit: function() {
    console.log("searchSubmit");
    var inputValue = this.data.inputValue;
    var token = wx.getStorageSync("token");
    var that = this;
    if (inputValue != null || inputValue != "" || inputValue != undefined) {
      wx.request({
        url: "https://" + app.globalData.requestUrl + '/web_service' + "/live_controller/search_by_key",
        header: {
          "Content-Type": "application/json",
          "token": token,
        },
        data: {
          "key": inputValue
        },
        success: function(res) {
          var result = res.data;
          console.log(result)
          var status = result.status
          if (status == 200) {
            var allPlayListArray = result.message.live;
            var playerArray = result.message.user;
            var showPlayerView = false;
            var showLiveView = false;
            if (playerArray.length == 0) {
              showPlayerView = true
            } else {
              showPlayerView = false
            }
            if (allPlayListArray.length == 0) {
              showLiveView = true
            } else {
              showLiveView = false
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
              showPlayerView: showPlayerView,
              showLiveView: showLiveView,
              showAllPalyerView:false,
              showAllLivererView:false
            })
          }
        },
        fail: function(err) {
          console.log(err)
          that.setData({
            disabled: false
          })
        }
      })
    }
  },
  //主播搜索
  searchPlayer: function(e) {
    var roomid = Number(e.currentTarget.id);
    console.log("searchPlayer:roomId:" + roomid)
    wx.navigateTo({
      url: "../player/player?roomid=" + roomid,
    })
  },
  //直播搜索
  searchAllPlay: function(e) {
    var roomid = Number(e.currentTarget.id);
    console.log("searchAllPlay:playId:" + roomid)
    wx.navigateTo({
      url: "../player/player?roomid=" + roomid,
    })
  },
})