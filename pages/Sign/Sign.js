// pages/apply_list_1/apply_list.js
var app = getApp();
var util = require("../../utils/util.js");
Page({
  data: {
    tabitemConsume: {},
    tabitemRecharge: {},
    activeTabId: null,
    currentTab: 0,
    signed: {},
    unsigned: {},
    signedRefuse: {}
  },
  navbarTap: function(e) {
    this.setData({
      currentTab: e.currentTarget.dataset.idx
    });
  },

  tabChange(e) {
    if (e.detail.source == "touch") {
      this.setActiveTab(e.detail.currentitemId);
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
    util.getSignList(() => {});
    this.onShow();
  },

  onReady: function() {},

  /* 加载页面 */
  onLoad: function() {},
  onShow: function() {
    this.setData({
      unsigned: wx.getStorageSync("unsigned"),
      signed: wx.getStorageSync("signed"),
      signedRefuse: wx.getStorageSync("signedRefuse")
    });
  },
  //tp是决定是拒绝同意的标志
  toDetail: function(e) {
    wx.showLoading({
      title: "请稍等...",
      mask: true
    });
    setTimeout(() => {
      wx.hideLoading();
    }, 500);
    var index = e.currentTarget.id;
    var url_ = "../SignBill/SignBill?" + "tp=" + e.target.dataset["tp"];
    var itemId;
    var party;
    if (e.target.dataset["tp"] == "7") {
      itemId = this.data.unsigned[index].itemId;
      party = this.data.unsigned[index].party;
    } else if (e.target.dataset["tp"] == "8") {
      itemId = this.data.signed[index].itemId;
      party = this.data.signed[index].party;
    } else if (e.target.dataset["tp"] == "9") {
      itemId = this.data.signedRefuse[index].itemId;
      party = this.data.signedRefuse[index].party;
    }
    util.getSignQuery(itemId, party, () =>
      wx.navigateTo({
        url: url_,
        fail: function(e) {
          console.log(e);
        }
      })
    );
    console.log(url_);
  }
});
