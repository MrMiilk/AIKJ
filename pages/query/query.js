// pages/query/query.js
const api = require("../../config/config.js");
var util = require("../../utils/util.js");

Page({
  data: {
    disabled_name: false,
    companyName: "",
    recordStartTime: "",
    recordEndTime: "",
    begin: "2000-06-01",
    end: "2100-06-01",
    name: ""
  },

  inputComName: function(e) {
    var _this = this;
    _this.setData({
      companyName: e.detail.value
    });
  },
  formSubmit: function(e) {
    let loginFlag = wx.getStorageSync("loginFlag");
    if (!loginFlag){
      wx.showToast({
        title: "您还未登录，请先登录",
        icon: "none"
      });
      return;
    }
    console.log("form发生了submit事件，携带数据为：", e);
    var _this = this;

    //转为unix时间
    // var authST = util.formatToDate(this.data.authStartTime) / 1000 + 14400;
    // var authET = util.formatToDate(this.data.authEndTime) / 1000 + 14400;
    var recordST = util.formatToDate(this.data.recordStartTime) / 1000 + 14400;
    var recordET = util.formatToDate(this.data.recordEndTime) / 1000 + 14400;
    if (recordST > recordET) {
      wx.showToast({
        title: "时间错误",
        icon: "none"
      });
      return;
    }
    var date = new Date();
    date = util.formatToDate(date) / 1000 + 14400;
    wx.request({
      url: api.queryUrl,
      //url: 'http://127.0.0.1:80',
      data: {
        companyName: this.data.companyName,
        loginFlag: wx.getStorageSync("loginFlag"),
        // "authStartTime": authST,
        // "authEndTime": authET,
        startTime: recordST,
        endTime: recordET,
        timeStamp: date // TODO: 发起请求的时间，unix时间戳
      },
      method: "POST",
      success: function(e) {
        if (e.statusCode == 200) {
          wx.setStorageSync("table", e.data);
          wx.navigateTo({
            url: "../table/table"
          });
        } else {
          wx.showToast({
            title: e.data,
            icon: "none"
          });
        }
      },
      fail: function(e) {
        wx.showToast({
          title: "发送失败",
          icon: "none"
        });
      }
    });
  },

  bindDateChange: function(e) {
    if (e.target.id == "recordStartTime") {
      this.setData({
        recordStartTime: e.detail.value
      });
    } else if (e.target.id == "recordEndTime") {
      this.setData({
        recordEndTime: e.detail.value
      });
    }
  },

  onReady: function() {
    this.setData({
      recordStartTime: util.formatTime(new Date(), "yyyy-MM-dd"),
      recordEndTime: util.formatTime(new Date(), "yyyy-MM-dd")
    });
  }
});
