var util = require("../../utils/util.js");
var config = require("../../config/config.js");

// 获取全局唯一的语音识别管理器
const plugin = requirePlugin("WechatSI");
const manager = plugin.getRecordRecognitionManager();

Page({
  data: {
    tabitemVoice: {},
    tabitemForm: {},
    tabitemSign: {},
    activeTabId: null,
    filetext: "上传",
    /* 语音识别信息 */
    currentText: "", //识别内容
    isClick: false,
    /* 记账相关信息 */
    summary: "", //null, //分类信息
    debit: "", //借方科目
    debitAmount: null, //借方金额
    credit: "", //贷方科目
    creditAmount: null, //贷方金额
    date: "", //日期
    secondCompName: "",
    thirdCompName: "",
    sendButtonText: "生成报表",
    filePath: [],
    timestamp: ""
  },

  tabChange(e) {
    if (e.detail.source == "touch") {
      var id = e.detail.currentItemId;
      console.log(e.detail.currentItemId);
      this.setActiveTab(id);
    }
  },

  tabclick(e) {
    var id = e.target.id;
    console.log(id);
    this.setActiveTab(id);
  },

  setActiveTab(id) {
    console.log(id);
    console.log(this.data.activeTabId);
    var rect = this.data[id];
    if (rect) {
      this.animation.width(rect.width).translate(rect.left, 0);
      this.setData({
        activeTabId: id,
        indicatorAnim: this.animation.step().export()
      });
    }
  },

  /* 语音识别页面 */
  //记账信息
  vtextAreaBlur: function(e) {
    this.setData({
      currentText: e.detail.value
    });
  },

  //开始与结束录音
  streamRecord: function() {
    manager.start({
      lang: "zh_CN"
    });
    wx.showToast({
      title: "开始录音",
      icon: "none"
    });
    console.log("录音开始");
  },
  streamRecordEnd: function() {
    console.log("录音结束");
    manager.stop();
    wx.showToast({
      title: "录音结束",
      icon: "none"
    });
  },
  upload: function() {
    console.log("上传再次查看", this.data.filePath);
    var url_ =
      "../uploadImage/uploadImage" +
      "?filePath=" +
      JSON.stringify(this.data.filePath);
    wx.navigateTo({
      url: url_
    });
  },
  initRecord: function() {
    //有新的识别内容返回，则会调用此事件
    manager.onRecognize = res => {
      let text = res.result;
      this.setData({
        currentText: text
      });
    };
    // 识别结束事件
    manager.onStop = res => {
      let text = res.result;
      if (text == "") {
        // 用户没有说话，可以做一下提示处理...
        return;
      }
      this.setData({
        currentText: text
      });
    };
  },
  sendData: function() {
    var that = this;

    wx.showLoading({
      title: "请稍等...",
      mask: true
    });
    /* 得到完整识别内容发给语音服务器处理 */
    wx.request({
      url: config.voiceUrl,
      // url: "http://27.152.156.24:80/api/analysis/analysis",
      data: {
        text: this.data.currentText
      },
      method: "POST",
      success: function(res) {
        wx.hideLoading();
        that.setData({
          summary: res.data.data[0].summary,
          debit: res.data.data[0].debit,
          debitAmount: parseFloat(res.data.data[0].debit_amount),
          credit: res.data.data[0].credit,
          creditAmount: parseFloat(res.data.data[0].credit_amount)
        });
        that.setActiveTab("tabitemForm");
      },
      fail: function(res) {
        console.log(res);
        wx.hideLoading();
        wx.showToast({
          title: "记录生成失败，请重试",
          icon: "none"
        });
      }
    });
  },

  /* 表单页面 */
  //摘要信息输入
  summaryFunction: function(e) {
    var text = e.detail.value;
    //this.data.summary = text;
    this.setData({
      summary: text
    });
  },
  //借方科目
  debitFunction: function(e) {
    this.setData({
      debit: e.detail.value
    });
  },
  //借方金额
  debitAmFunction: function(e) {
    this.setData({
      debitAmount: e.detail.value
    });
  },
  //贷方科目
  creditFunction: function(e) {
    this.setData({
      credit: e.detail.value
    });
  },
  //贷方金额
  creditAmFunction: function(e) {
    this.setData({
      creditAmount: e.detail.value
    });
  },
  thirdCompanyFunction: function(e) {
    this.setData({
      thirdCompName: e.detail.value
    });
    console.log(this.data.thirdCompName);
  },
  secondCompFunction: function(e) {
    this.setData({
      secondCompName: e.detail.value
    });
    console.log(this.data.secondCompName);
  },
  //选择时间
  onDateChange: function(e) {
    this.setData({
      date: e.detail.value
    });
  },

  // 签名记录
  signBill: function() {
    let loginFlag = wx.getStorageSync("loginFlag");
    var that = this;
    //util.getApplyList();
    if (loginFlag) {
      // util.getSignList();
      that.setActiveTab("tabitemSign");
    } else {
      // TODO:弹出登录提示框
      wx.showToast({
        title: "您还未登录，请先登录",
        icon: "none",
        duration: 2000
      });
    }
  },

  //点击完成,将结果发给服务器
  confirmData: function() {
    var that = this;
    if (
      parseFloat(that.data.debitAmount) <= 0 ||
      parseFloat(that.data.creditAmount) <= 0
    ) {
      wx.showToast({
        title: "金额不能为0",
        icon: "none",
        duration: 1500
      });
      return;
    } else if (that.data.debit == "" || that.data.credit == "") {
      wx.showToast({
        title: "请输入科目",
        icon: "none",
        duration: 1500
      });
      return;
    }

    //精确到秒，定位为当天12点
    var timestamp = parseInt(new Date().valueOf() / 1000);
    that.setData({
      timestamp: timestamp
    });
    var unixtime = util.formatToDate(that.data.date) / 1000 + 14400;
    console.log("交易方信息");
    console.log(that.data.secondCompName);
    wx.showLoading({
      title: "请稍等..."
    });

    wx.request({
      url: config.insertUrl,
      data: {
        loginFlag: wx.getStorageSync("loginFlag"),
        summary: that.data.summary,
        debit: that.data.debit,
        debitAmount: parseFloat(that.data.debitAmount),
        credit: that.data.credit,
        creditAmount: parseFloat(that.data.creditAmount),
        time: unixtime,
        secondCompName: that.data.secondCompName,
        thirdCompName: that.data.thirdCompName,
        timeStamp: timestamp
      },
      method: "post",
      success(res) {
        console.log("------", res);
        if (res.statusCode == 200) {
          var itemId = res.data;
          console.log(that.data.filePath);
          // 上传附件
          if (that.data.filePath.length) {
            that.uploadDIY(
              that.data.filePath,
              0,
              that.data.filePath.length,
              itemId,
              unixtime
            );
          } else {
            wx.hideLoading();
            wx.showToast({
              title: "记录成功",
              icon: "success"
            });
          }
        } else {
          wx.hideLoading();
          wx.showToast({
            title: res.data,
            icon: "none"
          });
        }
      },
      fail(res) {
        wx.hideLoading();
        wx.showToast({
          title: "记录失败",
          icon: "none"
        });
        console.log("失败");
      }
    });
  },
  uploadDIY(filePaths, i, length, itemId, unixtime) {
    if (i == length) {
      wx.hideLoading();
      wx.showToast({
        title: "记录成功",
        icon: "success"
      });
      return;
    }
    var that = this;
    wx.uploadFile({
      url: config.uploadUrl,
      filePath: filePaths[i],
      name: "file",
      header: {
        "Content-Type": "multipart/form-data"
      },
      formData: {
        loginFlag: wx.getStorageSync("loginFlag"),
        summary: that.data.summary,
        debit: that.data.debit,
        debitAmount: parseFloat(that.data.debitAmount),
        credit: that.data.credit,
        creditAmount: parseFloat(that.data.creditAmount),
        time: unixtime,
        timeStamp: parseInt(that.data.timestamp),
        secondCompName: that.data.secondCompName,
        thirdCompName: that.data.thirdCompName,
        index: i,
        itemId: itemId
      },
      success: res => {
        console.log(">>>>>>>>", res);
        that.uploadDIY(filePaths, i + 1, length, itemId, unixtime);
        console.log("成功上传");
      },
      fail: res => {
        wx.hideLoading();
        wx.showToast({
          title: "附件上传失败",
          icon: "none"
        });
      }
    });
  },
  onLoad: function(options) {
    // 页面加载 options为页面跳转所带来的参数
    this.initRecord();
  },
  onReady: function() {
    this.setData({
      date: util.formatTime(new Date(), "yyyy-MM-dd")
    });
  },

  onShow: function(res) {
    /* 滑动动画相关 */
    var query = wx.createSelectorQuery().in(this),
      _this = this;
    console.log("Bill:", this.data.filePath);
    _this.animation = wx.createAnimation({
      duration: 500, //动画持续时间
      timingFunction: "ease" //动画效果
    });
    query.select("#tabitemForm").boundingClientRect(function(rect) {
      console.log("来自show");
      _this.setData({
        tabitemForm: rect
      });
    });
    query.select("#tabitemVoice").boundingClientRect(function(rect) {
      _this.setData({
        tabitemVoice: rect
      });
    });
    query.exec();
  }
});
