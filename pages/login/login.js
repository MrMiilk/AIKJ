/** index.js **/
//获取app实例
const app = getApp();
var util=require("../../utils/util");
Page({
  data: {
    userInfo: {},           // 用户信息
    hasLogin: wx.getStorageSync('loginFlag')
      ? true
      : false,              // 是否登录，根据后台返回的skey判断
    numApply: 0,            // TODO:未接受申请数量
    numAutho: 0,            // TODO:未授权授权数量
    showModalStatus: false, // 模态弹窗
    imageUrl:'../../images/coin.png', //未登录的头像
    timeIDs: new Array()    // TODO:清除计时器
  },
  
  // 检查本地 storage 中是否有skey登录态标识
  checkLoginStatus: function () {
    let that = this;
    let loginFlag = wx.getStorageSync('loginFlag');
    if (loginFlag) {
      // 检查 session_key 是否过期
      wx.checkSession({
        // session_key 有效(未过期)
        success: function () {
          // 获取用户头像/昵称等信息
          that.getUserInfo();

        },
        // session_key 已过期
        fail: function () {
          that.setData({
            hasLogin: false
          });
        }
      });

    } else {
      that.setData({
        hasLogin: false
      });
    }
  },

  /**
   * 执行登录操作
   */
  doLogin: function () {
    let that = this;
    wx.showLoading({
      title: '请稍等...',
      mask: true
    });
    app.doLogin(()=>{
      that.getUserInfo();
      util.getApplyList(() => {
        that.setData({
          numApply: wx.getStorageSync('granteeUnautho').length,
        });
      });
      util.getAuthoList(()=>{
        that.setData({
          numAutho: wx.getStorageSync('grantorUnautho').length,
        });
      });
    });
    
  },

  /**
   * 从 globalData 中获取 userInfo
   */
  getUserInfo: function () {
    let that = this;
    let userInfo = app.globalData.userInfo;
    if (userInfo) {
      that.setData({
        hasLogin: true,
        userInfo: userInfo
      });
      wx.hideLoading();
    } else {
      console.log('globalData中userInfo为空');
    }
  },

  /**
   * TODO:两个页面跳转
   */

  goApply: function () {
    let loginFlag = wx.getStorageSync('loginFlag');
    util.getAuthoList();
    util.getApplyList();
    if (loginFlag) {
      wx.navigateTo({
        url: '../apply_list/apply_list',
      })
    }
    else {
      // TODO:弹出登录提示框
      wx.showToast({
        title: '请先登录',
        icon:'none',
        duration:2000
      })
    }
  },

  onLoad: function () {
    this.checkLoginStatus();
  },
  onShow: function () {
    let that = this;
    //设置用户登录信息；根据未接受申请和未同意授权，更新
    that.setData({
      userInfo: app.globalData.userInfo,
      numApply: wx.getStorageSync('granteeUnautho').length,
      numAutho: wx.getStorageSync('grantorUnautho').length,
    });
  },

  toComReg: function () {
    wx.navigateTo({
      url: '../regist_company/regist_company',
      fail: function(e){
        console.log(e)
      }
    });
  },

  applyInitiate: function(){
     wx.navigateTo({
       url: '../Autho_other/Autho_other',
       fail: function (e) {
         console.log(e);
       }
     });
  },
  
  powerDrawer: function (e) {
    var currentStatu = e.currentTarget.dataset.statu;
    this.util(currentStatu)
  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200,  //动画时长
      timingFunction: "linear", //线性
      delay: 0  //0则不延迟
    });

    // 第2步：这个动画实例赋给当前的动画实例
    this.animation = animation;

    // 第3步：执行第一组动画
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画
    this.data.timeIDs[0] = setTimeout(function () {
      // 执行第二组动画
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象
      this.setData({
        animationData: animation
      })

      //关闭
      if (currentStatu == "close") {
        this.setData(
          {
            showModalStatus: false,
          }
        );
      }
    }.bind(this), 200)

    // 显示
    if (currentStatu == "open") {
      this.setData(
        {
          showModalStatus: true,
        }
      );
    }
  },
  onUnload: function () {
    for (var i = 0; i < this.data.timeIDs.length; i++) {
      clearTimeout(this.data.timeIDs[i]);
    }
  },
  onHide: function () {
    for (var i = 0; i < this.data.timeIDs.length; i++) {
      clearTimeout(this.data.timeIDs[i]);
    }
  }
})