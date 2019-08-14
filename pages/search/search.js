const app = getApp()
const amapWX = require('../../common/amap-wx.js')
const MapAk = require('../../common/mapKey.js')
Page({
  data: {
    tips: {}, 
    startLocation:'',
    startLocationCode:'',
    toLocation:'',
    toLocationCode:'',
    flag:'',

  },
  onLoad: function () {

  },
  bindInput: function (e) {
    var that = this;
    var keywords = e.detail.value;
    var myAmapFun = new amapWX.AMapWX({ key: MapAk.MapAk });
    myAmapFun.getInputtips({
      keywords: keywords,
      location: '',
      success: function (data) {
        if (data && data.tips) {
          that.setData({
            tips: data.tips
          });
        }

      }
    })
  },
  bindSearch: function (e) {
    let keywords = e.target.dataset.keywords;
    let location = e.target.dataset.code;
    if (this.data.flag===1){
      this.setData({
        startLocation: keywords,
        startLocationCode: location,
        tips: {}
      })
    }else{
      this.setData({
        toLocation: keywords,
        toLocationCode: location,
        tips: {}
      })
    }
  }, 
  setFlag(e){
    console.log(e.currentTarget.dataset.id)
    if (e.currentTarget.dataset.id === '1'){
      this.setData({
        flag:1
      })
    }else{
      this.setData({
        flag:2
      })
    }
  },
  getWays(){
    wx.navigateTo({
      url: `../way/way?start=${this.data.startLocationCode}&end=${this.data.toLocationCode}`,
    })
  }
})