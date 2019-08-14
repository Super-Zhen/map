// pages/way/way.js
const amapWX = require('../../common/amap-wx.js')
const MapAk = require('../../common/mapKey.js')
Page({
  data: {
    markers: [
      {
      // iconPath: "../../img/mapicon_navi_s.png",
      id: 0,
      latitude: 39.989643,
      longitude: 116.481028,
      width: 23,
      height: 33
    }, {
      // iconPath: "../../img/mapicon_navi_e.png",
      id: 0,
      latitude: 39.90816,
      longitude: 116.434446,
      width: 24,
      height: 34
    }],
    distance: '',
    cost: '',
    polyline: [],
    option:'',
    flag:1
  },
  onLoad: function (option) {
    this.setData({
      option: option
    })
    var that = this;
    // 设置地图上显示两个点
    that.mapCtx = wx.createMapContext('navi_map')
    that.mapCtx.includePoints({
      padding: [50],
      points: [{
        latitude: option.start.split(',')[1],
        longitude: option.start.split(',')[0],
      }, {
          latitude: option.end.split(',')[1],
          longitude: option.end.split(',')[0],
      }]
    })
    that.setData({
      markers: [{
        id: 0,
        latitude: option.start.split(',')[1],
        longitude: option.start.split(',')[0],
        width: 23,
        height: 33
      }, {
        id: 0,
          latitude: option.end.split(',')[1],
          longitude: option.end.split(',')[0],
        width: 24,
        height: 34
      }]
    })
    that.goToCar()
  },
  goDetail: function () {
    wx.navigateTo({
      url: '../navigation/navigation'
    })
  },
  goToCar: function () {
    let that = this
    that.setData({
      flag:1
    })
    let option = that.data.option
    var myAmapFun = new amapWX.AMapWX({ key: MapAk.MapAk });
    myAmapFun.getDrivingRoute({
      origin: option.end, // end
      destination: option.start, // start
      success: function (data) {
        var points = [];
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          wx.setStorageSync('steps', JSON.stringify(data.paths))
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.taxi_cost) {
          that.setData({
            cost: '打车约' + parseInt(data.taxi_cost) + '元'
          });
        }

      },
      fail: function (info) {

      }
    })
  },
  goToWalk: function () {
    var that = this;
    that.setData({
      flag: 2
    })
    let option = that.data.option
    // var key = config.Config.key;
    var myAmapFun = new amapWX.AMapWX({ key: MapAk.MapAk });
    myAmapFun.getWalkingRoute({
      origin: option.end, // end
      destination: option.start, // start
      success: function (data) {
        var points = [];
        wx.setStorageSync('steps', JSON.stringify(data.paths))
        if (data.paths && data.paths[0] && data.paths[0].steps) {
          var steps = data.paths[0].steps;
          for (var i = 0; i < steps.length; i++) {
            var poLen = steps[i].polyline.split(';');
            for (var j = 0; j < poLen.length; j++) {
              points.push({
                longitude: parseFloat(poLen[j].split(',')[0]),
                latitude: parseFloat(poLen[j].split(',')[1])
              })
            }
          }
        }
        that.setData({
          polyline: [{
            points: points,
            color: "#0091ff",
            width: 6
          }]
        });
        if (data.paths[0] && data.paths[0].distance) {
          that.setData({
            distance: data.paths[0].distance + '米'
          });
        }
        if (data.paths[0] && data.paths[0].duration) {
          that.setData({
            cost: parseInt(data.paths[0].duration / 60) + '分钟'
          });
        }

      },
      fail: function (info) {

      }
    })
  }
})