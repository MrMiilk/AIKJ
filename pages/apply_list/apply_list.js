// pages/apply_list_1/apply_list.js
var util = require("../../utils/util.js");

Page({
  data: {
    tabitemConsume: {},
    tabitemRecharge: {},
    activeTabId: null,
    currentTab: 0,
    granteeUnautho: {},
    granteeAutho: {},
    granteeUnauthoRefuse: {}
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
  goApply: function() {
    wx.navigateTo({
      url: "../apply/apply?new=1"
    });
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

  /* 下拉刷新，获取最新申请列表*/
  onPullDownRefresh: function() {
    util.getApplyList(() => {});
    this.onShow();
  },

  onReady: function() {},
  onLoad: function() {},
  onShow: function() {
    this.setData({
      granteeUnautho: wx.getStorageSync("granteeUnautho"),
      granteeAutho: wx.getStorageSync("granteeAutho"),
      granteeUnauthoRefuse: wx.getStorageSync("granteeUnauthoRefuse")
    });
  },

  toDetail: function(e) {
    let index = e.currentTarget.id;
    console.log(e);
    let url_ = "../apply/apply?" + "&tp=" + e.target.dataset["tp"];
    if (e.target.dataset["tp"] == "4") {
      {
        wx.setStorageSync("infoQuery",this.data.granteeUnautho[index]);
      }
    } else if (e.target.dataset["tp"] == "5") {
      wx.setStorageSync("infoQuery", this.data.granteeAutho[index]);
    } else if (e.target.dataset["tp"] == "6") {
      wx.setStorageSync("infoQuery", this.data.granteeUnauthoRefuse[index]);
    }
    wx.navigateTo({
      url: url_,
      fail: function(e) {
        console.log(e);
      }
    });
  },
  addNewClient: function() {
    wx.navigateTo({
      url: "../query/query",
      fail: function(e) {
        console.log(e);
      }
    });
  }
});
