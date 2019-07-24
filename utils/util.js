var api = require("../config/config.js");

/**
 * 发送网络请求GET
 */
function HttpGet(url, parm, response) {
  wx.request({
    url: url,
    data: parm,
    header: {
      //'Content-Type': 'application/json'
    },
    success: function(res) {
      return typeof response == "function" && response(res.data);
    },
    fail: function(res) {
      return typeof response == "function" && response(false);
    }
  });
}

/**
 * 发送网络请求POST
 */
function HttpPost(url, parm, response) {
  wx.request({
    url: url,
    data: this.json2Form(parm),
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
    },
    method: "POST",
    success: function(res) {
      return typeof response == "function" && response(res.data);
    },
    fail: function(res) {
      return typeof response == "function" && response(false);
    }
  });
}

/**
 * 判空
 */
function isNull(data) {
  if (data == "" || data == undefined || data == null) {
    return true;
  } else {
    return false;
  }
}

// const formatTime = date => {
//   const year = date.getFullYear()
//   const month = date.getMonth() + 1
//   const day = date.getDate()
//   const hour = date.getHours()
//   const minute = date.getMinutes()
//   const second = date.getSeconds()

//   return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
// }

/**
 * 时间格式转化date对象->其他
 */
function formatTime(date, format) {
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  if (month < 10) {
    month = "0" + month;
  }

  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();
  var week = date.getUTCDay();

  switch (format) {
    case "yyyy-MM-dd":
      return [year, month, day].map(formatNumber).join("-");
      break;
    case "yyyy年MM月dd日":
      return year + "年" + month + "月" + day + "日";
      break;
    case "yyyy年MM月dd日 hh:mm":
      return (
        year + "年" + month + "月" + day + "日" + " " + hour + ":" + minute
      );
      break;
    case "MM.dd":
      return month + "." + day;
      break;
    case "yyyy-MM":
      return year + "-" + month;
      break;
    case "yyyy":
      return year;
      break;
    case "hh:mm:ss":
      return [hour, minute, second].map(formatNumber).join(":");
      break;
    case "hh:mm":
      return [hour, minute].map(formatNumber).join(":");
      break;
    case "week":
      var weekDay = "";
      switch (week) {
        case 0:
          weekDay = "星期天";
          break;
        case 1:
          weekDay = "星期一";
          break;
        case 2:
          weekDay = "星期二";
          break;
        case 3:
          weekDay = "星期三";
          break;
        case 4:
          weekDay = "星期四";
          break;
        case 5:
          weekDay = "星期五";
          break;
        case 6:
          weekDay = "星期六";
          break;
      }
      return weekDay;
      break;
    default:
      return (
        [year, month, day].map(formatNumber).join("-") +
        " " +
        [hour, minute, second].map(formatNumber).join(":")
      );
      break;
  }
}

const formatNumber = n => {
  n = n.toString();
  return n[1] ? n : "0" + n;
};

/**
 * 时间字符串转unix时间戳
 */
function formatToDate(dateString) {
  var timestamp2 = Date.parse(new Date(dateString));
  //console.log(dateString + "的时间戳为：" + timestamp2);
  return timestamp2;
}

/* unix时间戳转时间字符串 */
function msToDate(msec) {
  let datetime = new Date(msec * 1000);
  let year = datetime.getFullYear();
  let month = datetime.getMonth();
  let date = datetime.getDate();
  let hour = datetime.getHours();
  let minute = datetime.getMinutes();
  let second = datetime.getSeconds();

  let result1 =
    year +
    "-" +
    (month + 1 >= 10 ? month + 1 : "0" + (month + 1)) +
    "-" +
    (date + 1 < 10 ? "0" + date : date) +
    " " +
    (hour + 1 < 10 ? "0" + hour : hour) +
    ":" +
    (minute + 1 < 10 ? "0" + minute : minute) +
    ":" +
    (second + 1 < 10 ? "0" + second : second);

  let result2 =
    year +
    "-" +
    (month + 1 >= 10 ? month + 1 : "0" + (month + 1)) +
    "-" +
    (date + 1 < 10 ? "0" + date : date);

  let result = {
    hasTime: result1,
    withoutTime: result2
  };
  return result;
}

/**
 * 判断时间是否相同
 */
function dateIsDifference(startDate, endDate, dateType) {
  //转化为一个格式

  switch (dateType) {
    case "day":
    case "d": //同一天
      let startDay = formatTime(new Date(startDate), "yyyy-MM-dd");
      let endDay = formatTime(new Date(endDate), "yyyy-MM-dd");
      if (startDay == endDay) {
        return true;
        break;
      } else {
        return false;
        break;
      }
    case "month":
    case "n": //同一月
      let startMonth = formatTime(new Date(startDate), "yyyy-MM");
      let endMonth = formatTime(new Date(endDate), "yyyy-MM");
      if (startMonth == endMonth) {
        return true;
        break;
      } else {
        return false;
        break;
      }
    case "year":
    case "y": //同一年
      let startYear = formatTime(new Date(startDate), "yyyy");
      let endYear = formatTime(new Date(endDate), "yyyy");
      if (startYear == endYear) {
        return true;
        break;
      } else {
        return false;
        break;
      }
    default:
      return false;
  }
}

