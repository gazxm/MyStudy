module.exports = {
  line: {
    chart: {
      type: 'line',
    },
    title: {
      text: '订单折线图'
    },
    xAxis: {
      tickInterval: 3600 * 1000, // 坐标轴刻度间隔为一星期
      tickWidth: 0,
      gridLineWidth: 1,
      // 时间格式化字符
      // 默认会根据当前的刻度间隔取对应的值，即当刻度间隔为一周时，取 week 值
      dateTimeLabelFormats: {
          week: '%Y-%m'
      }
    },
    yAxis: {
      title: {
        text: '订单数量'
      }
    },
    series: [
        {
          name: '新增订单',
          data: [7.0, 6.9, 9.5, 14.5, 18.4, 21.5, 25.2, 26.5, 23.3, 18.3, 13.9, 9.6]
        },{
          name: '新增保单',
          data: [3.9, 4.2, 5.7, 8.5, 11.9, 15.2, 17.0, 16.6, 14.2, 10.3, 6.6, 4.8]
          // data:newProtecedOrder
        }
        ,{
          name:'新增取消订单',
          data:[]
        },{
          name:'新增待接受订单',
          data:[]
        },{
          name:'新增待服务订单',
          data:[]
        },{
          name:'已完成订单',
          data:[]
        },{
          name:'已完成订单总额',
          data:[]
        }
  ]
  }
}
