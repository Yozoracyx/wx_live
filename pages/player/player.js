var page = undefined;
const app = getApp()

var socketOpen = false;
var ws;
var socketMsgQueue = [];

Page({

  /**
   * 页面的初始数据
   */
  data: {
    system: "",
    danmakuLeftTest: 0,
    token: app.globalData.token,
    liveSrc: "", //直播线路，默认线路一高清
    testSrc: "",
    videoUrl:"",//直播录像url前缀
    inputValue: '', //输入框的值
    fullScreenInputValue: '', //全屏弹幕view模拟的输入框的值
    fullScreenInputFocus: false, //全屏弹幕输入框focus
    danmakuContent: '', //弹幕内容
    moveData: null, //弹幕动画animation
    // fullScreenMoveData:null,//全屏弹幕动画
    danmakuDisplay: false,
    roomid: 0, //
    uid: 0,
    loadingValue: "loading", //加载提示
    userName: 'yozora', //用户名
    liverName: '主播名', //主播名
    liverType: '直播类型', //直播类型
    title: '欢迎来到我的直播间', //直播标题
    intro: '这个主播很懒，什么都没有写...', //直播简介
    avatarurl: '../../images/logo.jpg', //主播头像
    recordSrc: "", //直播录像src
    onlinenum: 0, //在线人数
    isSubscribe: false, //订阅vew（true已订阅，false没订阅）
    subscribeNum: 0, //订阅数
    hasSubscribe: false, //用户是否订阅该主播(true/已订阅，false/未订阅)
    danmakuData: [], //弹幕集合
    danmakuListData: [], //弹幕列表集合
    code: 0, //拉流code
    scrollTop: 0, //滚动条位置
    playFlag: false, //正在播放false/已暂停true
    switchClearPlayFlag: false, //全屏状态切换清晰度时是否再次点击播放按钮（播放true/暂停false）
    fullScreenFlag: false, //全屏true/缩小false
    true: true,
    false: false,
    autoplayFalse: false,
    showChatOrIntro: true, //切换聊天框和主播简介框（true聊天/false主播）
    showBottomAndTopView: true, //显示/隐藏直播框顶部和底部栏
    showClearListView: true, //清晰度切换视图
    hiddenFullscreenView: false, //全屏时隐藏部分view
    nowClearValue: "高 清", //当前清晰度
    standardClear: "标 清", //标清清晰度
    highClear: "高 清", //高清清晰度
    // superClear: "超 清", //超清清晰度
    definition: 2, //清晰度线路（1-超清，2-高清，3-标清）
    visibility: "hidden", //直播视频的显示/隐藏
    showHiddenView: false, //直播视频遮挡view的显示与隐藏
    showfullScreenHiddenView: true, //直播视频全屏遮挡view的显示与隐藏
    showFullScreenDanmakuSubmit: true, //显示全屏发送弹幕view
    lineHeight: 0, //直播视频全屏遮挡view的line-height
    muted: true, //直播间视频声音
    writingMode: 'horizontal-tb', //文本方向（horizontal-tb水平/vertical-rl垂直）
    bottom: 5,
    fullScreenBottom: 0,
    // clearItemColor1: "#FF8000", //清晰度字体颜色样式
    // clearItemBorderColor1: "#FF8000", //清晰度框颜色样式
    clearItemColor2: "#FF8000",
    clearItemBorderColor2: "#FF8000",
    clearItemColor3: "white",
    clearItemBorderColor3: "white",
    setTimer: '', //定时器名字
    orientation: "horizontal", //画面方向(手机竖屏and电脑直播/vertical,手机横屏/horizontal)
    direction: 0, //全屏时画面旋转方向(手机竖屏and电脑直播/90,手机横屏/0)
    videoHeight: 0, //直播高度
    videoWidth: 0, //直播宽度
    windowHeight: 0, //手机屏幕高度rpx
    screenHeight: 0, //手机屏幕高度px
    windowWidth: 0, //手机屏幕宽度px
    liverPlayerHeight: 170,
    liverPlayerWidth: 100,
    danmakuLeft: 600,
    navColor1: '#FF8000', //导航栏字体颜色样式
    borderBottomColor1: '#FF8000', //导航栏底框颜色样式
    navColor2: 'black',
    borderBottomColor2: 'white',
    showFullScreenRightView: true, //隐藏全屏切换清晰度view(true隐藏,false显示)
    showliverRecord: true, //无录像时隐藏直播录像
    videoLoading: true, //不播放录像时，隐藏
    isCheckedArray: "", //清晰度是否被点击
    lineArray: [{ //线路清晰度集合
      lineName: "线路一",
      liveSrc_high: "",
      liveSrc_standard: "",
    }, {
      lineName: "线路二",
      liveSrc_high: "",
      liveSrc_standard: "",
    }],
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(res) {
    // wx.setNavigationStyle({navigationStyle:'custom'});
    // var liveInfo = JSON.parse(decodeURIComponent(wx.getStorageSync('liveInfo')));
    // var userInfo = JSON.parse(decodeURIComponent(wx.getStorageSync('userInfo')));

    // var data = decodeURIComponent(res.liveInfo);
    // var liveInfo = JSON.parse(data);
    this.ctx = wx.createLivePlayerContext('player');
    wx.getSystemInfo({
      success: res => {
        let windowHeight = (res.windowHeight * (750 / res.windowWidth));
        this.setData({
          windowHeight: windowHeight,
          windowWidth: res.windowWidth,
          screenHeight: res.screenHeight,
          liverPlayerWidth: res.windowWidth,
          // danmakuLeft: res.windowWidth
        })
      }
    })

    var isCheckedArray = [];
    var lineArray = this.data.lineArray;
    if (lineArray.length != 0) {
      for (var index = 0; index < lineArray.length; index++) {
        var item = {};
        item.high = false;
        item.standard = false;
        isCheckedArray.push(item);
      }
      isCheckedArray[0].high = true;
      this.setData({
        isCheckedArray: isCheckedArray
      })
    }
    this.webSocket();
    this.deal();
    // var that = this;
    // var timer = setTimeout(function() {
    //   that.bindPlayAndStop();
    // }, 1000);
  },
  statechange(e) {
    console.log(e.detail.code + ":" + e.detail.message);
    var that = this;
    var code = this.data.code;
    var sysCode = "Sysytem: " + e.detail.code;
    var sysMsg = e.detail.message;
    var fullScreenFlag = this.data.fullScreenFlag;
    if (Number(code) != 2005) {
      addDanmakuList(sysCode, sysMsg, "#ff8000", "#ff8000");
      var scrollTop = this.data.scrollTop;
      scrollTop = danmakuListList.length * 20;
      this.setData({
        danmakuListData: danmakuListList,
        scrollTop: scrollTop
      })
    }
    if (Number(code) != 2003) {
      that.setData({
        code: e.detail.code
      })
    } else {
      that.setData({
        code: 2003
      })
    }
    this.showViewByCode(fullScreenFlag);
  },

  //根据code显示对应view
  showViewByCode(fullScreenFlag) {
    var code = this.data.code;
    console.log("showViewByCode:" + code);
    if (Number(code) != 2003) {
      // if (!fullScreenFlag) {
      this.setData({
        visibility: "hidden",
        showHiddenView: false,
        muted: true,
        // showfullScreenHiddenView: true
      })
    } else {
      this.setData({
        visibility: "hidden",
        showHiddenView: true,
        muted: false,
        // showfullScreenHiddenView: false
      })
    }
    // } else {
    //   this.setData({
    //     visibility: "visible",
    //     showHiddenView: true,
    //     muted: false,
    //     showfullScreenHiddenView: true
    //   })
    // }
  },

  error(e) {
    console.error('live-player error:', e.detail.errMsg)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    page = this;
    var that = this;
    // wx.setNavigationBarTitle({
    //   title: options.title
    // })
    wx.getSystemInfo({
      success(res) {
        console.log(res.system);
        if (res.system.search("iOS") != -1) {
          that.setData({
            showBottomAndTopView: false,
            system: "iOS"
          })
        } else {
          that.setData({
            system: "Android"
          })
        }
      }
    })
    // var data = decodeURIComponent(options.liveInfo);
    var roomid = Number(options.roomid);
    this.setData({
      roomid: roomid,
      videoUrl: app.globalData.videoUrl
    })
    this.initLiver(roomid);
  },
  initLiver: function(roomid) {
    var token = wx.getStorageSync('token');
    var userName = wx.getStorageSync('nickName');
    var uid = Number(wx.getStorageSync('uid'));
    var that = this;
    wx.request({
      url: "https://" + app.globalData.requestUrl + '/web_service' + "/live_controller/get_live_by_roomId",
      header: {
        "Content-Type": "application/json",
        "token": token
      },
      data: {
        "roomid": roomid,
        "uid": uid
      },
      success: function(res) {
        var result = res.data;
        console.log(result);
        if (result.status == 200) {
          var liveSrc = "";
          var liveInfo = res.data.message;
          var subscribeNum = liveInfo.subscribeNum;
          var liverName = liveInfo.anchorName;
          var liverType = liveInfo.type;
          var title = liveInfo.title;
          var intro = liveInfo.introduction;
          var liveSrcList = liveInfo.liveSrcList;
          var avatarurl = liveInfo.avatarurl;
          var lineArray = liveInfo.liveSrcList;
          var hasSubscribe = liveInfo.hasSubscribe;
          var recordSrc = liveInfo.recordSrc;
          var oid = Number(liveInfo.oid);
          var isSubscribe = that.data.isSubscribe
          var orientation = that.data.orientation;
          var direction = that.data.direction;
          var showliverRecord = true;
          if (recordSrc == "" || recordSrc == undefined || recordSrc == null) {
            showliverRecord = true;
          } else {
            showliverRecord = false;
            recordSrc = "http://" + that.data.videoUrl + recordSrc;
          }
          if (oid == 1) {
            orientation = "horizontal";
            direction = 90;
          } else if (oid == 2) {
            orientation = "vertical";
            direction = 0;
          } else {
            orientation = "vertical";
            direction = 90;
          }
          if (intro == "" || intro == undefined || intro == null) {
            intro = '这个主播很懒，什么都没有写...';
          }
          if (hasSubscribe) {
            isSubscribe = true;
          } else {
            isSubscribe = false;
          }
          that.setData({
            uid: uid,
            roomid: roomid,
            userName: userName, //用户名
            liverName: liverName, //主播名
            liverType: liverType, //直播类型
            title: title, //直播标题
            intro: intro, //直播简介
            liveSrc: liveSrc, //直播线路，默认线路一高清
            lineArray: lineArray, //线路清晰度集合
            avatarurl: avatarurl, //主播头像
            subscribeNum: subscribeNum, //订阅数
            isSubscribe: isSubscribe,
            orientation: orientation,
            direction: direction,
            showliverRecord: showliverRecord,
            recordSrc: recordSrc
          })
          console.log(that.data.orientation)
          console.log(that.data.direction)
          wx.setNavigationBarTitle({ //修改title
            title: liveInfo.title
          });
          if (liveSrcList == "" || liveSrcList == null || liveSrcList == undefined) {
            var loadingValue = "主播还没来..."
            that.setData({
              loadingValue: loadingValue
            })
          } else {
            liveSrc = liveInfo.liveSrcList[0].liveSrc_high;
            that.setData({
              liveSrc: liveSrc
            })
            that.changeLiveSrc();
          }
        }

      },
      fail: function(err) {
        console.log(err)
      }
    })
  },
  //全屏切换清晰度
  checkClear: function(e) {
    var lineArray = this.data.lineArray;
    var isCheckedArray = this.data.isCheckedArray;
    var index = e.currentTarget.id;
    var clear = e.currentTarget.dataset.hi;
    var definition = this.data.definition;
    var liveSrc = this.data.liveSrc;
    var url = "";
    var that = this;
    that.resentIsCheckedArray();
    if (clear == "high") {
      url = lineArray[index].liveSrc_high;
      isCheckedArray[index].high = true;
      if (liveSrc != url) {
        that.setData({
          liveSrc: url,
          nowClearValue: "高 清"
        })
        console.log(url)
        that.changeLiveSrc();
      }
    } else {
      url = lineArray[index].liveSrc_standard;
      isCheckedArray[index].standard = true;
      if (liveSrc != url) {
        that.setData({
          liveSrc: url,
          nowClearValue: "标 清"
        })
        console.log(url)
        that.changeLiveSrc();
      }
    }
    that.setData({
      isCheckedArray: isCheckedArray
    })
  },
  //重置全屏清晰度切换css
  resentIsCheckedArray() {
    var isCheckedArray = this.data.isCheckedArray;
    for (var index = 0; index < isCheckedArray.length; index++) {
      isCheckedArray[index].high = false;
      isCheckedArray[index].standard = false;
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("onShow")
    danmakuListList = [];
    danmakuList = [];
    this.setData({
      danmakuListData: danmakuListList,
      danmakuData: danmakuList
    })
    var roomid = Number(this.data.roomid);
    this.initLiver(roomid);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    console.log("onHide")

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    console.log("onUnload")
    danmakuListList = [];
    danmakuList = [];
    this.setData({
      danmakuListData: danmakuListList,
      danmakuData: danmakuList
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


  scroll: function() {
    console.log("scroll");
  },
  //播放/暂停
  bindPlayAndStop: function() {
    var playFlag = this.data.playFlag;
    var that = this;
    if (playFlag) {
      playFlag = false;
    } else {
      playFlag = true;
    }
    if (!playFlag) {
      this.ctx.play({
        success: res => {
          console.log('play success');
          that.setData({
            playFlag: playFlag
          });
        },
        fail: res => {
          console.log('play fail');
        }
      })
    } else {
      this.ctx.pause({
        success: res => {
          var switchClearPlayFlag = this.data.switchClearPlayFlag;
          var that = this;
          if (switchClearPlayFlag) {
            that.setData({
              switchClearPlayFlag: false,
              playFlag: playFlag
            });
            that.bindPlayAndStop();
            console.log("switchClearPlayFlag success");
          } else {
            console.log('pause success')
            that.setData({
              playFlag: playFlag
            });
          }
        },
        fail: res => {
          console.log('pause fail')
        }
      })
    }
  },

  changeLiveSrc: function() {
    var definition = this.data.definition;
    var liveSrc = this.data.liveSrc;
    var token = wx.getStorageSync("token");
    var fullScreenFlag = this.data.fullScreenFlag;
    this.setData({
      token: app.globalData.token,
      // liveSrc: 'rtmp://' + app.globalData.liveUrl + '/live/' + definition + '?token=' + app.globalData.token,
      liveSrc: liveSrc + "?token=" + token,
      code: 0
    })
    if (fullScreenFlag == true) {
      this.fullScreen()
    }
    console.log(this.data.liveSrc)
  },

  //网络状态通知
  netstatus: function(e) {
    var videoHeight = e.detail.info.videoHeight;
    var videoWidth = e.detail.info.videoWidth;
    if (videoHeight != 0 && videoWidth != 0) {
      this.setData({
        videoWidth: videoWidth,
        videoHeight: videoHeight
      })
    }
  },
  //屏幕翻转变化事件
  onResize(res) {
    console.log(res);
    var that = this;
    var newWindowWidth = res.size.windowWidth // 新的显示区域宽度
    var newWindowHeight = res.size.windowHeight // 新的显示区域高度
    if (newWindowWidth < newWindowHeight) {
      //竖屏
      // that.fullScreen();
    } else {
      //横屏
      // that.fullScreen();
    }
  },

  //全屏
  fullScreen: function() {
    var that = this;
    var fullScreenFlag = that.data.fullScreenFlag;
    var videoHeight = this.data.videoHeight;
    var videoWidth = this.data.videoWidth;
    var direction = this.data.direction;
    var code = this.data.code;
    if (fullScreenFlag) {
      fullScreenFlag = false;
    } else {
      fullScreenFlag = true;
    }
    console.log(fullScreenFlag);
    if (fullScreenFlag) {
      //全屏
      that.ctx.requestFullScreen({
        success: res => {
          that.showViewByCode(fullScreenFlag);
          // var orientation = "";
          // if (videoHeight > videoWidth) {
          //   //手机 不翻转
          //   orientation = 'vertical';
          // } else {
          //   //电脑 翻转
          //   orientation = "horizontal";
          // }
          danmakuList = [];
          var liveSrc = that.data.liveSrc;
          var windowHeight = that.data.windowWidth;
          var windowWidth = that.data.windowHeight
          that.setData({
            danmakuData: [],
            fullScreenFlag: fullScreenFlag,
            // danmakuDisplay: true,
            // orientation: orientation,
            // showBottomAndTopView: true,
            showFullScreenDanmakuSubmit: false,
            showChatOrIntro: false,
            hiddenFullscreenView: true
          })
        },
        fail: res => {
          console.log('fullscreen fail');
        },
        direction: direction
      });
    } else {
      //缩小
      that.ctx.exitFullScreen({
        success: res => {
          that.showViewByCode(fullScreenFlag);
          console.log('fullscreen success');
          // var orientation = "";
          // if (videoHeight > videoWidth) {
          //   //手机 不翻转
          //   orientation = 'vertical';
          // } else {
          //   //电脑 翻转
          //   orientation = "vertical";
          // }
          danmakuList = [];
          that.setData({
            danmakuData: [],
            fullScreenFlag: fullScreenFlag,
            danmakuDisplay: false,
            // orientation: orientation,
            // showFullScreenRightView: true,
            showFullScreenDanmakuSubmit: true,
            showChatOrIntro: true,
            hiddenFullscreenView: false
          });
        },
        fail: res => {
          console.log('exit fullscreen success');
        }
      });
    }
  },

  //全屏变化事件
  fullscreenchange(e) {
    var fullScreenFlag = e.detail.fullScreen;
    console.log(e);
  },

  //点击直播界面
  livePlayerClick: function() {
    var system = this.data.system
    if (system == "Android") {
      var fullScreenFlag = this.data.fullScreenFlag;
      console.log("livePlayerClick fullScreenFlag:" + fullScreenFlag);
      var that = this;
      clearInterval(that.data.setTimer)
      // if (fullScreenFlag) {
      //   that.setData({
      //     showFullScreenRightView: false,
      //     showBottomAndTopView: true
      //   })
      //   that.data.setTimer = setInterval(
      //     function() {
      //       that.setData({
      //         showFullScreenRightView: true
      //       });
      //     }, 3000);
      // } else {
      that.setData({
        showFullScreenRightView: true,
        showBottomAndTopView: false
      })
      that.data.setTimer = setInterval(
        function() {
          that.setData({
            showBottomAndTopView: true
          });
        }, 3000);
      // }
    }
  },

  //定时隐藏直播框界面
  hideBottomAndTopView: function() {

  },
  //显示切换清晰度视图
  switchClear: function() {
    this.setData({
      showClearListView: false
    })
  },

  //隐藏切换清晰度视图
  clearListViewClick: function() {
    this.setData({
      showClearListView: true
    })
  },

  //切换清晰度
  // clearViewListItemClick: function(e) {
  //   var id = e.currentTarget.id;
  //   var nowClearValue = this.data.nowClearValue;
  //   // if (id == "super" && nowClearValue != "超 清") {
  //   //   console.log(id + "," + nowClearValue);
  //   //   this.setData({
  //   //     nowClearValue: "超 清",
  //   //     clearItemColor1: "#FF8000",
  //   //     clearItemBorderColor1: "#FF8000",
  //   //     clearItemColor2: "white",
  //   //     clearItemBorderColor2: "white",
  //   //     clearItemColor3: "white",
  //   //     clearItemBorderColor3: "white",
  //   //     definition: 1
  //   //   })
  //   //   var that = this;
  //   //   that.changeLiveSrc();
  //   // } else 
  //   if (id == "standard" && nowClearValue != "标 清") {
  //     this.setData({
  //       nowClearValue: "标 清",
  //       clearItemColor1: "white",
  //       clearItemBorderColor1: "white",
  //       clearItemColor3: "#FF8000",
  //       clearItemBorderColor3: "#FF8000",
  //       clearItemColor2: "white",
  //       clearItemBorderColor2: "white",
  //       definition: 3
  //     })
  //     var that = this;
  //     that.changeLiveSrc();
  //   } else if (id == "high" && nowClearValue != "高 清") {
  //     this.setData({
  //       nowClearValue: "高 清",
  //       clearItemColor1: "white",
  //       clearItemBorderColor1: "white",
  //       clearItemColor2: "#FF8000",
  //       clearItemBorderColor2: "#FF8000",
  //       clearItemColor3: "white",
  //       clearItemBorderColor3: "white",
  //       definition: 2
  //     })
  //     var that = this;
  //     that.changeLiveSrc();
  //   }

  // var fullScreenFlag = this.data.fullScreenFlag;
  // var playFlag = this.data.playFlag;
  // if (fullScreenFlag) {
  //   if (!playFlag) {
  //     //正在播放
  //     this.setData({
  //       switchClearPlayFlag: true
  //     })
  //     console.log("正在播放" + this.data.fullScreenFlag);
  //     this.bindPlayAndStop();
  //   } else {
  //     //已暂停
  //     this.bindPlayAndStop();
  //     console.log("已暂停" + this.data.fullScreenFlag);
  //   }
  // }
  // },

  // 获取输入框内容
  danmakuInput: function(e) {
    this.setData({
      danmakuContent: e.detail.value
    })
  },
  fullScreenDanmakuInput: function(e) {
    this.setData({
      danmakuContent: e.detail.value,
      fullScreenInputValue: e.detail.value
    })
  },
  //点击播放录像
  playVideoClick: function() {
    this.setData({
      videoLoading: false,
      autoplayFalse: true
    })
    this.bindPlayAndStop()
  },
  //点击导航栏
  clickNav: function(e) {
    var id = e.currentTarget.dataset.testid;
    if (id == 1) {
      this.setData({
        navColor1: '#FF8000',
        borderBottomColor1: '#FF8000',
        navColor2: 'black',
        borderBottomColor2: 'white',
        showChatOrIntro: true
      })
    } else if (id == 2) {
      this.setData({
        navColor1: 'black',
        borderBottomColor1: 'white',
        navColor2: '#FF8000',
        borderBottomColor2: '#FF8000',
        showChatOrIntro: false
      })
    }
  },
  //订阅
  subscribeClick: function() {
    var isSubscribe = this.data.isSubscribe;
    var that = this;
    var uid = Number(wx.getStorageSync("uid"));
    var roomid = this.data.roomid;
    var token = wx.getStorageSync('token');
    var subscribeUrl = "";
    if (isSubscribe) { //已订阅
      //退订
      subscribeUrl = "/live_controller/remove_live_subscribe"
    } else { //未订阅
      //订阅
      subscribeUrl = "/live_controller/add_live_subscribe"
    }
    wx.request({
      url: "https://" + app.globalData.requestUrl + '/web_service' + subscribeUrl,
      header: {
        "Content-Type": "application/json",
        "token": token,
      },
      data: {
        uid: uid,
        roomid: roomid
      },
      success: function(res) {
        var result = res.data;
        console.log(result)
        var status = result.status
        if (status == 200) {
          var subscribeNum = result.message.subscribeNum;
          that.setData({
            subscribeNum: subscribeNum,
            isSubscribe: !isSubscribe
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

  },
  //全屏弹幕输入vew点击事件
  fullScreenDanmakuViewClick() {
    this.setData({
      fullScreenInputFocus: true
    })
  },

  inputFocus(e) {
    console.log(e, '键盘弹起')
    var inputHeight = 0;
    if (e.detail.height) {
      inputHeight = e.detail.height
      console.log('inputHeight', inputHeight)
      this.setData({
        bottom: inputHeight
      })
    }
  },
  inputBlur() {
    console.log('键盘收起')
    this.setData({
      bottom: 5
    })
  },
  fullScreenBindInputFocus(e) {
    console.log(e, '全屏键盘弹起')
    var inputHeight = 0;
    clearInterval(this.data.setTimer);
    if (e.detail.height) {
      inputHeight = e.detail.height
      console.log('inputHeight', inputHeight)
      this.setData({
        fullScreenBottom: inputHeight,
        showBottomAndTopView: false
      })
    }
  },
  fullScreenBindInputBlur() {
    console.log('全屏键盘收起')
    this.setData({
      fullScreenBottom: 0
    })
  },


  webSocket: function() {
    var that = this;
    var roomid = this.data.roomid;
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
      addDanmakuList("WebSocket", "成功连接", "#ff8000", "#ff8000");
      var scrollTop = this.data.scrollTop;
      scrollTop = danmakuListList.length * 20;
      this.setData({
        danmakuListData: danmakuListList,
        scrollTop: scrollTop
      })
    })
    //连接失败
    wx.onSocketError((err) => {
      socketOpen = false;
      console.log('websocket 连接失败', err);
      addDanmakuList("WebSocket", "连接失败", "#ff8000", "#ff8000");
      var scrollTop = this.data.scrollTop;
      scrollTop = danmakuListList.length * 20;
      this.setData({
        danmakuListData: danmakuListList,
        scrollTop: scrollTop
      })
      that.webSocket();
    })
  },



  deal: function() {
    var that = this;
    //WebSocket接受到服务器的消息
    wx.onSocketMessage(function(res) {
      that.setData({
        moveData: null
      })
      var result = JSON.parse(res.data);
      console.log('收到服务器内容：')
      console.log(result);
      var onlinenum = result.onlinenum;
      if (onlinenum != "" && onlinenum != undefined && onlinenum != null && onlinenum != NaN && onlinenum != "NaN") {
        onlinenum = Number(onlinenum);
        that.setData({
          onlinenum: onlinenum
        })
      }
      var userName = result.name;
      if (userName != "" && userName != undefined && userName != null) {
        var scrollTop = that.data.scrollTop;
        var danmakuListData = that.data.danmakuListData;
        var windowWidth = that.data.windowWidth;
        var screenHeight = that.data.screenHeight;
        var fullScreenFlag = that.data.fullScreenFlag;
        var danmakuLeft = windowWidth;
        var danmakuContent = result.danmakuContent;
        danmakuTopIndex = Math.floor(Math.random() * 3);;
        var danmakuTop = danmakuTopList[danmakuTopIndex];
        var danmakuLeftWidth = 300 + windowWidth;
        var duration = RandomNumBoth(7000, 9000);
        if (fullScreenFlag) {
          danmakuLeft = screenHeight;
          danmakuLeftWidth = 300 + screenHeight;
          duration = RandomNumBoth(11000, 13000);
          danmakuTop = danmakuTopListFullScreen[danmakuTopIndex];
        }
        if (userName != null && userName != undefined && userName != "") {
          if (danmakuContent != null && danmakuContent != undefined && danmakuContent != "") {
            danmakuList.push(new Danmaku(danmakuContent, danmakuTop, duration + 1, 'white'));
            that.setData({
              danmakuLeft: danmakuLeft,
              danmakuData: danmakuList,
              inputValue: '',
              fullScreenInputValue: '',
              showBottomAndTopView: true
            })
            console.log(that.data.danmakuData);
            addDanmakuList(userName, danmakuContent, "black", "#66b3ff")
            that.setData({
              danmakuListData: danmakuListList
            })
            scrollTop = danmakuListData.length * 21
            console.log("scrollTop:" + scrollTop)
            that.setData({
              scrollTop: scrollTop,
              danmakuContent: ''
            })

            var animation = wx.createAnimation({
              duration: duration,
              delay: 0,
              timingFunction: "linear",
            });
            animation.translate(-danmakuLeftWidth, 0).step({
              duration: duration
            })
            that.setData({
              moveData: animation.export()
            })
          }
        }
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
  btnClick: function() {
    var danmakuContent = this.data.danmakuContent;
    var uid = this.data.uid
    var roomid = this.data.roomid;
    var userName = this.data.userName;
    if (danmakuContent != null && danmakuContent != undefined && danmakuContent != '') {
      console.log("userName:" + userName);
      console.log("danmakuContent:" + danmakuContent);
      if (socketOpen) {
        // 如果打开了socket就发送数据给服务器
        this.sendSocketMessage(uid, roomid, danmakuContent)
      }
    }
  },

})
var danmakuTopIndex = 0;
var danmakuTopList = [5, 45, 90, 135]; //弹幕显示高度数组
var danmakuTopListFullScreen = [35, 75, 120, 165]; //弹幕显示高度数组
var danmakuListList = []; //弹幕列表集合
//弹幕列表
function addDanmakuList(userName, danmakuContent, color, unameColor) {
  danmakuListList.push(new DanmakuList(userName, danmakuContent, color, unameColor));
}
class DanmakuList {
  constructor(userName, danmakuContent, color, unameColor) {
    this.userName = userName;
    this.danmakuContent = danmakuContent;
    this.color = color;
    this.unameColor = unameColor;
  }
}

var i = 0; //用做唯一的wx:key
var danmakuList = []; //弹幕集合
class Danmaku {
  constructor(text, top, time, color) {
    this.text = text;
    this.top = top;
    this.time = time;
    this.color = color;
    this.display = true;
    let that = this;
    this.dId = i++;
    setTimeout(function() {
      danmakuList.splice(danmakuList.indexOf(that), 1); //动画完成，从列表中移除这项
      page.setData({
        danmakuData: danmakuList
      })
    }, this.time * 1000) //定时器动画完成后执行。
  }
}
var flag = true;

function RandomNumBoth(Min, Max) {
  var Range = Max - Min;
  var Rand = Math.random();
  var num = Min + Math.round(Rand * Range); //四舍五入
  return num;

}
//弹幕动画
// function danmakuAnimation(){
//   var animation = wx.createAnimation({
//     duration: 3000,
//     timingFunction:'linaer',
//     delay:0,
//     transformOrigin:'50% 50% 0'
//   })
//   animation.translate(750);
//   this.setData({ animationData: animation.export()});
// }