function msToDate(msec) {
  let datetime = new Date(msec * 1000);
  let year = datetime.getFullYear();
  let month = datetime.getMonth();
  let date = datetime.getDate();
  let hour = datetime.getHours();
  let minute = datetime.getMinutes();
  let second = datetime.getSeconds();

  let result1 =
    year +
    "-" +
    (month + 1 >= 10 ? month + 1 : "0" + (month + 1)) +
    "-" +
    (date + 1 < 10 ? "0" + date : date) +
    " " +
    (hour + 1 < 10 ? "0" + hour : hour) +
    ":" +
    (minute + 1 < 10 ? "0" + minute : minute) +
    ":" +
    (second + 1 < 10 ? "0" + second : second);

  let result2 =
    year +
    "-" +
    (month + 1 >= 10 ? month + 1 : "0" + (month + 1)) +
    "-" +
    (date + 1 < 10 ? "0" + date : date);

  let result = {
    hasTime: result1,
    withoutTime: result2
  };
  return result;
}
/**
 * 求时间差
 */
function timeDifference(startDate, endDate, dateType) {
  var date3 = new Date(endDate).getTime() - new Date(startDate).getTime(); //时间差的毫秒数
  //计算出相差天数
  var days = Math.floor(date3 / (24 * 3600 * 1000));
  var hours = (date3 / (3600 * 1000)).toFixed(1);
  var minutes = Math.floor(date3 / (60 * 1000));
  var seconds = Math.round(date3 / 1000);

  // var leave1 = date3 % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  // var hours = Math.floor(leave1 / (3600 * 1000))
  //计算相差分钟数
  // var leave2 = leave1 % (3600 * 1000)        //计算小时数后剩余的毫秒数
  // var minutes = Math.floor(leave2 / (60 * 1000))
  //计算相差秒数
  // var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  // var seconds = Math.round(leave3 / 1000)

  switch (dateType) {
    case "D":
      return day;
      break;
    case "H":
      return hours + "h";
      break;
    case "M":
      return minutes;
      break;
    default:
      return seconds;
      break;
  }
}

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

/**
 * 将小程序的API封装成支持Promise的API
 * @params fn {Function} 小程序原始API，如wx.login
 */
const wxPromisify = fn => {
  return function(obj = {}) {
    return new Promise((resolve, reject) => {
      obj.success = function(res) {
        resolve(res);
      };

      obj.fail = function(res) {
        reject(res);
      };

      fn(obj);
    });
  };
};
function getSignQuery(itemId, party, callback) {
  wx.request({
    url: api.signQueryUrl,
    data: {
      loginFlag: wx.getStorageSync("loginFlag"),
      itemId: itemId,
      party: party
    },
    method: "POST",
    success: function(res) {
      wx.setStorageSync("BillInfo", "");
      if (res.statusCode == 200) {
        wx.setStorageSync("BillInfo", res.data);
        callback();
      } else {
        wx.showToast({
          title: res.data,
          icon: "none"
        });
      }
    },
    fail: function(res) {
      console.log(res);
    }
  });
}
/* 获取授权列表信息 */
function getAuthoList(callback) {
  var i = 0;
  //未授权列表
  wx.request({
    url: api.grantorUnauthoUrl,
    data: {
      loginFlag: wx.getStorageSync("loginFlag")
    },
    method: "POST",
    success: function(res) {
      wx.setStorageSync("grantorUnautho", "");
      if (res.statusCode == 200) {
        wx.setStorageSync("grantorUnautho", res.data);
        setNum();
        callback(i++);
      } else {
        wx.showToast({
          title: res.data,
          icon: "none"
        });
      }
    },
    fail: function(res) {
      wx.showToast({
        title: "请求待授权查询列表失败",
        icon: "none"
      });
      console.log(res);
    }
  });
  //已授权列表
  wx.request({
    url: api.grantorAuthoUrl,
    data: {
      loginFlag: wx.getStorageSync("loginFlag")
    },
    method: "POST",
    success: function(res) {
      wx.setStorageSync("grantorAutho", "");
      if (res.statusCode == 200) {
        wx.setStorageSync("grantorAutho", res.data);
        callback(i++);
      } else {
        wx.showToast({
          title: res.data,
          icon: "none"
        });
      }
    },
    fail: function(res) {
      wx.showToast({
        title: "请求已授权查询列表失败",
        icon: "none"
      });
      console.log(res);
    }
  });
  //拒绝列表
  wx.request({
    url: api.grantorUnauthoRefuseUrl,
    data: {
      loginFlag: wx.getStorageSync("loginFlag")
    },
    method: "POST",
    success: function(res) {
      wx.setStorageSync("grantorUnauthoRefuse", "");
      if (res.statusCode == 200) {
        wx.setStorageSync("grantorUnauthoRefuse", res.data);
        callback(i++);
      } else {
        wx.showToast({
          title: res.data,
          icon: "none"
        });
      }
    },
    fail: function(res) {
      wx.showToast({
        title: "请求拒绝授权查询列表失败",
        icon: "none"
      });
      console.log(res);
    }
  });
}

