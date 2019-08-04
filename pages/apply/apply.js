// pages/query/query.js
const api = require("../../config/config.js");
var util = require("../../utils/util.js");

Page({
  data: {
    companyName: "",
    authStartTime: "",
    authEndTime: "",
    recordStartTime: "",
    recordEndTime: "",
    begin: "1950-06-01",
    end: "2100-06-01",
    name: "",
    new: false,
    radioItems: [{ name: "是" }, { name: "否", checked: 1 }]
  },
  radioChange(e) {
    const checked = e.detail.value;
    const changed = {};
    for (let i = 0; i < this.data.radioItems.length; i++) {
      if (checked.indexOf(this.data.radioItems[i].name) !== -1) {
        changed["radioItems[" + i + "].checked"] = 1;
      } else {
        changed["radioItems[" + i + "].checked"] = 0;
      }
    }
    this.setData(changed);
    console.log(this.data.radioItems);
  },

  inputComName: function(e) {
    this.setData({
      companyName: e.detail.value
    });
  },
  formSubmit: function(e) {
    //转为unix时间
    var authST = util.formatToDate(this.data.authStartTime) / 1000 + 14400;
    var authET = util.formatToDate(this.data.authEndTime) / 1000 + 14400;
    var recordST = util.formatToDate(this.data.recordStartTime) / 1000 + 14400;
    var recordET = util.formatToDate(this.data.recordEndTime) / 1000 + 14400;
    var date = new Date();
    date = util.formatToDate(date) / 1000 + 14400;
    var that = this;
    if (this.data.radioItems[0].checked)
      var attachment = this.data.radioItems[0].checked;
    else {
      attachment = 0;
    }
    console.log(attachment);
    wx.showLoading({
      title: "请稍等...",
      mask: true
    });
    wx.request({
      url: api.requestAuthoUrl,
      data: {
        companyName: this.data.companyName,
        loginFlag: wx.getStorageSync("loginFlag"),
        authStartTime: authST,
        authEndTime: authET,
        recordStartTime: recordST,
        recordEndTime: recordET,
        timeStamp: date,
        attachment: attachment
      },
      method: "POST",
      success: function(e) {
        wx.hideLoading();
        if (e.statusCode == 200) {
          wx.showToast({
            title: "申请发送成功",
            icon: "success"
          });
          util.getApplyList(i => {
            if (i == 2) {
              wx.navigateBack({
                delta: 1
              });
            }
          });
        } else {
          wx.showToast({
            title: e.data,
            icon: "none"
          });
        }
      },
      fail: function(e) {
        wx.hideLoading();
        wx.showToast({
          title: "申请发送失败",
          icon: "none"
        });
      }
    });
  },

  bindDateChange: function(e) {
    if (e.target.id == "authStartTime") {
      this.setData({
        authStartTime: e.detail.value
      });
    } else if (e.target.id == "authEndTime") {
      this.setData({
        authEndTime: e.detail.value
      });
    } else if (e.target.id == "recordStartTime") {
      this.setData({
        recordStartTime: e.detail.value
      });
    } else if (e.target.id == "recordEndTime") {
      this.setData({
        recordEndTime: e.detail.value
      });
    }
  },

  onLoad: function(option) {
    if (option.new) {
      this.setData({
        new: true,
        authStartTime: util.formatTime(new Date(), "yyyy-MM-dd"),
        authEndTime: util.formatTime(new Date(), "yyyy-MM-dd"),
        recordStartTime: util.formatTime(new Date(), "yyyy-MM-dd"),
        recordEndTime: util.formatTime(new Date(), "yyyy-MM-dd")
      });
    } else {
      var options = wx.getStorageSync("infoQuery");
      const changed = {};
      if (options.attachment == 0) {
        changed["radioItems[" + 1 + "].checked"] = 1;
        changed["radioItems[" + 0 + "].checked"] = 0;
      } else {
        changed["radioItems[" + 1 + "].checked"] = 0;
        changed["radioItems[" + 0 + "].checked"] = 1;
      }
      this.setData({
        new: false,
        companyName: options.user,
        authStartTime: util.msToDate(options.authStartTime).withoutTime,
        authEndTime: util.msToDate(options.authEndTime).withoutTime,
        recordStartTime: util.msToDate(options.recordStartTime).withoutTime,
        recordEndTime: util.msToDate(options.recordEndTime).withoutTime
      });
      this.setData(changed);
    }
  }
});
