// pages/apply_list_1/apply_list.js
var app = getApp();
var util = require("../../utils/util.js");
var config = require("../../config/config.js");
Page({
  data: {
    tabitemConsume: {},
    tabitemRecharge: {},
    activeTabId: null,
    currentTab: 0,
    currentText: "", //识别内容
    num: 0,
    /* 记账相关信息 */
    summary: null, //分类信息
    debit: "", //借方科目
    debitAmount: null, //借方金额
    credit: "", //贷方科目
    creditAmount: null, //贷方金额
    date: "", //日期
    itemId: "",
    party: "",
    secondSig: "",
    firstSig: "",
    thirdSig: "",
    firstCompName: "",
    secondCompName: "",
    thirdCompName: "",
    allInfo: "",
    startTime: "",
    endTime: "",
    imageSrc: [],
    datetemp: ""
  },
  /* 下拉刷新，自动监听 */
  onPullDownRefresh: function() {
    util.getSignList(() => {});
    this.onShow();
  },
  onReady: function() {},
  /* 加载页面 ,默认加载查询账单的第一份*/
  onLoad: function(options) {
    var res = wx.getStorageSync("cashFlow").flowAccount;
    console.log(res);
    this.setData({
      allInfo: res
    });
    var res = res[0].Record;
    wx.setStorageSync("BillInfo", res);
    console.log(res);
    this.setData({
      summary: res.summary, //分类信息
      debit: res.debit, //借方科目
      debitAmount: res.debitAmount, //借方金额
      credit: res.credit, //贷方科目
      creditAmount: res.creditAmount, //贷方金额
      date: util.msToDate(res.time).withoutTime, //日期
      itemId: res.itemId,
      party: res.party,
      secondSig: res.secondSig,
      firstSig: res.firstSig,
      thirdSig: res.thirdSig,
      firstCompName: res.firstCompName,
      secondCompName: res.secondCompName,
      thirdCompName: res.thirdCompName,
      startTime: parseInt(options.recordStartTime),
      endTime: parseInt(options.recordEndTime),
      datetemp: parseInt(options.date)
    });

    console.log("---", this.data);
  },
  onShow: function() {},
  billnext: function(e) {
    var nowNum = this.data.num;
    var tag = "before";
    if (e.target.dataset["type"] == "next") {
      tag = "next";
    }
    var that = this;
    var n;
    if (tag == "before") {
      n = -1;
    } else if (tag == "next") {
      n = 1;
    }
    console.log(this.data.allInfo.length);
    console.log(nowNum + n);
    if (nowNum + n >= 0 && nowNum + n < this.data.allInfo.length) {
      var res = this.data.allInfo[nowNum + n].Record;
      wx.setStorageSync("BillInfo", res);
      this.setData({
        summary: res.summary, //分类信息
        debit: res.debit, //借方科目
        debitAmount: res.debitAmount, //借方金额
        credit: res.credit, //贷方科目
        creditAmount: res.creditAmount, //贷方金额
        date: util.msToDate(res.time).withoutTime, //日期
        itemId: res.itemId,
        party: res.party,
        secondSig: res.secondSig,
        firstSig: res.firstSig,
        thirdSig: res.thirdSig,
        firstCompName: res.firstCompName,
        secondCompName: res.secondCompName,
        thirdCompName: res.thirdCompName,
        num: nowNum + n
      });
    } else {
      var text = "顶";
      if (n == 1) text = "底";
      wx.showToast({
        title: "您的页面已到" + text,
        icon: "none"
      });
    }
  },
  goSignInfo: function() {
    wx.navigateTo({
      url: "../SignInfo/SignInfo"
    });
  },
  //判断是否有权限并获取图片展示出来
  checkfile: function() {
    var that = this;
    var url_ =
      config.downloadUrl +
      "?companyName=" +
      that.data.firstCompName +
      "&loginFlag=" +
      wx.getStorageSync("loginFlag") +
      "&startTime=" +
      that.data.startTime +
      "&endTime=" +
      that.data.endTime +
      "&timeStamp=" +
      that.data.datetemp +
      "&attachment=" +
      1 +
      "&itemId=" +
      that.data.itemId;
    var tempPath = [];
    wx.showLoading({
      title: "请稍等..."
    });
    that.download(url_, 0, tempPath);
  },
  download(url, index, tempPath) {
    var that = this;

    wx.downloadFile({
      url: url + "&index=" + index,
      success: function(res) {
        console.log(index, "------", res);
        if (res.statusCode == 200) {
          tempPath.push(res.tempFilePath);
          console.log(index);
          that.download(url, index + 1, tempPath);
        } else {
          wx.hideLoading();
          that.setData({
            imageSrc: tempPath
          });
          console.log(tempPath);
          var urlTemp =
            "../BillImage/BillImage" + "?filePath=" + JSON.stringify(tempPath);
          wx.navigateTo({
            url: urlTemp
          });
        }
      },
      fail: function(res) {
        wx.hideLoading();
        wx.showToast({
          title: "附件下载失败",
          icon: "none"
        });
        console.log("********", res);
      }
    });
  }
});
