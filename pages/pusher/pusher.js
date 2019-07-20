const app = getApp()

var socketOpen = false;
var ws;
var socketMsgQueue = [];
Page({
  data: {
    token: app.globalData.token,
    pushSrc: "",
    roomid: 0,
    onlinenum: 0,
    title: "欢迎来到我的直播间", //直播间标题
    preLivePusherHeight: 0, //原先直播间高度rpx
    livePusherHeight: 0, //直播间高度rpx
    pusherStatus: true, //推流状态（true/成功,false/失败）
    userName: 'yozora',
    danmakuListData: [], //弹幕列表集合
    danmakuContent: '', //弹幕内容
    scrollTop: 0, //滚动条位置
    windowHeight: 0, //手机屏幕高度px
    windowWidth: 0, //手机屏幕宽度px
    inputValue: '', //输入框的值
    showNewDnamakuRemind: false, //新弹幕提醒
    setTimer: '', //计时器
    playFlag: false, //开始/停止直播
    false: false,
    bottom: 0,
    rightVewLeft: 0, //
    hiddenDanmakuSubmitView: false, //隐藏底部发送弹幕view
    hiddenDefault: false, //隐藏默认view（手机竖屏直播方向）
    hidenClockwise90: true, //隐藏顺时针90度后的view(手机横屏直播默认方向)
    hidenAntiClockwise90: true, //隐藏逆时针90度后的view（手机横屏直播切换摄像头方向）
  },

  onLoad: function(options) {

  },

  onReady(res) {
    this.ctx = wx.createLivePusherContext('pusher')
    this.changePushSrc();
    let that = this;
    var title = wx.getStorageSync('title')
    var token = wx.getStorageSync('token')
    var uid = Number(wx.getStorageSync('uid'))
    var orientationValue = wx.getStorageSync('orientationValue');
    var hiddenDanmakuSubmitView = false;
    var hidenClockwise90 = true;
    var hiddenDefault = false;
    wx.getSystemInfo({
      success: function(res) {
        let windowHeight = (res.windowHeight * (750 / res.windowWidth));
        var windowHeightPx = res.windowHeight;
        var windowWidthtPx = res.windowWidth;
        if (orientationValue == "横屏直播") {
          hiddenDanmakuSubmitView = true;
          hidenClockwise90 = false;
          hiddenDefault = true;
        } else {
          windowHeight = windowHeight - 70;
        }
        that.setData({
          windowHeight: windowHeightPx,
          windowWidth: windowWidthtPx,
          livePusherHeight: windowHeight,
          preLivePusherHeight: windowHeight,
          hiddenDanmakuSubmitView: hiddenDanmakuSubmitView,
          hidenClockwise90: hidenClockwise90,
          hiddenDefault: hiddenDefault,
          title: title,
          token: token,
          uid: uid
        })
      }
    })
    this.webSocket();
    this.deal();
  },

  onShow: function() {
    var title = wx.getStorageSync("title");
    var that = this;
    if (title != "" && title != undefined && title != null) {
      that.setData({
        title: title
      })
    }
  },
  onUnload: function() {
    console.log("onUnload")
    danmakuListList = [];
    this.setData({
      danmakuListData: danmakuListList
    })
    if (socketOpen) {
      wx.closeSocket(function(res) {
        socketOpen = false;
        console.log('WebSocket 已关闭！')
      })
    }
    console.log("socketOpen:" + socketOpen)
    socketOpen = false;
  },
  statechange(e) {
    var code = e.detail.code;
    var sysCode = "Sysytem: " + code;
    var sysMsg = e.detail.message;
    console.log('live-pusher code:', e.detail.code, ":" + sysMsg);
    if (Number(code) == 1007) {
      addDanmakuList(sysCode, sysMsg, "#ff8000", "#ff8000", 0);
      danmakuListContainerViewPusher_right_left();
      this.setData({
        danmakuListData: danmakuListList
      })
    }
  },
  startAndStop: function() {
    var playFlag = this.data.playFlag;
    if (playFlag) {
      this.bindStart()
    } else {
      this.bindStop()
    }
    this.setData({
      playFlag: !playFlag
    })
  },
  bindStart() {
    this.ctx.start({
      success: res => {
        console.log('start success')
      },
      fail: res => {
        console.log('start fail')
      }
    })
  },
  bindPause() {
    this.ctx.pause({
      success: res => {
        console.log('pause success')
      },
      fail: res => {
        console.log('pause fail')
      }
    })
  },
  bindStop() {
    this.ctx.stop({
      success: res => {
        console.log('stop success')
      },
      fail: res => {
        console.log('stop fail')
      }
    })
  },
  bindResume() {
    this.ctx.resume({
      success: res => {
        console.log('resume success')
      },
      fail: res => {
        console.log('resume fail')
      }
    })
  },
  bindSwitchCamera() {
    var that = this;
    var hidenClockwise90 = this.data.hidenClockwise90;
    var hidenAntiClockwise90 = this.data.hidenAntiClockwise90;
    var orientationValue = wx.getStorageSync('orientationValue');
    this.ctx.switchCamera({
      success: res => {
        console.log('switchCamera success')
        if (orientationValue == "横屏直播") {
          wx.showModal({
            title: '已切换摄像头',
            content: '画面已旋转，请旋转手机',
            success: function(res) {
              if (res.confirm) { //这里是点击了确定以后
                console.log('用户点击确定')
              } else { //这里是点击了取消以后
                console.log('用户点击取消')
              }
            }
          })
          that.setData({
            hidenClockwise90: !hidenClockwise90,
            hidenAntiClockwise90: !hidenAntiClockwise90
          })
        }
        wx.showToast({
          title: '已切换摄像头位置',
          icon: 'none',
          duration: 2000 //持续的时间
        })
      },
      fail: res => {
        console.log('switchCamera fail')
      }
    })
  },
  editClick: function() {
    wx.navigateTo({
      url: '../edit/edit',
    })
  },
  changePushSrc: function() {
    var token = wx.getStorageSync("token");
    var roomid = Number(wx.getStorageSync('roomid'));
    this.setData({
        roomid: roomid,
        token: app.globalData.token,
        pushSrc: 'rtmp://' + app.globalData.liveUrl + '/live/' + roomid + '?token=' + token
      }),
      console.log(this.data.pushSrc)
  },
  // 获取输入框内容
  danmakuInput: function(e) {
    this.setData({
      danmakuContent: e.detail.value
    })
  },
  inputFocus(e) {
    console.log(e, '键盘弹起')
    var that = this;
    var inputHeight = 0;
    if (e.detail.height) {
      inputHeight = e.detail.height
      var livePusherHeight = that.data.preLivePusherHeight - inputHeight
      console.log('prelivePusherHeight', that.data.livePusherHeight)
      console.log('inputHeight', inputHeight)
      that.setData({
        bottom: inputHeight,
        // livePusherHeight: livePusherHeight
      })
    }
    console.log('livePusherHeight', this.data.livePusherHeight)
  },
  inputBlur() {
    console.log('键盘收起')
    var livePusherHeight = this.data.preLivePusherHeight
    this.setData({
      bottom: 0,
      livePusherHeight: livePusherHeight
    })
  },

  webSocket: function() {
    var that = this;
    var roomid = this.data.roomid;
    console.log(roomid)
    // 创建Socket
    ws = wx.connectSocket({
      url: "wss://" + app.globalData.requestUrl + ":8764" + "/websocket/chat/" + roomid,
      header: {
        'content-type': 'application/json'
      },
      method: 'post',
      success: function(res) {
        socketOpen = true;
        // console.log('WebSocket连接创建', res)
      },
      fail: function(err) {
        socketOpen = false;
        console.log(err)
      },
    })
    wx.onSocketOpen((res) => {
      socketOpen = true;
      console.log('WebSocket 成功连接', res)
      addDanmakuList("WebSocket", 'WebSocket 成功连接', "#ff8000", "#ff8000", 0);
      danmakuListContainerViewPusher_right_left();
      this.setData({
        danmakuListData: danmakuListList
      })
    })
    //连接失败
    wx.onSocketError((err) => {
      socketOpen = false;
      console.log('websocket 连接失败', err);
      addDanmakuList("WebSocket", 'WebSocket 连接失败', "#ff8000", "#ff8000", 0);
      danmakuListContainerViewPusher_right_left();
      this.setData({
        danmakuListData: danmakuListList
      })
      that.webSocket();
    })
  },

  deal: function() {
    var that = this;
    //WebSocket接受到服务器的消息
    wx.onSocketMessage(function(res) {
      var result = JSON.parse(res.data);
      console.log('收到服务器内容：')
      console.log(result);
      var userName = result.name;
      var danmakuContent = result.danmakuContent;
      var danmakuListData = that.data.danmakuListData;
      var onlinenum = Number(result.onlinenum);
      if (userName != "" && userName != undefined && userName != null) {
        addDanmakuList(userName, danmakuContent, "black", "#3C3C3C", 0)
        danmakuListContainerViewPusher_right_left();
        // rightVewLeft = rightVewLeft + 31
        that.setData({
          danmakuListData: danmakuListList,
          // rightVewLeft: rightVewLeft,
          inputValue: '',
          danmakuContent: ''
        })
        console.log(that.data.danmakuListData);
        if (danmakuListList.length > 8) {
          that.setData({
            showNewDnamakuRemind: true
          })
        }
        //将计时器赋值给setTimer
        that.data.setTimer = setInterval(
          function() {
            that.setData({
              showNewDnamakuRemind: false
            });
          }, 2000);
      }
      if (onlinenum != "" && onlinenum != undefined && onlinenum != null && onlinenum != NaN) {
        that.setData({
          onlinenum: onlinenum
        })
      }
    })
  },

  // 通过 WebSocket 连接发送数据
  sendSocketMessage: function(uid, roomid, danmakuContent) {
    var that = this
    if (socketOpen) {
      wx.sendSocketMessage({
        data: JSON.stringify({
          "uid": uid,
          "roomid": roomid,
          "danmakuContent": danmakuContent
        }),
        success: function(res) {
          console.log(res)
          that.deal();
        },
        fail: function(res) {
          console.log(res)
        }
      })
    } else {
      socketMsgQueue.push(options.msg)
    }
  },

  //发送弹幕
  danmakuSubmit: function() {
    //
    var that = this;
    //清除计时器  setTimer
    clearInterval(that.data.setTimer)
    //
    var uid = Number(this.data.uid);
    var roomid = this.data.roomid;
    var danmakuContent = this.data.danmakuContent;
    var rightVewLeft = this.data.rightVewLeft;

    if (danmakuContent != null && danmakuContent != undefined && danmakuContent != '') {
      console.log("danmakuContent:" + danmakuContent);
      console.log("uid:" + uid);
      console.log(danmakuContent);
      console.log("socketOpen:" + socketOpen)
      if (socketOpen) {
        // 如果打开了socket就发送数据给服务器
        this.sendSocketMessage(uid, roomid, danmakuContent)
      }
    }
  },

})
var danmakuListList = []; //弹幕列表集合
//弹幕列表
function addDanmakuList(userName, danmakuContent, color, unameColor, left) {
  danmakuListList.unshift(new DanmakuList(userName, danmakuContent, color, unameColor, left));
}
class DanmakuList {
  constructor(userName, danmakuContent, color, unameColor, left) {
    this.userName = userName;
    this.danmakuContent = danmakuContent;
    this.color = color;
    this.unameColor = unameColor;
    this.left = left;
  }
}

function danmakuListContainerViewPusher_right_left() {
  for (var i = 1; i < danmakuListList.length; i++) {
    danmakuListList[i].left = danmakuListList[i].left + 31;
  }
  if (danmakuListList.length > 7) {
    danmakuListList.splice(7, 1)
  }
}