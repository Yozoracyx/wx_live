const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    token: "",
    loadingHidden:true,
    typeArray: [{
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
    orientationArray: [{
      oid: 1,
      orientation: '横屏直播',
      orientationImgSrc: "../../images/heng.png"
    }, {
      oid: 2,
      orientation: '竖屏直播',
      orientationImgSrc: "../../images/shu.png"
    }],
    showOrientationImg: true, //是否显示画面方向图片
    orientationImgSrc: "", //画面方向图片src
    orientationValue: "选择直播画面方向",
    cateValue: "选择直播分类", //选择的值
    textareaValue: "", //简介内容
    titleValue: "", //标题内容
    setTimer: '', //定时器名字
    value: 1, //
    buttonValue: "我要开播", //按钮value
    uid: 0, //用户id
    cid: 0, //分类id
    userInfo: [], //用户信息
    disabled: false //按钮点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var userInfo = wx.getStorageSync('userInfo')
    var uid = wx.getStorageSync('uid')
    var token = wx.getStorageSync('token')
    this.setData({
      userInfo: userInfo,
      token: token,
      uid: uid,
      disabled: false,
      showOrientationImg: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.setData({
      disabled: false,
      buttonValue: "我要开播"
    })
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
  titleInput: function(e) {
    this.setData({
      titleValue: e.detail.value
    })
  },
  introInput: function(e) {
    this.setData({
      textareaValue: e.detail.value
    })
  },
  bindTypePickerChange(e) {
    console.log('type picker发送选择改变，携带值为', e.detail.value)
    var typeArray = this.data.typeArray;
    var index = e.detail.value;
    this.setData({
      cateValue: typeArray[index].type,
      cid: index
    })
  },
  bindOrientationPickerChange(e) {
    console.log('orientation picker发送选择改变，携带值为', e.detail.value)
    var orientationArray = this.data.orientationArray;
    var index = e.detail.value;
    this.setData({
      orientationValue: orientationArray[index].orientation,
      oid: index,
      showOrientationImg: false,
      orientationImgSrc: orientationArray[index].orientationImgSrc
    })
  },
  becomeLiver: function() {
    var that = this;
    var token = wx.getStorageSync('token');
    var title = this.data.titleValue;
    var introduction = this.data.textareaValue;
    var cid = Number(this.data.cid) + 1;
    var oid = Number(this.data.oid) + 1;
    var cateValue = this.data.cateValue;
    var orientationValue = this.data.orientationValue;
    var orientationImgSrc = this.data.orientationImgSrc;
    var uid = this.data.uid;
    this.setData({
      disabled: true
    })
    if (title != "" && title != null && title != undefined) {
      if (cid != "" && cid != null && cid != undefined) {
        if (oid != "" && oid != null && oid != undefined) {
          that.setData({
            loadingHidden : false
          })
          wx.setStorageSync('title', title)
          wx.setStorageSync('introduction', introduction)
          wx.setStorageSync('cateValue', cateValue)
          wx.setStorageSync('orientationValue', orientationValue)
          wx.setStorageSync('orientationImgSrc', orientationImgSrc)
          wx.request({
            url: "https://" + app.globalData.requestUrl + '/web_service' + "/live_controller/start_live",
            header: {
              "Content-Type": "application/json",
              "token": token,
            },
            data: {
              "title": title,
              "cid": cid,
              "introduction": introduction,
              "uid": uid,
              "oid": oid
            },
            success: function(res) {
              var result = res.data;
              wx.setStorageSync('roomid', result.message.roomid)
              console.log(result)
              var status = result.status
              if (status == 200) {
                clearInterval(that.data.setTimer)
                that.setData({
                  loadingHidden: true
                })
                wx.showToast({
                  title: '启动成功',
                  icon: 'success',
                  duration: 1000//持续的时间
                })
                //将计时器赋值给setTimer
                that.data.setTimer = setTimeout(
                  function() {
                    wx.navigateTo({
                      url: '../pusher/pusher',
                    })
                  }, 1000);
                that.setData({
                  buttonValue: "正在直播"
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
        } else {
          var content = "请选择手机直播摆放位置"
          tips(content);
        }
      } else {
        var content = "请选择直播类型"
        tips(content);
      }
    } else {
      var content = "请填写正确的直播间标题"
      tips(content);
    }
  }
})
function tips(content){
  wx.showModal({
    title: '提示',
    content: content,
    success: function (res) {
      if (res.confirm) { //这里是点击了确定以后
        console.log('用户点击确定')
      } else { //这里是点击了取消以后
        console.log('用户点击取消')
      }
    }
  })
}