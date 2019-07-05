
// pages/apply_list_1/apply_list.js
var util = require('../../utils/util.js');

Page({
  data: {
    tabitemConsume: {},
    tabitemRecharge: {},
    activeTabId: null,
    currentTab: 0,
    granteeUnautho: {},
    granteeAutho: {},
    granteeUnauthoRefuse:{},
  },
  navbarTap: function (e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    })
  },

  tabChange(e) {
    if (e.detail.source == "touch") {
      this.setActiveTab(e.detail.currentItemId);
    }
  },
  goApply:function(){
    wx.navigateTo({
      url: '../apply/apply',
    })
  },
  tabclick(e) {
    this.setActiveTab(e.target.id);
  },

  setActiveTab(id) {
    var rect = this.data[id];
    if (rect) {
      this.animation.width(rect.width).translate(rect.left, 0);
      this.setData({
        activeTabId: id,
        indicatorAnim: this.animation.step().export()
      })
    }
  },

  /* 下拉刷新，获取最新申请列表*/
  onPullDownRefresh: function () {
    util.getApplyList();
    this.onShow();
  },
  
  onReady: function () {

  },
  onLoad:function(){
  },
  onShow: function () {
    this.setData({
      granteeUnautho: wx.getStorageSync('granteeUnautho'),
      granteeAutho: wx.getStorageSync('granteeAutho'),
      granteeUnauthoRefuse: wx.getStorageSync('granteeUnauthoRefuse'),
    })
  },

  toDetail: function (e) {
    let index = e.currentTarget.id;
    let url_ = '../authorize/authorize?' + 'tp=' + e.target.dataset["tp"]
    if (e.target.dataset["tp"] == '4') {
      url_ = url_ +
        "&companyName=" + this.data.granteeUnautho[index].user +
        "&id=" + this.data.granteeUnautho[index].id +
        "&authStartTime=" + util.msToDate(this.data.granteeUnautho[index].authStartTime).withoutTime +
        "&authEndTime=" + util.msToDate(this.data.granteeUnautho[index].authEndTime).withoutTime +
        "&recordStartTime=" + util.msToDate(this.data.granteeUnautho[index].recordStartTime).withoutTime +
        "&recordEndTime=" + util.msToDate(this.data.granteeUnautho[index].recordEndTime).withoutTime +
        "&type=" + this.data.granteeUnautho[index].type + "&recordId=" + this.data.granteeUnautho[index].recordId + "&t=" + e.target.dataset["tp"];
    }
    else if (e.target.dataset["tp"] == '5') {
      url_ = url_ +
        "&companyName=" + this.data.granteeAutho[index].user +
        "&id=" + this.data.granteeAutho[index].id +
        "&authStartTime=" + util.msToDate(this.data.granteeAutho[index].authStartTime).withoutTime +
        "&authEndTime=" + util.msToDate(this.data.granteeAutho[index].authEndTime).withoutTime +
        "&recordStartTime=" + util.msToDate(this.data.granteeAutho[index].recordStartTime).withoutTime +
        "&recordEndTime=" + util.msToDate(this.data.granteeAutho[index].recordEndTime).withoutTime +
        "&type=" + this.data.granteeAutho[index].type + this.data.granteeAutho[index].type + "&recordId=" + this.data.granteeAutho[index].recordId + "&t=" + e.target.dataset["tp"];
    }
    else if (e.target.dataset["tp"] == '6') {
      url_ = url_ +
        "&companyName=" + this.data.granteeUnauthoRefuse[index].user +
        "&id=" + this.data.granteeUnauthoRefuse[index].id +
        "&authStartTime=" + util.msToDate(this.data.granteeUnauthoRefuse[index].authStartTime).withoutTime +
        "&authEndTime=" + util.msToDate(this.data.granteeUnauthoRefuse[index].authEndTime).withoutTime +
        "&recordStartTime=" + util.msToDate(this.data.granteeUnauthoRefuse[index].recordStartTime).withoutTime +
        "&recordEndTime=" + util.msToDate(this.data.granteeUnauthoRefuse[index].recordEndTime).withoutTime +
        "&type=" + this.data.granteeUnauthoRefuse[index].type + this.data.granteeUnauthoRefuse[index].type + "&recordId=" + this.data.granteeUnauthoRefuse[index].recordId + "&t=" + e.target.dataset["tp"];
    }
    wx.navigateTo({
      url: url_,
      fail: function(e) {
        console.log(e)
      }
    })
  },
  addNewClient:function(){
    wx.navigateTo({
      url: '../query/query',
      fail: function (e) {
        console.log(e)
      }
    })
  }
})