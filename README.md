#这是一个基于微信小程序的直播平台


1.在app.js设置devUrl为本机ip地址

		App({
		  data:{
		    procUrl: "www.vastzhang.cn",
		    devUrl: "192.168.31.132",
		  },
2.在app.js设置当前请求连接

	  onLaunch: function() {
	    console.log("App launch!")
	    this.globalData.requestUrl = this.data.procUrl
	    // this.globalData.requestUrl = this.data.devUrl
	    this.doLogin()
  		},



#[微信小程序官方文档](https://developers.weixin.qq.com/miniprogram/dev/component/)