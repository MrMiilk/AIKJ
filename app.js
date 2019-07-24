const api = require("./config/config.js");
const util = require("./utils/util.js");

App({
  onLaunch: function() {
    let that = this;
    // 检查登录状态
    that.checkLoginStatus();
  },

  /* 监听小程序启动或切前台
     向后台request授权与申请信息，得到数据存入storage */
  onShow: function(options) {
    var j = 0;
    util.getApplyList(() => {});
    util.getAuthoList(() => {});
    util.getSignList(() => {});
  },

  // 检查本地 storage 中是否有登录态标识
  checkLoginStatus: function() {
    let that = this;
    let loginFlag = wx.getStorageSync("loginFlag");
    if (loginFlag) {
      // 检查 session_key 是否过期
      wx.checkSession({
        // session_key 有效(不过期)
        success: function() {
          // 直接从Storage中获取用户信息
          let userStorageInfo = wx.getStorageSync("userInfo");
          if (userStorageInfo) {
            that.globalData.userInfo = JSON.parse(userStorageInfo);
          } else {
            that.showInfo("缓存信息缺失");
            console.error(
              "登录成功后将用户信息存在Storage的userStorageInfo字段中，该字段丢失"
            );
          }
        },
        // session_key 过期
        fail: function() {
          // session_key过期
          console.log("需求登录");
          wx.setStorageSync("userInfo", "");
          wx.setStorageSync("loginFlag", "");
        }
      });
    } else {
      // 无登录态
    }
  },

  // 登录动作
  doLogin: function(callback = () => {}) {
    let that = this;
    wx.login({
      success: function(loginRes) {
        if (loginRes.code) {
          /*
           * @desc: 获取用户信息 期望数据如下
           *
           * @param: userInfo       [Object]
           * @param: rawData        [String]
           * @param: signature      [String]
           * @param: encryptedData  [String]
           * @param: iv             [String]
           **/
          wx.getUserInfo({
            withCredentials: true, // 非必填, 默认为true
            success: function(infoRes) {
              // 请求服务端的登录接口
              //console.log(infoRes)
              wx.request({
                url: api.loginUrl,
                data: {
                  code: loginRes.code, // 临时登录凭证
                  rawData: infoRes.rawData, // 用户非敏感信息
                  signature: infoRes.signature, // 签名
                  encryptedData: infoRes.encryptedData, // 用户敏感信息
                  iv: infoRes.iv // 解密算法的向量
                },

                success: function(res) {
                  console.log("login success");
                  res = res.data;

                  if (res.result == 0) {
                    that.globalData.userInfo = res.userInfo;
                    wx.setStorageSync("userInfo", JSON.stringify(res.userInfo));
                    wx.setStorageSync("loginFlag", res.skey);
                    callback();
                  } else {
                    that.showInfo(res.errmsg);
                  }
                },

                fail: function(error) {
                  // 调用服务端登录接口失败
                  that.showInfo("调用接口失败");
                  console.log(error);
                }
              });
            },

            fail: function(error) {
              // 获取 userInfo 失败，去检查是否未开启权限
              wx.hideLoading();
              that.checkUserInfoPermission();
              console.log("获取 userInfo 失败");
            }
          });
        } else {
          // 获取 code 失败
          that.showInfo("登录失败");
          console.log("调用wx.login获取code失败");
        }
      },

      fail: function(error) {
        // 调用 wx.login 接口失败
        that.showInfo("接口调用失败");
        console.log(error);
      }
    });
  },

  // 检查用户信息授权设置
  checkUserInfoPermission: function(callback = () => {}) {
    wx.getSetting({
      success: function(res) {
        if (!res.authSetting["scope.userInfo"]) {
          wx.openSetting({
            success: function(authSetting) {
              console.log(authSetting);
            }
          });
        }
      },
      fail: function(error) {
        console.log(error);
      }
    });
  },

  // 获取用户登录标示 供全局调用
  getLoginFlag: function() {
    return wx.getStorageSync("loginFlag");
  },

  // 封装 wx.showToast 方法
  showInfo: function(info = "error", icon = "none") {
    wx.showToast({
      title: info,
      icon: icon,
      duration: 1500,
      mask: true
    });
  },

  // app全局数据
  globalData: {
    userInfo: null
  }
});
