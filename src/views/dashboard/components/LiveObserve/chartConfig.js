import echarts from 'echarts'

export const observeOption = {
  color: ['#5793f3', '#d14a61', '#675bba'],
  tooltip: {
    trigger: 'none',
    axisPointer: {
      type: 'cross'
    }
  },
  legend: {
    data: ['2015 降水量', '2016 降水量'],
    textStyle: {
      color: '#fff'
    }
  },
  grid: {
    left: '20px',
    right: '20px',
    top: '70px',
    bottom: '30px'
  },
  xAxis: [
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        onZero: false,
        lineStyle: {
          color: '#d14a61'
        }
      },
      axisPointer: {
        label: {
          formatter: function(params) {
            return (
              '降水量  ' +
              params.value +
              (params.seriesData.length ? '：' + params.seriesData[0].data : '')
            )
          }
        }
      },
      data: [
        '2016-1',
        '2016-2',
        '2016-3',
        '2016-4',
        '2016-5',
        '2016-6',
        '2016-7',
        '2016-8',
        '2016-9',
        '2016-10',
        '2016-11',
        '2016-12'
      ]
    },
    {
      type: 'category',
      axisTick: {
        alignWithLabel: true
      },
      axisLine: {
        onZero: false,
        lineStyle: {
          color: '#5793f3'
        }
      },
      axisPointer: {
        label: {
          formatter: function(params) {
            return (
              '降水量  ' +
              params.value +
              (params.seriesData.length ? '：' + params.seriesData[0].data : '')
            )
          }
        }
      },
      data: [
        '2015-1',
        '2015-2',
        '2015-3',
        '2015-4',
        '2015-5',
        '2015-6',
        '2015-7',
        '2015-8',
        '2015-9',
        '2015-10',
        '2015-11',
        '2015-12'
      ]
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: [
    {
      name: '2015 降水量',
      type: 'line',
      xAxisIndex: 1,
      smooth: true,
      data: [
        2.6,
        5.9,
        9.0,
        26.4,
        28.7,
        70.7,
        175.6,
        182.2,
        48.7,
        18.8,
        6.0,
        2.3
      ]
    },
    {
      name: '2016 降水量',
      type: 'line',
      smooth: true,
      data: [
        3.9,
        5.9,
        11.1,
        18.7,
        48.3,
        69.2,
        231.6,
        46.6,
        55.4,
        18.4,
        10.3,
        0.7
      ]
    }
  ]
}

// 仪表盘;
export const guageOption = {
  tooltip: {
    formatter: '{a}: {c}米'
  },
  toolbox: {},
  series: [
    {
      name: '跑道视程',
      type: 'gauge',
      min: 0,
      max: 2100,
      radius: '90px',
      startAngle: 210,
      endAngle: -30,
      splitNumber: 7,
      axisLine: {
        // 坐标轴线
        lineStyle: {
          // 属性lineStyle控制线条样式
          width: 10,
          color: [
            [0.1665, '#c23531'],
            [0.262, '#63869e'],
            [1, '#91c7ae']
          ]
        }
      },
      splitLine: {
        length: 20,
        lineStyle: {
          color: 'auto',
          shadowColor: '#fff',
          shadowBlur: 10,
          fontSize: 10
        }
      },
      title: {
        show: false
      },
      axisLabel: {
        borderRadius: 2,
        padding: 0,
        textShadowOffsetX: 1,
        textShadowOffsetY: 1,
        textShadowColor: '#222'
      },
      detail: {
        formatter: '{value}',
        fontWeight: 'bolder',
        fontSize: 20
      },
      data: [{ value: 2100, name: '跑道视程/m' }]
    }
  ]
}

// 数据参数顺序
var dims = {
  time: 0,
  windSpeed: 1,
  R: 2
}
// 箭头大小
var arrowSize = 12
// 方向绘制
function renderArrow(param, api) {
  var point = api.coord([api.value(dims.time), api.value(dims.windSpeed)])
  return {
    type: 'path',
    shape: {
      pathData: 'M31 16l-15-15v9h-26v12h26v9z',
      x: -arrowSize / 2,
      y: -arrowSize / 2,
      width: arrowSize,
      height: arrowSize
    },
    rotation: ((-api.value(dims.R) - 90) * Math.PI) / 180, // dims.R , //  api.value(dims.R),
    position: point,
    style: api.style({
      stroke: '#2596f0',
      lineWidth: 1,
      fill: '#2596f0'
    })
  }
}
// 风的图表配置;
export const windOption = {
  title: {
    // text: '风速风向数据分析图',
    left: 'center',
    padding: [10, 5],
    textStyle: {
      color: '#000'
    }
  },
  textStyle: {
    color: '#666'
  },
  grid: {
    left: '40px',
    right: '46px',
    top: '50px',
    bottom: '20px',
    show: true,
    containLabel: true
  },
  tooltip: {
    trigger: 'axis',
    formatter: function(params) {
      return [
        // params[0].value[dims.time],
        // echarts.format.formatTime('yyyy-MM-dd', ) +
        //   ' ' +
        //   echarts.format.formatTime('hh:mm', params[0].value[dims.time]),

        '风向：' + params[0].value[dims.R],
        '风速：' + params[0].value[dims.windSpeed]
      ].join('<br>')
    }
  },
  // Math.round((params[0].value[dims.windSpeed] / 90) * 100) / 100
  xAxis: {
    name: '时',
    type: 'category',
    boundaryGap: false
    // type: 'time'
  },
  yAxis: {
    name: '风速（m/s）',
    max: 20,
    axisLine: {
      lineStyle: {
        color: '#666'
      }
    },
    splitLine: {
      lineStyle: {
        color: '#ddd'
      }
    }
  },
  dataZoom: [
    {
      type: 'inside',
      yAxisIndex: 0,
      minSpan: 5
    }
  ],
  series: [
    {
      type: 'custom',
      renderItem: renderArrow,
      encode: {
        x: 0,
        y: 1
      },
      data: [],
      z: 2
    },
    {
      type: 'line',
      symbol: 'none',
      encode: {
        x: 0,
        y: 1
      },
      lineStyle: {
        normal: {
          color: '#79c7f6',
          type: 'dotted'
        }
      },
      data: [],
      z: 1
    }
  ]
}

// 跑道视程配置表;

export const runWayOption = {
  //   tooltip: {
  //     trigger: 'axis'
  // },
  tooltip: {
    trigger: 'axis',
    formatter: function(params) {
      return [
        echarts.format.formatTime('yyyy-MM-dd', params[0].value[dims.time]) +
          ' ' +
          echarts.format.formatTime('hh:mm', params[0].value[dims.time]),

        '风向：' + params[0].value[dims.R],
        '风速：' + params[0].value[dims.windSpeed]
      ].join('<br>')
    }
  },
  // tooltip: {
  //   trigger: 'item',
  //   formatter: '{a} <br/>{b} <br/> {c}米  <br/>'
  // },

  grid: {
    left: '40px',
    right: '46px',
    top: '50px',
    bottom: '20px',
    show: true,
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    name: '米(m)',
    type: 'value'
  },
  series: [
    {
      name: '跑道视距',
      type: 'line',
      smooth: true,
      data: []
    }
  ]
}
