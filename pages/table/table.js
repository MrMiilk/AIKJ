Page({
  data: {
    clientHeight: 0,     //屏幕高度
    /* 利润 */
    profitData: [],   //资产负债数据
    profitItems: [
      {
        '营业收入': 0,
        '营业成本': 1,
        '税金及附加': 2,
        '销售费用': 3,
        '管理费用': 4,
        '财务费用': 5,
        '资产减值损失': 6,
        '公允价值变动收益': 7,
        '净敞口套期收益': 8,
        '投资收益': 9,
        '对联营企业和合营企业的投资收益': 10,
        '资产处置收益': 11,
        '其他收益': 12,
      },
      {
        '营业利润': 0,
        '营业外收入': 1,
        '营业外支出': 2,
      },
      {
        '利润总额': 0,
        '所得税费用': 1,
      },
      {
        '净利润': 0,
        '持续经营净利润': 1,
        '终止经营净利润': 2,
      },
      {
        '其他综合收益的税后净额': 0,
        '重新设定受益计划净资产或净负债的变动': 1,
        '权益法下在被投资单位不能重分类进损益的其他综合收益中享有的份额': 2,
        '权益法下在被投资单位以后将重分类进损益的其他综合收益中享有的份额': 3,
        '其他债权投资公允价值变动损益': 4,
        '金融资产重分类进损益的累计利得或损失': 5,
        '现金流量套期损益的有效部分': 6,
        '外币财务报表折算差额': 7,
      },
      {
        '综合收益总额': 0,
      },
      {
        '基本每股收益': 0,
        '稀释每股收益': 1,
      },
    ],
    profitView: [],   //最终呈现条目
    /* 资产负债 */
    balanceData: [],  //资产负债数据
    balanceItems: [   //条目索引
      /* 流动资产 */
      {
        '货币资金': 0,
        '交易性金融资产': 1,
        '衍生金融资产': 2,
        '应收票据': 3,
        '应收账款': 4,
        '预付款项': 5,
        '应收利息': 6,
        '应收股利': 7,
        '其他应收款': 8,
        '存货': 9,
        '合同资产': 10,
        '持有待售资产': 11,
        '一年内到期的非流动资产': 12,
        '其他流动资产': 13,
        '流动资产合计': 14,
      },
      /* 非流动资产 */
      {
        '债权投资': 0,
        '其他债权投资': 1,
        '长期应收款': 2,
        '长期股权投资': 3,
        '其他权益工具投资': 4,
        '投资性房地产': 5,
        '固定资产': 6,
        '在建工程': 7,
        '工程物资': 8,
        '固定资产清理': 9,
        '生产性生物资产': 10,
        '油气资产': 11,
        '无形资产': 12,
        '开发支出': 13,
        '商誉': 14,
        '长期待摊费用': 15,
        '递延所得税资产': 16,
        '其他非流动资产': 17,
        '非流动资产合计': 18,
      },
      /* 资产总计 */
      {
        '资产总计': 0
      },

      /* 流动负债 */
      {
        '短期借款': 0,
        '交易性金融负债': 1,
        '衍生金融负债': 2,
        '应付票据': 3,
        '应付账款': 4,
        '预收款项': 5,
        '合同负债': 6,
        '应付职工薪酬': 7,
        '应交税费': 8,
        '应付利息': 9,
        '应付股利': 10,
        '其他应付款': 11,
        '持有待售负债': 12,
        '一年内到期的非流动负债': 13,
        '其他流动负债': 14,
        '流动负债合计': 15,
      },
      /* 非流动负债 */
      {
        '长期借款': 0,
        '应付债券': 1,
        '其中：优先股': 2,
        '永续债': 3,
        '长期应付款': 4,
        '专项应付款': 5,
        '预计负债': 6,
        '递延收益': 7,
        '递延所得税负债': 8,
        '其他非流动负债': 9,
        '非流动负债合计': 10,
      },
      /* 负债总计 */
      {
        "负债合计": 0
      },
      /* 所有者权益(或股东权益) */
      {
        '实收资本（或股本）': 0,
        '其他权益工具': 1,
        '其中：优先股': 2,
        '永续债': 3,
        '资本公积': 4,
        '减：库存股': 5,
        '其他综合收益': 6,
        '盈余公积': 7,
        '未分配利润': 8,
        '所有者权益（或股东权益）合计': 9,
        '负债和所有者权益（或股东权益）合计': 10,
      }
    ],
    balanceView: [],  //最终呈现条目

    /* 现金流量 */
    cashFlowData: [], //现金流量数据
    cashFlowItems: [  //条目索引
      {
        '销售商品_提供劳务收到的现金': 0,
        '收到的税费返还': 1,
        '收到其他与经营活动有关的现金': 2,
        '经营活动现金流入小计': 3,
        '购买商品_接受劳务支付的现金': 4,
        '支付给职工以及为职工支付的现金': 5,
        '支付的各项税费': 6,
        '支付其他与经营活动有关的现金': 7,
        '经营活动现金流出小计': 8,
        '经营活动产生的现金流量净额': 9,
      },
      {
        '收回投资收到的现金': 0,
        '取得投资收益收到的现金': 1,
        '处置固定资产_无形资产和其他长期资产收回的现金净额': 2,
        '处置子公司及其他营业单位收到的现金净额': 3,
        '收到其他与投资活动有关的现金': 4,
        '投资活动现金流入小计': 5,
        '构建固定资产_无形资产和其他长期资产支付的现金': 6,
        '投资支付的现金': 7,
        '取得子公司及其他营业单位支付的现金净额': 8,
        '支付其他与投资活动有关的现金': 9,
        '投资活动现金流出小计': 10,
        '投资活动产生的现金流量净额': 11,
      },
      {
        '吸收投资收到的现金': 0,
        '取得借款收到的现金': 1,
        '收到其他与筹资活动有关的现金': 2,
        '筹资活动现金流入小计': 3,
        '偿还债务支付的现金': 4,
        '分配股利_利润或偿付利息支付的现金': 5,
        '支付其他与筹资活动有关的现金': 6,
        '筹资活动现金流出小计': 7,
        '筹资活动产生的现金流量净额': 8,
      },
      {
        '汇率变动对现金及现金等价物的影响': 0,
      },
      {
        '现金及现金等价物净增加额': 0,
        '期初现金及现金等价物余额': 1,
      },
      {
        '期末现金及现金等价物余额': 0,
      },
    ],
    cashFlowView: [], //最终呈现条目

    activeTabId: null,
  },
  onLoad: function () {
    wx.showLoading({
      title: '报表生成中..',
    })
    this.setData({
      profitData: wx.getStorageSync('table').profit,
      balanceData: wx.getStorageSync('table').balance,
      cashFlowData: wx.getStorageSync('table').cashFlow,
    })
    var text, money, temp, i = 0, item, entry, serialNumber;
    /* 根据profitItems中的索引寻找profitData中的money数据 */
    for (item in this.data.profitItems) {
      entry = this.data.profitItems[item];
      for (text in entry) {
        serialNumber = entry[text];   //序号
        money = this.data.profitData[text];
        temp = 'profitView[' + i + '][' + serialNumber + ']';
        //如果没有对应的金额，默认为0。TODO：增加一个hidden属性，表示是否显示。
        if (money == null) {
          this.setData({
            [temp]: 0,
          })
        }
        else {
          this.setData({
            [temp]: money,
          })
        }
      }
      i++;
    }
    i = 0;
    /* 根据balanceItems中的索引寻找balanceData中的money数据 */
    for(item in this.data.balanceItems){
      entry = this.data.balanceItems[item];
      for (text in entry){
        serialNumber = entry[text];   //序号
        money = this.data.balanceData[text];
        temp = 'balanceView['+ i+ '][' + serialNumber + ']';
        //如果没有对应的金额，默认为0。TODO：增加一个hidden属性，表示是否显示。
        if(money == null){
          this.setData({
            [temp]: 0,
          })
        }
        else{
          this.setData({
            [temp]: money,
          })
        }
      }
      i++;
    }
    i = 0;
    /* 根据cashFlowItems中的索引寻找cashFlowData中的money数据 */
    for (item in this.data.cashFlowItems) {
      entry = this.data.cashFlowItems[item];
      for (text in entry) {
        serialNumber = entry[text];   //序号
        money = this.data.cashFlowData[text];
        temp = 'cashFlowView[' + i + '][' + serialNumber + ']';
        //如果没有对应的金额，默认为0。TODO：增加一个hidden属性，表示是否显示。
        if (money == null) {
          this.setData({
            [temp]: 0,
          })
        }
        else {
          this.setData({
            [temp]: money,
          })
        }
      }
      i++;
    }

    //获取屏幕高度
    var that = this;
    wx.getSystemInfo({
      success(res) {
        that.setData({
          clientHeight: res.windowHeight
        });
      }
    });
  },
  onReady:function(){
    var query = wx.createSelectorQuery().in(this),
      _this = this;
    _this.animation = wx.createAnimation({
      duration: 500,  //动画持续时间
      timingFunction: "ease",  //动画效果
    })
    query.select('#tabitemDebit').boundingClientRect(function (rect) {
      _this.setData({
        tabitemDebit: rect
      });
    })
    query.select('#tabitemCash').boundingClientRect(function (rect) {
      _this.setData({
        tabitemCash: rect
      });
    })
    query.select('#tabitemProfit').boundingClientRect(function (rect) {
      _this.setData({
        tabitemProfit: rect
      });
      _this.setActiveTab('tabitemProfit');
    })
    query.exec();
    
    wx.hideLoading()
  },
   tabChange(e) {
    if (e.detail.source == "touch") {
      var id = e.detail.currentItemId;
      this.setActiveTab(id);
    }
  },

  tabclick(e) {
    var id = e.target.id;
    this.setActiveTab(id);
  },

  setActiveTab(id) {
    var rect = this.data[id];
    if (rect) {
      this.animation.width(rect.width).translate(rect.left, 0);
      this.setData({
        activeTabId: id,
        indicatorAnim: this.animation.step().export()
      })
    }
  },
})
