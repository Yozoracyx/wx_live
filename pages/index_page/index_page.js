const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    fulldata: app.globaldata,
    showLiveView: true,
    picUrl: "",//封面url前缀
    // token: app.globalData.token,
    playListArray: [{
      cid: 1,
      playImgSrc: '../../images/java.jpg',
      type: 'Java'
    }, {
      cid: 2,
      playImgSrc: '../../images/python.jpg',
      type: 'Python'
    }, {
      cid: 3,
      playImgSrc: '../../images/php.jpg',
      type: 'PHP'
    }, {
      cid: 4,
      playImgSrc: '../../images/javascript.jpg',
      type: 'JavaScript'
    }, {
      cid: 5,
      playImgSrc: '../../images/go.jpg',
      type: 'Go'
    }, {
      cid: 6,
      playImgSrc: '../../images/math.jpg',
      type: '高数'
    }, {
      cid: 7,
      playImgSrc: '../../images/English.jpg',
      type: '英语'
    }, {
      cid: 8,
      playImgSrc: '../../images/art.jpg',
      type: '艺术'
    }, {
      cid: 9,
      playImgSrc: '../../images/bigdata.jpg',
      type: '大数据'
    }, {
      cid: 10,
      playImgSrc: '../../images/ai.jpg',
      type: '人工智能'
    }],
    allPlayListArray: [{
      roomid: 1,
      type: '地下城与勇士',
      anchorName: '旭旭宝宝',
      onlinenum: 50.5,
      title: '国服第一红眼',
      playImgSrc: '../../images/dnf.jpg',
      cover: "../player/player"
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // this.getAllPlay(); //获取所有直播信息
    this.setData({
      picUrl: app.globalData.picUrl
    })
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
    this.getAllPlay();
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
  //搜索框
  inputFocus: function() {
    wx.navigateTo({
      url: '../search/search?status=1',
    })
  },

  //获取所有直播信息
  getAllPlay() {
    var token = wx.getStorageSync('token');
    var that = this;
    wx.request({
      url: "https://" + app.globalData.requestUrl + '/web_service' + "/live_controller/get_index_live",
      header: {
        "Content-Type": "application/json",
        "token": token,
      },
      data: {

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
          } else {
            showLiveView = false;
          }
          for (var index = 0; index < allPlayListArray.length; index++) {
            var coverSrc = allPlayListArray[index].coverSrc;
            if (coverSrc == "" || coverSrc == null || coverSrc == undefined) {
              allPlayListArray[index].coverSrc = "../../images/cover.png"
            }else{
              allPlayListArray[index].coverSrc = "http://" + that.data.picUrl + coverSrc;
            }
          }
          that.setData({
            allPlayListArray: allPlayListArray,
            showLiveView: showLiveView
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

  //分类搜索
  searchPlayCate: function(e) {
    var playCateId = Number(e.currentTarget.id);
    console.log("playCateId:" + playCateId)
    var playListArray = this.data.playListArray;
    var type = playListArray[playCateId-1].type;
    wx.navigateTo({
      url: "../search/search?cid=" + playCateId + "?type=" + type,
    })
  },
  //搜索直播间
  searchAllPlay: function(e) {
    var playId = Number(e.currentTarget.id);
    console.log("playId:" + playId)
    // var allPlayListArray = this.data.allPlayListArray;
    // var liveInfo = allPlayListArray[playId];
    // wx.setStorageSync('liveInfo', encodeURIComponent(JSON.stringify(liveInfo)))
    // var data = JSON.stringify(liveInfo);
    wx.navigateTo({
      url: "../player/player?roomid=" + playId,
    })
  }
})
// var token = this.data.token;
//获取直播分类
// function getPlayCate() {
//   wx.request({
//     url: "",
//     header: {
//       "Content-Type": "application/json",
//       "token":token
//     },
//     success: function(res) {
//       var result = res.data;
//     },
//     fail: function(err) {
//       console.log(err)
//     }
//   })
// }

//获取所有直播间信息
// function getAllPlay() {
//   wx.request({
//     url: "",
//     header: {
//       "Content-Type": "application/json"
//       "token":token
//     },
//     success: function (res) {
//       var result = res.data;
//     },
//     fail: function (err) {
//       console.log(err)
//     }
//   })
// }









// const app = getApp()
// Page({
//   data: {
//     token: app.globalData.token,
//     liveSrc: "",
//     fullScreenFlag: false,
//     statusCodeListData:[],//状态码集合
//     scrollTop: 0, //滚动条位置
//   },
//   onReady(res) {
//     this.ctx = wx.createLivePlayerContext('player')
//     this.changeLiveSrc()
//   },
//   statechange(e) {
//     var scrollTop = this.data.scrollTop;
//     var statusCodeListData = this.data.statusCodeListData;
//     scrollTop = statusCodeListData.length * 20
//     addStatusCodeList(e.detail.code, e.detail.message);
//     this.setData({
//       statusCodeListData: statusCodeListList,
//       scrollTop: scrollTop
//     })
//     console.log('live-player code:', e.detail.code)

//   },
//   error(e) {
//     console.error('live-player error:', e.detail.errMsg)
//   },
//   bindPlay() {
//     this.ctx.play({
//       success: res => {
//         console.log('play success')
//       },
//       fail: res => {
//         console.log('play fail')
//       }
//     })
//   },
//   bindPause() {
//     this.ctx.pause({
//       success: res => {
//         console.log('pause success')
//       },
//       fail: res => {
//         console.log('pause fail')
//       }
//     })
//   },
//   bindStop() {
//     this.ctx.stop({
//       success: res => {
//         console.log('stop success')
//       },
//       fail: res => {
//         console.log('stop fail')
//       }
//     })
//   },
//   bindResume() {
//     this.ctx.resume({
//       success: res => {
//         console.log('resume success')
//       },
//       fail: res => {
//         console.log('resume fail')
//       }
//     })
//   },
//   bindMute() {
//     this.ctx.mute({
//       success: res => {
//         console.log('mute success')
//       },
//       fail: res => {
//         console.log('mute fail')
//       }
//     })
//   },
//   bindA:function(){
//     wx.navigateTo({
//       url: '../player/player?title=英雄联盟',
//     })
//   },
//   onLoad: function(options) {},
//   onShow: function() {
//     //页面打开时，触发执行的操作
//   },
//   onHide: function() {
//     //页面隐藏时，触发执行的操作
//   },
//   onUnload: function() {
//     //页面关闭时，触发执行的操作
//   },
//   onPullDownRefresh: function() {
//     //用户在页面下拉时执行的操作
//   },
//   onReachBottom: function() {
//     //到达页面底部时执行的操作
//   },
//   changeLiveSrc: function() {
//     this.setData({
//         token: app.globalData.token,
//         liveSrc: 'rtmp://' + app.globalData.proLiveUrl + '/live/1?token=' + app.globalData.token
//       }),
//       console.log(this.data.liveSrc)
//   },

//   fullScreen: function() {
//     var that = this;
//     //全屏
//     var vidoHeight = wx.getSystemInfoSync().windowHeight;
//     var fullScreenFlag = that.data.fullScreenFlag;
//     if (fullScreenFlag) {
//       fullScreenFlag = false;
//     } else {
//       fullScreenFlag = true;
//     }
//     console.log(fullScreenFlag);
//     if (fullScreenFlag) {
//       //全屏
//       that.ctx.requestFullScreen({
//         success: res => {
//           that.setData({
//             fullScreenFlag: fullScreenFlag
//           });
//           console.log('我要执行了');
//         },
//         fail: res => {
//           console.log('fullscreen fail');
//         }
//       });

//     } else {
//       //缩小
//       that.ctx.exitFullScreen({
//         success: res => {
//           console.log('fullscreen success');
//           that.setData({
//             fullScreenFlag: fullScreenFlag
//           });
//         },
//         fail: res => {
//           console.log('exit fullscreen success');
//         }
//       });
//     }
//   }

// })