var util = require("../../utils/util.js");
var config = require("../../config/config.js");
Page({
  data: {
    companyName: "",
    id: -1,
    authStartTime: "", //授权开始时间
    authEndTime: "", //授权结束时间
    recordStartTime: "", //可查询记录开始时间
    recordEndTime: "", //可查询记录结束时间
    begin: "2000-06-01",
    end: "2100-06-01",
    type: [],
    recordId: "",
    tp: "",
    radioItems: [
      {
        name: "是",
        checked: 0
      },
      {
        name: "否",
        checked: 0
      }
    ]
  },
  // TODO:
  formSubmit: function(e) {
    console.log("form发生了submit事件，携带数据为：", e);
  },
  // radioChange(e) {
  //   const checked = e.detail.value
  //   const changed = {}
  //   for (let i = 0; i < this.data.radioItems.length; i++) {
  //     if (checked.indexOf(this.data.radioItems[i].name) !== -1) {
  //       changed['radioItems[' + i + '].checked'] = 1;
  //     } else {
  //       changed['radioItems[' + i + '].checked'] = 0;
  //     }
  //   }
  //   this.setData(changed)
  //   console.log(this.data.radioItems);
  //   console.log(typeof(this.data.radioItems[1].checked));
  // },
  bindDateChange: function(e) {
    if (e.target.id == "authStartTime") {
      console.log("授权开始时间");
      this.setData({
        authStartTime: e.detail.value
      });
    } else if (e.target.id == "authEndTime") {
      var that = this;
      console.log(e.detail.value);
      that.setData({
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

  //请求
  submitForm: function(e) {
    //转为unix时间
    var authST = util.formatToDate(this.data.authStartTime) / 1000 + 14400;
    var authET = util.formatToDate(this.data.authEndTime) / 1000 + 14400;
    var recordST = util.formatToDate(this.data.recordStartTime) / 1000 + 14400;
    var recordET = util.formatToDate(this.data.recordEndTime) / 1000 + 14400;
    var tag = "disagree";
    if (e.target.dataset["type"] == "agree") {
      tag = "agree";
    }
    var that = this;
    var t2;
    if (tag == "agree") {
      t2 = "授权";
    } else if (tag == "disagree") {
      t2 = "拒绝授权";
    }
    if (this.data.radioItems[0].checked)
      var attachment = this.data.radioItems[0].checked;
    else {
      attachment = 0;
    }
    wx.showLoading({
      title: "请稍等...",
      mask: true
    });
    wx.request({
      url: config.authorizedUrl,
      method: "POST",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        companyName: this.data.companyName,
        loginFlag: wx.getStorageSync("loginFlag"),
        authStartTime: authST,
        authEndTime: authET,
        recordStartTime: recordST,
        recordEndTime: recordET,
        tag: tag,
        recordId: this.data.recordId,
        attachment: attachment
      },
      success: function(e) {
        wx.hideLoading();
        wx.showToast({
          title: t2 + "成功",
          icon: "success"
        });
        //读取服务器的授权和未授权信息，并跳转其他页面
        util.getAuthoList(i => {
          if (i == 2) {
            wx.navigateBack({
              delta: 1
            });
          }
        });
      },
      fail: function(e) {
        wx.hideLoading();
        wx.showToast({
          title: t2 + "失败",
          icon: "none"
        });
      }
    });
    // TODO: 目前submit后会更新申请与授权，后期应根据form不同更新不同数据

    //更新红点
    var numApply = wx.getStorageSync("granteeUnautho").length;
    var numAutho = wx.getStorageSync("grantorUnautho").length;
    if (numApply <= 0 && numAutho <= 0) {
      wx.hideTabBarRedDot({
        index: 2
      });
    } else {
      wx.showTabBarRedDot({
        index: 2
      });
    }
  },

  // 加载url中的参数,同时完成unix转普通时间
  onLoad: function(option) {
    const changed = {};
    var options = wx.getStorageSync("infoQuery");
    if (options.attachment == 0) {
      changed["radioItems[" + 1 + "].checked"] = 1;
      changed["radioItems[" + 0 + "].checked"] = 0;
    } else {
      changed["radioItems[" + 1 + "].checked"] = 0;
      changed["radioItems[" + 0 + "].checked"] = 1;
    }
    console.log(options.attachment);
    this.setData({
      companyName: options.user,
      authStartTime: util.msToDate(options.authStartTime).withoutTime,
      authEndTime: util.msToDate(options.authEndTime).withoutTime,
      recordStartTime: util.msToDate(options.recordStartTime).withoutTime,
      recordEndTime: util.msToDate(options.recordEndTime).withoutTime,
      id: options.id,
      type: options.type,
      recordId: options.recordId,
      tp: option.tp //记录的是申请或授权状态
    });
    this.setData(changed);
  }
});
