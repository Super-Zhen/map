const app = getApp()
const amapWX = require('../../common/amap-wx.js')
const MapAk = require('../../common/mapKey.js')
Page({
  data: {
    tips: {}
  },
  onLoad: function () {

  },
  bindInput: function (e) {
    var that = this;
    var keywords = e.detail.value;
    // var key = config.Config.key;
    var myAmapFun = new amapWX.AMapWX({ key: MapAk.MapAk });
    myAmapFun.getInputtips({
      keywords: keywords,
      location: '',
      success: function (data) {
        console.log(data)
        if (data && data.tips) {
          that.setData({
            tips: data.tips
          });
        }

      }
    })
  },
  bindSearch: function (e) {
    var keywords = e.target.dataset.keywords;
    var url = app.globalData.requsetUrl+'/poi/poi?keywords=' + keywords;
    console.log(url)
    // wx.redirectTo({
    //   url: url
    // })
  }
})