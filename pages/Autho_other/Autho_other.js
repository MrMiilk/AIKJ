// pages/apply_list_1/apply_list.js
var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
    tabitemConsume: {},
    tabitemRecharge: {},
    activeTabId: null,
    currentTab: 0,
    grantorAutho: {},
    grantorUnautho: {},
    grantorUnauthoRefuse: {}
  },
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    });
  },

  tabChange(e) {
    if (e.detail.source == "touch") {
      this.setActiveTab(e.detail.currentItemId);
    }
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
      });
    }
  },

  /* 下拉刷新，自动监听 */
  onPullDownRefresh: function() {
    util.getAuthoList(() => {});
    this.onShow();
  },

  onReady: function() {},

  /* 加载页面 */
  onLoad: function() {},
  onShow: function() {
    this.setData({
      grantorUnautho: wx.getStorageSync("grantorUnautho"),
      grantorAutho: wx.getStorageSync("grantorAutho"),
      grantorUnauthoRefuse: wx.getStorageSync("grantorUnauthoRefuse")
    });
  },

  toDetail: function(e) {
    let index = e.currentTarget.id;
    let url_ = "../authorize/authorize?" + "tp=" + e.target.dataset["tp"];
    if (e.target.dataset["tp"] == "1") {
      wx.setStorageSync("infoQuery", this.data.grantorUnautho[index]); 
    } else if (e.target.dataset["tp"] == "2") {
      wx.setStorageSync("infoQuery", this.data.grantorAutho[index]); 
    } else if (e.target.dataset["tp"] == "3") {
      wx.setStorageSync("infoQuery", this.data.grantorUnauthoRefuse[index]); 
    }
    wx.navigateTo({
      url: url_,
      fail: function(e) {
        console.log(e);
      }
    });
  }
});