/* 获取申请列表信息 */
function getApplyList(callback) {
  var i = 0;
  //未接受列表
  wx.request({
    url: api.granteeUnauthoUrl,
    data: {
      loginFlag: wx.getStorageSync("loginFlag")
    },
    method: "POST",
    success: function(res) {
      wx.setStorageSync("granteeUnautho", "");
      if (res.statusCode == 200) {
        wx.setStorageSync("granteeUnautho", res.data);
        callback(i++);
      } else {
        wx.showToast({
          title: res.data,
          icon: "none"
        });
      }
    },
    fail: function(res) {
      wx.showToast({
        title: "请求待接收申请查询列表失败",
        icon: "none"
      });
      console.log(res);
    }
  });
  //已接受列表
  wx.request({
    url: api.granteeAuthoUrl,
    data: {
      loginFlag: wx.getStorageSync("loginFlag")
    },
    method: "POST",
    success: function(res) {
      wx.setStorageSync("granteeAutho", "");
      if (res.statusCode == 200) {
        wx.setStorageSync("granteeAutho", res.data);
        callback(i++);
      } else {
        wx.showToast({
          title: res.data,
          icon: "none"
        });
      }
    },
    fail: function(res) {
      wx.showToast({
        title: "请求已接收申请查询列表失败",
        icon: "none"
      });
      console.log(res);
    }
  });
  //拒绝列表
  wx.request({
    url: api.granteeUnauthoRefuseUrl,
    data: {
      loginFlag: wx.getStorageSync("loginFlag")
    },
    method: "POST",
    success: function(res) {
      wx.setStorageSync("granteeUnauthoRefuse", "");
      if (res.statusCode == 200) {
        wx.setStorageSync("granteeUnauthoRefuse", res.data);
        setNum();
        callback(i++);
      } else {
        wx.showToast({
          title: res.data,
          icon: "none"
        });
      }
    },
    fail: function(res) {
      wx.showToast({
        title: "请求已拒绝申请查询列表失败",
        icon: "none"
      });
      console.log(res);
    }
  });
}

/* 获取签名列表信息 */
function getSignList(callback) {
  //未授权列表
  var i = 0;
  wx.request({
    url: api.unsignedUrl,
    data: {
      loginFlag: wx.getStorageSync("loginFlag")
    },
    method: "POST",
    success: function(res) {
      wx.setStorageSync("unsigned", "");
      if (res.statusCode == 200) {
        wx.setStorageSync("unsigned", res.data);
        setNum();
        callback(i++);
      } else {
        wx.showToast({
          title: res.data,
          icon: "none"
        });
      }
    },
    fail: function(res) {
      wx.showToast({
        title: "请求待签名记录列表失败",
        icon: "none"
      });
      console.log(res);
    }
  });
  //已授权列表
  wx.request({
    url: api.signedUrl,
    data: {
      loginFlag: wx.getStorageSync("loginFlag")
    },
    method: "POST",
    success: function(res) {
      wx.setStorageSync("signed", "");
      if (res.statusCode == 200) {
        wx.setStorageSync("signed", res.data);
        callback(i++);
      } else {
        wx.showToast({
          title: res.data,
          icon: "none"
        });
      }
    },
    fail: function(res) {
      wx.showToast({
        title: "请求已签名记录列表失败",
        icon: "none"
      });
      console.log(res);
    }
  });
  //拒绝列表
  wx.request({
    url: api.signedRefuseUrl,
    data: {
      loginFlag: wx.getStorageSync("loginFlag")
    },
    method: "POST",
    success: function(res) {
      wx.setStorageSync("signedRefuse", "");
      if (res.statusCode == 200) {
        wx.setStorageSync("signedRefuse", res.data);
        callback(i++);
      } else {
        wx.showToast({
          title: res.data,
          icon: "none"
        });
      }
    },
    fail: function(res) {
      wx.showToast({
        title: "请求拒签记录列表失败",
        icon: "none"
      });
      console.log(res);
    }
  });
}

function setNum() {
  var numApply = wx.getStorageSync("granteeUnautho").length;
  var numAutho = wx.getStorageSync("grantorUnautho").length;
  var numSign = wx.getStorageSync("unsigned").length;
  if (numApply <= 0 && numAutho <= 0 && numSign <= 0) {
    wx.hideTabBarRedDot({
      index: 2
    });
  } else {
    wx.showTabBarRedDot({
      index: 2
    });
  }
}

module.exports = {
  isNull: isNull,
  HttpGet: HttpGet,
  HttpPost: HttpPost,
  formatTime: formatTime,
  formatToDate: formatToDate,
  msToDate: msToDate,
  timeDifference: timeDifference,
  json2Form: json2Form,
  dateIsDifference: dateIsDifference,
  wxPromisify: wxPromisify,
  getApplyList: getApplyList,
  getAuthoList: getAuthoList,
  getSignList: getSignList,
  getSignQuery: getSignQuery,
  setNum: setNum
};
