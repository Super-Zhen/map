// pages/map/map.js
const app = getApp()
const amapWX = require('../../common/amap-wx.js')
const MapAk = require('../../common/mapKey.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight:'', // 页面高度
    winWidth:'',  // 页面宽度
    latitude:'39.90469000000001', // 经度
    longitude:' 116.40717000000001',   // 纬度
    enableTraffic: false, // 是否开启路线
    scale:16, // 缩放级别
    headImg: "../../img/centerPoint.png", // 设置固定点的图片
    isShow:true, // 头像是否显示
    markers:[],
    headimgHeight:80,
    headimgWidth: 50,
    markArray:[],
    regeocode:'',
    imgsArray:[]
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    
    console.log('onLoad')
    // this.initMap()
    that.checkSetting()
    // that.setControls()
    that.mapCtx = wx.createMapContext('myMap')
    setTimeout(function () {
      that.mapCtx.moveToLocation()
    }, 1000)
  },
  /**
   * 判断用户是否进行了地址访问授权
   */
  checkSetting() {
    let that = this
    wx.getSetting({
      success(res){
        if(!res.authSetting['scope.userLocation']){
          wx.authorize({
            scope: 'scope.userLocation',
            success(ress){
              console.log(ress)
            },
            fail(){
             wx.showModal({
               title: '提示',
               content: '定位失败，请开启定位权限',
               cancelText:'取消',
               confirmText:'确定',
               success(resss){
                 console.log(res)
                 wx.openSetting({
                   success(ressss){
                     if (ressss.authSetting['scope.userLocation']) {
                      //  console.log('初始化地图')
                       that.getScreenHeight()
                     }else{
                       console.log('用户未同意授权')
                     }
                   }
                 })
               }
             })
            }
          })
        }else{
          that.getScreenHeight()
        }
      },
      fali(e){
        console.log('Error','checkSetting')
      },
      complete(){
        // console.log('complete','complete')
      }
    })
  },
  /**
   * 设置controls
   */
  setControls(){
    let that = this
    wx.downloadFile({
      url: app.globalData.userInfo.avatarUrl,
      success(res) {
        that.setData({
          headImg:res.tempFilePath
        })
      }
    })
  },
  /**
   * 获取点击的点
   */
  tapMap(e){
    let that = this
    const query = wx.createSelectorQuery()
    query.select('#bottom-view').boundingClientRect()
    query.selectViewport().scrollOffset()
    query.exec(function (res) {
      console.log(res[0].height)
      that.setData({
        winHeight: that.data.winHeight-res[0].height
      })
      // res[0].top       // #the-id节点的上边界坐标
      // res[1].scrollTop // 显示区域的竖直滚动位置
    })
  },
  /**
   * 查找路线
   */
  toWay(){
    wx.redirectTo({
      url: '../way/way',
    })
  },
  /**
   * 是否开启路况
   */
  enableTraffic(){
    this.setData({
      enableTraffic: !this.data.enableTraffic
    })
  },
  /**
   * 拖动地图变化
   */
  getCenterLocation(e){
    // debugger
     let that = this
    // if (e.type == 'end' && e.causedBy === 'drag') { //用于地图拖拽的时候自动获取 
    that.mapCtx.getCenterLocation({
      success: function (res) {
        console.log('getCenterLocation----------------------->');
        console.log(res);
        that.setData({
          markArray: [res.longitude, res.latitude]
        })
        that.getWayName()
        that.tapMap()
        that.setData({
          isShow:false
        })
        // that.setMarks(res.longitude,res.latitude)
        // that.updateCenterLocation(res.latitude, res.longitude);
        // that.regeocodingAddress();
        // that.queryMarkerInfo();
      }
    })
    // } else { //begin
    // }
   
  },
  /**
   * 设置mark点
   */
  setMarks(longitude, latitude){
    let that = this
    that.setData({
      isShow:false,
      markers: [{
        id: 0,
        iconPath: "../../img/centerPoint.png",
        longitude: longitude,
        latitude: latitude,
        width: 25,
        height: 40
      }]
    })
  },
  /**
   * 路线
   */
  getWay(){
    var that = this;
    
    var myAmapFun = new amapWX.AMapWX({ key: MapAk.MapAk });
    myAmapFun.getRegeo({
      success: (res) => {
        console.log(res, res[0].regeocodeData.formatted_address)
        this.setData({
          address: res[0].regeocodeData.formatted_address
        })
      }
    })
    // myAmapFun.getWeather({
    //   success: function (data) {
    //     console.log(data)
    //   },
    //   fail: function (info) {
    //     //失败回调
    //     console.log(info)
    //   }
    // })
  },
  /**
   * 获取页面高低
   */
  getScreenHeight(){
    let that = this
    wx.getSystemInfo({
      success: function(res) {
        console.log(res)
        that.setData({
          winHeight: res.windowHeight,
          winWidth: res.windowWidth
        })
      },
    })
  },
  /**
   * 调取相机
   */
  getCamera(){
    let that = this
    wx.chooseImage({
      count:1,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success(res){
        console.log(res.tempFiles)
        that.data.imgsArray.push(res.tempFiles)
        that.setData({
          imgsArray: that.data.imgsArray
        })
        console.log(that.data.imgsArray)
      },
      fail(e){
        console.log(e) 
      }
    })
    // let CameraContext = wx.createCameraContext()
    // CameraContext.takePhoto({
    //   success(res){
    //     console.log(res)
    //   }
    // })
  },
  /**
   * 获取自身所在的位置
   */
  getSelfLocation(){
    let that = this
    setTimeout(function () { 
      that.mapCtx.moveToLocation()
      // that.setControls()
    },100)
    that.setData({
      scale:16,
      // headimgHeight:60,
      // headimgWidth:60,
      markers:[]
    })
  },
  /**
   * 获取周围的道路名称
   */
  getWayName(){
    // wx.showModal({
    //   title: '提示',
    //   content: '是否获取周边街道建筑',
    // })
    let that = this
    wx.request({
      url: app.globalData.requsetUrl,
      data:{
        key:MapAk.MapAk,
        location: that.data.markArray[0] + "," + that.data.markArray[1],
        extensions:'all',
        s:'rsx'
      },
      success(data){
        console.log(data)
        that.setData({
          regeocode: data.data.regeocode
        })
      }
    })
  },






  translateMarker: function () {
    this.mapCtx.translateMarker({
      markerId: 0,
      autoRotate: true,
      duration: 1000,
      destination: {
        latitude: 23.10229,
        longitude: 113.3345211,
      },
      animationEnd() {
        console.log('animation end')
      }
    })
  },
  includePoints: function () {
    this.mapCtx.includePoints({
      padding: [10],
      points: [{
        latitude: 23.10229,
        longitude: 113.3345211,
      }, {
        latitude: 23.00229,
        longitude: 113.3345211,
      }]
    })
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log('onReady')
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log('onShow')
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log('onHide')
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})