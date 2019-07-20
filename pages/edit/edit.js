const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    token: "",
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
    orientationImgSrc: "", //画面方向图片src
    orientationValue: "",
    cateValue: "选择直播分类", //选择的值
    textareaValue: "", //简介内容
    titleValue: "", //标题内容
    uid: 0, //用户id
    cid: 0, //分类id
    disabled: false
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
    var that = this;
    var title = wx.getStorageSync('title')
    var intro = wx.getStorageSync('introduction')
    var cid = wx.getStorageSync('cateValue')
    var orientationValue = wx.getStorageSync('orientationValue')
    var orientationImgSrc = wx.getStorageSync('orientationImgSrc')
    that.setData({
      titleValue: title,
      textareaValue: intro,
      cateValue: cid,
      orientationValue: orientationValue,
      orientationImgSrc: orientationImgSrc,
      disabled: false
    })
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
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var typeArray = this.data.typeArray;
    var index = e.detail.value;
    this.setData({
      cateValue: typeArray[index].type,
      cid: index
    })
  },
  alterLiver: function() {
    var that = this;
    var token = wx.getStorageSync('token');
    var title = this.data.titleValue;
    var introduction = this.data.textareaValue;
    var cid = Number(this.data.cid) + 1;
    var uid = wx.getStorageSync('uid')
    this.setData({
      disabled: true
    })
    if (title != "" && title != null && title != undefined) {
      if (cid != "" && cid != null && cid != undefined) {
        wx.request({
          url: "https://" + app.globalData.requestUrl + '/web_service' + "/live_controller/alter_live_room",
          header: {
            "Content-Type": "application/json",
            "token": token,
          },
          data: {
            "uid": uid,
            "cid": cid,
            "title": title,
            "introduction": introduction
          },
          success: function(res) {
            var result = res.data;
            console.log(result)
            var status = result.status
            if (status == 200) {
              wx.setStorageSync('title', title)
              // wx.redirectTo({
              //   url: '../pusher/pusher',
              // })
              wx.navigateBack({
                delta: 1
              })
            }
          },
          fail: function(err) {
            console.log(err)
          }
        })
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

function tips(content) {
  wx.showModal({
    title: '提示',
    content: content,
    success: function(res) {
      if (res.confirm) { //这里是点击了确定以后
        console.log('用户点击确定')
      } else { //这里是点击了取消以后
        console.log('用户点击取消')
      }
    }
  })
}