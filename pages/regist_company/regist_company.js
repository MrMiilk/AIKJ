var config = require('../../config/config.js')
Page({
  data: {
    hidden: true,
    btnValue: '',
    btnDisabled: false,
    companyName: '',
    phone: '',
    code: '',
    second: 60,
    isCode:'',
    currentText:''
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  getCompanyName: function(e) {
    this.setData({
      companyName: e.detail.value
    })
  },
  bindNameInput:function(e){
    this.setData({
      companyName: e.detail.value
    })
  },
  bindPhoneInput:function(e){
    var val = e.detail.value;
    var _this=this;
    var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/
    if(val[0]!='1'||val.length>11)
     {
      _this.setData({
        hidden: true,
        btnValue: ''
      })
       wx.showToast({
         title: '手机格式不正确',
         icon:'none',
       })
     }
     else if(val.length==11)
    {
      if(!myreg.test(val)){
        wx.showToast({
          title: '手机格式错误',
          icon:'none'
        })
      }
      else{
        _this.setData({
          phone: val,
          hidden: false,
          btnValue: '获取验证码'
        })
      }
    }
  },
  bindCodeInput:function(e){
    this.setData({
      code: e.detail.value
    })
  },
  getSellArea:function(e){
     this.setData({
       currentText:e.detail.value,
     })
  },
  getCode:function(){
    console.log('获取验证码');
    //这里获得验证码
    var _this=this;
    //向对应服务器发起请求，获得验证码
    wx.request({
      url: 'http://127.0.0.1:8080/',
      header:{
        "Content-Type":"application/json"
      },
      method:'POST',
      data:{
        token:wx.getStorageSync("token"),
        phone:this.data.phone,
      },
      success(res){
        console.log(res);
        _this.setData({
          isCode:res.data
        })
        console.log(_this.data.isCode);
      }
    })
    this.timer();
  },
  timer: function () {
    let promise = new Promise((resolve, reject) => {
      let setTimer = setInterval(
        () => {
          var second = this.data.second - 1;
          this.setData({
            second: second,
            btnValue: "还有"+second + '秒',
            btnDisabled: true
          })
          if (this.data.second <= 0) {
            this.setData({
              second: 60,
              btnValue: '获取验证码',
              btnDisabled: false
            })
            resolve(setTimer)
          }
        }
        , 1000)
    })
    promise.then((setTimer) => {
      clearInterval(setTimer)
    })
  },
  //获得信息，1234是发起请求，服务返回是预期的验证码
  getMessage:function(){
    var that=this;
    if(this.data.code=="1234"&&this.data.companyName!=''){
      wx.request({
        url: config.registUrl,
        data: {
          'loginFlag': wx.getStorageSync('loginFlag'),
          'companyName': this.data.companyName,
          'code': this.data.code,
          'businessScope':this.data.currentText,
        },
        method: 'POST',
        //如果公司已注册，提醒用户改公司名
        success: function (res) {
          if(res.statusCode==200){
            wx.showToast({
              title: '注册成功',
              icon: 'none',
            })
            wx.navigateBack({
              delta: 1,
            })
          }else if(res.statusCode==404){
            console.log(that.data.currentText);
            wx.showToast({
              title: '公司名已注册',
              icon: 'none',
            })
          }
        },
        fail: function (res) {
          console.log(res)
          wx.showToast({
            title: '注册失败',
            icon: 'none',
          })
        }

      })
      console.log(this.data);
    }
    else{
      wx.showToast({
        title: '验证码或手机号错误',
        icon:'none',
      })
    }
  }
})
