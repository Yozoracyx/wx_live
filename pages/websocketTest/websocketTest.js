// pages/fullScreenTest.js
const app = getApp();
var socketOpen = false;
var ws;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inputValue:"",
    danmakuContent:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.webSocket()
  },
  
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.deal();
  },

  webSocket: function () {
    var that = this;
    // 创建Socket
    ws = wx.connectSocket({
      url: "ws://" + app.globalData.liveUrl + ":8763" + "/websocket/chat/" + 1,
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function (res) {
        socketOpen = true;
        // console.log('WebSocket连接创建', res)
      },
      fail: function (err) {
        socketOpen = false;
        console.log(err)
      },
    })
    wx.onSocketOpen((res) => {
      socketOpen = true;
      console.log('WebSocket 成功连接', res)
    })
    //连接失败
    wx.onSocketError((err) => {
      socketOpen = false;
      console.log('websocket 连接失败', err);
      that.webSocket();
    })
  },

  deal:function(){
    var that = this;
    //WebSocket接受到服务器的消息
    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
    })
  },

  // 通过 WebSocket 连接发送数据
  sendSocketMessage: function (uid, roomid, danmakuContent) {
    var that = this
    if (socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify({
          "uid":uid,
          "roomid": roomid,
          "danmakuContent": danmakuContent
        }),
        success: function (res) {
          console.log(res)

          that.deal();
        },
        fail: function (res) {
          console.log(res)
        }
      })
    } else {
      socketMsgQueue.push(options.msg)
    }
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

  // 获取输入框内容
  danmakuInput: function (e) {
    var that = this;
    that.setData({
      danmakuContent: e.detail.value
    })
  },

  btnClick(){
    var danmakuContent = this.data.danmakuContent;
    var uid = 28;
    var roomid = 1;
    console.log(danmakuContent);
    console.log("socketOpen:" + socketOpen)
    if (socketOpen) {
      // 如果打开了socket就发送数据给服务器
      this.sendSocketMessage(uid,roomid,danmakuContent)
    }
  }
})
