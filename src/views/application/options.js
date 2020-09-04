var dataBJ = [
  ['2020-02-02', 'Sunny'],
  ['2020-02-03', 'Sunny'],
  ['2020-02-04', 'Sunny'],
  ['2020-02-05', 'Sunny'],
  ['2020-02-06', 'Showers'],
  ['2020-02-07', 'Sunny'],
  ['2020-02-08', 'Sunny'],
  ['2020-02-09', 'Sunny'],
  ['2020-02-10', 'Sunny'],
  ['2020-02-11', 'Sunny'],
  ['2020-02-12'],
  ['2020-02-13'],
  ['2020-02-14'],
  ['2020-02-15'],
  ['2020-02-16'],
  ['2020-02-17'],
  ['2020-02-18'],
  ['2020-02-19'],
  ['2020-02-20'],
  ['2020-02-21'],
  ['2020-02-22'],
  ['2020-02-23'],
  ['2020-02-24'],
  ['2020-02-25'],
  ['2020-02-26'],
  ['2020-02-27'],
  ['2020-02-28'],
  ['2020-02-29'],
  ['2020-02-30'],
  ['2020-02-31'],
  []
]

var datetime = ['2020-02-01',
  '2020-02-02',
  '2020-02-03',
  '2020-02-04',
  '2020-02-05',
  '2020-02-06',
  '2020-02-07',
  '2020-02-08',
  '2020-02-09',
  '2020-02-10',
  '2020-02-11',
  '2020-02-12',
  '2020-02-13',
  '2020-02-14',
  '2020-02-15',
  '2020-02-16',
  '2020-02-17',
  '2020-02-18',
  '2020-02-19',
  '2020-02-20',
  '2020-02-21',
  '2020-02-22',
  '2020-02-23',
  '2020-02-24',
  '2020-02-25',
  '2020-02-26',
  '2020-02-27',
  '2020-02-28',
  '2020-02-29',
  '2020-02-30',
  '2020-02-31',

];
var datavalue = [4, 1, 3, 2, 2, 2, 1, 1, 4, 5, 5, 1, 2, 4, 2, 4, 2, 1, 2, 5, 1, 1, 1, 7, 2, 3, 1, 2, 2, 1, 3];

var dataGZ = [
  ['2020-02-02'],
  ['2020-02-03'],
  ['2020-02-04'],
  ['2020-02-05'],
  ['2020-02-06'],
  ['2020-02-07'],
  ['2020-02-08'],
  ['2020-02-09'],
  ['2020-02-10'],
  ['2020-02-11'],
  ['2020-02-12', 'Cloudy'],
  ['2020-02-13', 'Showers'],
  ['2020-02-14', 'Showers'],
  ['2020-02-15', 'Cloudy'],
  ['2020-02-16', 'Showers'],
  ['2020-02-17', 'Cloudy'],
  ['2020-02-18', 'Cloudy'],
  ['2020-02-19', 'Showers'],
  ['2020-02-20', 'Cloudy'],
  ['2020-02-21', 'Cloudy'],
  ['2020-02-22'],
  ['2020-02-23'],
  ['2020-02-24'],
  ['2020-02-25'],
  ['2020-02-26'],
  ['2020-02-27'],
  ['2020-02-28'],
  ['2020-02-29'],
  ['2020-02-30'],
  ['2020-02-31'],
  []
]

var dataSH = [
  ['2020-02-02'],
  ['2020-02-03'],
  ['2020-02-04'],
  ['2020-02-05'],
  ['2020-02-06'],
  ['2020-02-07'],
  ['2020-02-08'],
  ['2020-02-09'],
  ['2020-02-10'],
  ['2020-02-11'],
  ['2020-02-12'],
  ['2020-02-13'],
  ['2020-02-14'],
  ['2020-02-15'],
  ['2020-02-16'],
  ['2020-02-17'],
  ['2020-02-18'],
  ['2020-02-19'],
  ['2020-02-20'],
  ['2020-02-21'],
  ['2020-02-22', 'Showers'],
  ['2020-02-23', 'Cloudy'],
  ['2020-02-24', 'Showers'],
  ['2020-02-25', 'Cloudy'],
  ['2020-02-26', 'Showers'],
  ['2020-02-27', 'Cloudy'],
  ['2020-02-28', 'Showers'],
  ['2020-02-29', 'Showers'],
  ['2020-02-30', 'Cloudy'],
  ['2020-02-31', 'Showers'],
  ['Showers']
]

// var weatherIcons = {
//   Sunny: ROOT_PATH + 'data/asset/img/weather/sunny_128.png',
//   Cloudy: ROOT_PATH + 'data/asset/img/weather/cloudy_128.png',
//   Showers: ROOT_PATH + 'data/asset/img/weather/showers_128.png'
// }

const options = {
  weatherOption: {
    title: {
      text: '天气现象-散点图',
      textStyle: {
        color: '#fff',
        fontSize: 16
      }
    },
    backgroundColor: '#404a59',
    color: ['#dd4444', '#fec42c', '#80F1BE'],
    legend: {
      top: 10,
      data: ['Sunny', 'Cloudy', 'Showers'],
      textStyle: {
        color: '#fff',
        fontSize: 16
      }
    },
    grid: {
      left: '10%',
      right: 150,
      top: '18%',
      bottom: '10%'
    },
    xAxis: {
      type: 'category',
      name: '日期',
      nameGap: 16,
      nameTextStyle: {
        color: '#fff',
        fontSize: 14
      },
      max: 31,
      splitLine: {
        show: false
      },
      axisLine: {
        lineStyle: {
          color: '#eee'
        }
      }
    },
    yAxis: {
      type: 'category',
      name: '天气现象',
      inverse: true,
      data: ['Sunny', 'Cloudy', 'Showers'],
      nameLocation: 'start',
      nameGap: 20,
      nameTextStyle: {
        color: '#fff',
        fontSize: 16
      },
      axisLine: {
        lineStyle: {
          color: '#eee'
        }
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        formatter: function (value) {
          return '{' + value + '| }\n{value|' + value + '}'
        },
        margin: 20,
        rich: {
          value: {
            lineHeight: 30,
            align: 'center'
          },
          Sunny: {
            height: 40,
            align: 'center'
            // backgroundColor: {
            //   image: weatherIcons.Sunny
            // }
          },
          Cloudy: {
            height: 40,
            align: 'center'
            // backgroundColor: {
            //   image: weatherIcons.Cloudy
            // }
          },
          Showers: {
            height: 40,
            align: 'center'
            // backgroundColor: {
            //   image: weatherIcons.Showers
            // }
          }
        }
      }
    },
    series: [
      {
        name: 'Sunny',
        type: 'scatter',
        data: dataBJ
      },
      {
        name: 'Cloudy',
        type: 'scatter',
        data: dataSH
      },
      {
        name: 'Showers',
        type: 'scatter',
        data: dataGZ
      }
    ]
  },
  windOption: {
    title: {
      text: '风向散点图',

      textStyle: {
        color: '#fff',
        fontSize: 16
      },
    },
    backgroundColor: '#404a59',
    xAxis: {
      type: 'category',

      name: '日期',
      nameGap: 16,
      nameTextStyle: {
        color: '#fff',
        fontSize: 16
      },
      axisLine: {
        lineStyle: {
          color: '#eee'
        }
      },
    },
    yAxis: {

      name: '风向',
      nameGap: 16,
      max: 360,
      nameTextStyle: {
        color: '#fff',
        fontSize: 16
      },
      nameTextStyle: {
        color: '#fff',
        fontSize: 16
      },
      axisLine: {
        lineStyle: {
          color: '#eee'
        }
      },
    },
    series: [{
      symbolSize: 20,
      data: [
        ['2020-02-01', 4],
        ['2020-02-02', 11],
        ['2020-02-03', 3],
        ['2020-02-04', 2],
        ['2020-02-05', 22],
        ['2020-02-06', 2],
        ['2020-02-07', 11],
        ['2020-02-08', 11],
        ['2020-02-09', 4],
        ['2020-02-10', 5],
        ['2020-02-11', 5],
        ['2020-02-12', 11],
        ['2020-02-13', 20],
        ['2020-02-14', 44],
        ['2020-02-15', 23],
        ['2020-02-16', 41],
        ['2020-02-17', 24],
        ['2020-02-18', 14],
        ['2020-02-19', 21],
        ['2020-02-20', 51],
        ['2020-02-21', 18],
        ['2020-02-22', 11],
        ['2020-02-23', 11],
        ['2020-02-24', 71],
        ['2020-02-25', 221],
        ['2020-02-26', 351],
        ['2020-02-27', 126],
        ['2020-02-28', 233],
        ['2020-02-29', 245],
        ['2020-02-30', 123],
        ['2020-02-31', 355],
      ],
      type: 'scatter'
    }]
  },
  otherOption: {

    title: {
      text: '要素名---折线图', textStyle: {
        color: '#fff',
        fontSize: 16
      }

    },
    backgroundColor: '#404a59',
    xAxis: {
      type: 'category',
      name: '日期',
      nameGap: 16,
      nameTextStyle: {
        color: '#fff',
        fontSize: 16
      },
      axisLine: {
        lineStyle: {
          color: '#eee'
        }
      },
      data: datetime
    },
    yAxis: {
      name: '值',
      nameGap: 16,
      nameTextStyle: {
        color: '#fff',
        fontSize: 16
      },
      axisLine: {
        lineStyle: {
          color: '#eee'
        }
      },
      type: 'value'
    },
    series: [{
      data: datavalue,
      type: 'line',
      smooth: true
    }]
  },
  msgOptionsColums: [
    { label: '报文种类', key: 'TT', pinyin: 'TT' },
    { label: '时间', key: 'YYGGgg', pinyin: 'YYGGgg' },
    { label: '导航系统', key: 'Ssss', pinyin: 'Ssss' },
    { label: '温度', key: 'SSTTT', pinyin: 'SSTTT' },
    { label: '飞行高度', key: 'Shhh', pinyin: 'Shhh' },
    { label: '纬度', key: 'LLLLA', pinyin: 'LLLLA' },
    { label: '颠簸', key: 'TBB', pinyin: 'TBB' },
    { label: 'ID', key: 'id', pinyin: 'id' },
    { label: '机场名称', key: 'CCCC', pinyin: 'CCCC' },
    { label: '国家', key: 'AA', pinyin: 'AA' },
    { label: '地区编号', key: 'KK', pinyin: 'KK' },
    { label: '飞机尾号', key: 'II', pinyin: 'II' },
    { label: '风向', key: 'ddd', pinyin: 'ddd' },
    { label: '风速', key: 'fff', pinyin: 'fff' },
    { label: '经度', key: 'LLLLLB', pinyin: 'LLLLLB' },
    { label: '飞行阶段', key: 'ipipip', pinyin: 'ipipip' }
  ],
  cacOptionsColums: [
    { label: '气象公报种类', key: 'TT', pinyin: 'TT' },
    { label: '气压', key: 'QPPPP', pinyin: 'QPPPP' },
    { label: '观测时刻', key: 'YYGGggZ', pinyin: 'YYGGggZ' },
    { label: '云量', key: 'NNN', pinyin: 'NNN' },
    { label: '气温', key: 'Td', pinyin: 'Td' },
    { label: '露点温度', key: 'Tdd', pinyin: 'Tdd' },
    { label: 'ID', key: 'id', pinyin: 'id' },
    { label: '无重大天气变化', key: 'qsybNOSIG', pinyin: 'qsybNOSIG' },
    { label: '机场名称', key: 'CCCC', pinyin: 'CCCC' },
    { label: '天气现象', key: 'ww', pinyin: 'ww' },
    { label: '国家', key: 'AA', pinyin: 'AA' },
    { label: '地区编号', key: 'KK', pinyin: 'KK' },
    { label: '风向', key: 'ddd', pinyin: 'ddd' },
    { label: '风速', key: 'fff', pinyin: 'fff' },
    { label: '能见度', key: 'VVVV', pinyin: 'VVVV' },
    { label: '云底高度', key: 'hhh', pinyin: 'hhh' },
    { label: '单份天气报告种类', key: 'METAR', pinyin: 'METAR' },
  ],
  awosOptionsColums: [
    { label: '10分钟MOR平均', key: 'MOR_10_1', pinyin: 'MOR_10_1' },
    { label: '最大阵风风向', key: 'WindF_max_1', pinyin: 'WindF_max_1' },
    { label: '高云层高度', key: 'CBASE_H_1', pinyin: 'CBASE_H_1' },
    {
      label: '10分钟平均风风速',
      key: 'WindS_10_1',
      pinyin: 'WindS_10_1'
    },
    { label: '天气现象', key: 'WEA_1', pinyin: 'WEA_1' },
    { label: '2分钟平均风风速', key: 'WindS_2_', pinyin: 'WindS_2_' },
    { label: '1分钟RVR平均', key: 'RVR_1_', pinyin: 'RVR_1_' },
    { label: '第1端中云层高度', key: 'CBASE_M_1', pinyin: 'CBASE_M_1' },
    { label: '背景亮度1分钟平均值', key: 'BL_1_1', pinyin: 'BL_1_1' },
    { label: '修正海压', key: 'Qnh_1', pinyin: 'Qnh_1' },
    { label: '10分钟RVR平均', key: 'RVR_10_1', pinyin: 'RVR_10_1' },
    { label: '低云层高度', key: 'CBASE_L_1', pinyin: 'CBASE_L_1' },
    { label: '端编号', key: 'NO_1', pinyin: 'NO_1' },
    { label: '垂直能见度', key: 'VV_1', pinyin: 'VV_1' },
    { label: 'ID', key: 'id', pinyin: 'id' },
    { label: '1分钟RVR平均', key: 'RVR_1_1', pinyin: 'RVR_1_1' },
    { label: '相对湿度', key: 'Hum_', pinyin: 'Hum_' },
    { label: '温度', key: 'Temp_', pinyin: 'Temp_' },
    { label: '天气现象', key: 'WEA_', pinyin: 'WEA_' },
    { label: '露点温度', key: 'Td_1', pinyin: 'Td_1' },
    { label: '最大阵风风速', key: 'WindS_max_1', pinyin: 'WindS_max_1' },
    { label: '场压', key: 'Qfe_1', pinyin: 'Qfe_1' },
    { label: '机场代码', key: 'airport_code', pinyin: 'airport_code' },
    { label: '中间端标识', key: 'MID', pinyin: 'MID' },
    { label: '场压', key: 'Qfe_', pinyin: 'Qfe_' },
    { label: '1分钟MOR平均', key: 'MOR_1_1', pinyin: 'MOR_1_1' },
    { label: '时间', key: 'TIME', pinyin: 'TIME' },
    { label: '道面温度', key: 'RoadTemp_1', pinyin: 'RoadTemp_1' },
    { label: '着陆端编号', key: 'TDZ', pinyin: 'TDZ' },
    {
      label: '10分钟平均风风向',
      key: 'WindF_10_1',
      pinyin: 'WindF_10_1'
    },
    { label: '降水强度', key: 'Pi_1', pinyin: 'Pi_1' },
    { label: '跑道编号', key: 'NO_runway', pinyin: 'NO_runway' },
    { label: '降水量', key: 'PREC_1', pinyin: 'PREC_1' },
    { label: '2分钟平均风风向', key: 'WindF_2_1', pinyin: 'WindF_2_1' },
    { label: '停止端编号', key: 'END', pinyin: 'END' }
  ],
  optionsArea: [
    {
      value: '东北地区4C、3C等级机场',
      label: '东北地区'
    },
    {
      value: '华北地区4E、4D等级机场',
      label: '华北地区'
    },
    {
      value: '华中地区4E、4D等级机场',
      label: '华中地区'
    },
    {
      value: '选项4',
      label: '华南地区'
    },
    {
      value: '选项5',
      label: '华东地区'
    },
    {
      value: '选项6',
      label: '西北地区'
    },
    {
      value: '中南地区4E、4D等级机场',
      label: '中南地区'
    }
  ],
  optionsAirport: [
    {
      value: '郑州新郑机场',
      label: '郑州新郑机场'
    },
    {
      value: '邯郸马头机场',
      label: '邯郸马头机场'
    },
    {
      value: '北京西郊机场',
      label: '北京西郊机场'
    },
    {
      value: '安庆天柱山机场',
      label: '安庆天柱山机场'
    },
    {
      value: '通化三源浦机场',
      label: '通化三源浦机场'
    },
    {
      value: '包头二里半机场',
      label: '包头二里半机场'
    },
  ],
  optionsWeatherCase: [
    {
      value: '雷达产品数据',
      label: '雷达产品数据'
    },
    {
      value: '雷达基数据',
      label: '雷达基数据'
    },
    {
      value: '雷达拼图图片和数据',
      label: '雷达拼图图片和数据'
    },
    {
      value: '全国地面常规资料',
      label: '全国地面常规资料'
    },
    {
      value: '全国高空常规资料',
      label: '全国高空常规资料'
    },
    {
      value: '国家站逐小时地面数据',
      label: '国家站逐小时地面数据'
    },
    {
      value: '闪电定位资料',
      label: '闪电定位资料'
    }
  ],
  optionsCac: [
    {
      value: 'TT',
      label: '气象公报种类'
    },
    {
      value: 'AA',
      label: '国家'
    },
    {
      value: 'KK',
      label: '地区编号'
    },
    {
      value: 'CCCC',
      label: '机场名称'
    },
    {
      value: 'DATE',
      label: '报文发布日期'
    },
    {
      value: 'METAR',
      label: '单份天气报告种类'
    },
    {
      value: 'YYGGggZ',
      label: '观测时刻'
    },
    {
      value: 'AUTO',
      label: '是否为自动生成的天气报告'
    },
    {
      value: 'ddd',
      label: '平均风向'
    },
    {
      value: 'fff',
      label: '平均风速'
    },
    {
      value: 'G',
      label: '阵风风速'
    },
    {
      value: 'dddVddd',
      label: '风向变化范围'
    },
    {
      value: 'VVVV',
      label: '能见度'
    },
    {
      value: 'RDD',
      label: '跑道视程'
    },
    {
      value: 'ww',
      label: '天气现象'
    },
    {
      value: 'NNN',
      label: '云量'
    },
    {
      value: 'hhh',
      label: '云底高度'
    },
    {
      value: 'Td',
      label: '气温'
    },
    {
      value: 'Tdd',
      label: '露点温度'
    },
    {
      value: 'QPPPP',
      label: '气压'
    },
    {
      value: 'REww',
      label: '近时天气'
    },
    {
      value: 'qsybNOSIG',
      label: '无重大天气变化'
    },
    {
      value: 'qsybddd',
      label: '趋势预报平均风向'
    },
    {
      value: 'qsybfff',
      label: '趋势预报平均风速'
    },
    {
      value: 'qsybVVVV',
      label: '趋势预报能见度'
    },
    {
      value: 'qsybww',
      label: '趋势预报天气现象'
    },
    {
      value: 'qsybNNN',
      label: '趋势预报云底高度'
    },
    {
      value: 'qsybhhh',
      label: '趋势预报云底高度'
    },
    {
      value: 'qsybTTTTT',
      label: '趋势预报变化指示码'
    }
  ],
  optionsMsg: [
    {
      value: 'YYGGgg',
      label: '观测时间'
    },
    {
      value: 'Ssss',
      label: '导航系统'
    },
    {
      value: 'TT',
      label: '报文种类'
    },
    {
      value: 'SSTTT',
      label: '温度'
    },
    {
      value: 'collect_date',
      label: '采集日期'
    },
    {
      value: 'Shhh',
      label: '飞行高度'
    },
    {
      value: 'LLLLA',
      label: '纬度'
    },
    {
      value: 'TBB',
      label: '颠簸'
    },
    {
      value: 'CCCC',
      label: '机场名称'
    },
    {
      value: 'AA',
      label: '国家'
    },
    {
      value: 'KK',
      label: '地区编号'
    },
    {
      value: 'II',
      label: '飞机尾号'
    },
    {
      value: 'ddd',
      label: '风向'
    },
    {
      value: 'fff',
      label: '风速'
    },
    {
      value: 'YYGG',
      label: '时间'
    },
    {
      value: 'DATE',
      label: '日期'
    },
    {
      value: 'LLLLLB',
      label: '经度'
    },
    {
      value: 'ipipip',
      label: '飞行阶段'
    },
    {
      value: 'AMDAR',
      label: 'AMDAR类型'
    }
  ],
  optionsAwos: [
    {
      value: 'TIME',
      label: '时间'
    },
    {
      value: 'NO_runway',
      label: '跑道编号'
    },
    {
      value: 'TDZ',
      label: '着陆端编号'
    },
    {
      value: 'MID',
      label: '中间端标识'
    },
    {
      value: 'END',
      label: '停止端编号'
    },
    {
      value: 'NO_1',
      label: '端编号'
    },
    {
      value: 'NO_2',
      label: '端编号'
    },
    {
      value: 'NO_3',
      label: '端编号'
    },
    {
      value: 'RVR_1_1',
      label: '1分钟RVR平均'
    },
    {
      value: 'RVR_10_1',
      label: '10分钟RVR平均'
    },
    {
      value: 'MOR_1_1',
      label: '1分钟MOR平均'
    },
    {
      value: 'MOR_10_1',
      label: '10分钟MOR平均'
    },
    {
      value: 'BL_1_1',
      label: '背景亮度1分钟平均值'
    },
    {
      value: 'BL_1_2',
      label: '背景亮度1分钟平均值'
    },
    {
      value: 'BL_1_3',
      label: '背景亮度1分钟平均值'
    },
    {
      value: 'WindS_2_1',
      label: '2分钟平均风风速'
    },
    {
      value: 'WindF_2_1',
      label: '2分钟平均风风向'
    },
    {
      value: 'WindS_10_1',
      label: '10分钟平均风风速'
    },
    {
      value: 'WindF_10_1',
      label: '10分钟平均风风向'
    },
    {
      value: 'WindS_max_1',
      label: '最大阵风风速'
    },
    {
      value: 'WindS_max_2',
      label: '最大阵风风速'
    },
    {
      value: 'WindS_max_3',
      label: '最大阵风风速'
    },
    {
      value: 'WindF_max_1',
      label: '最大阵风风向'
    },
    {
      value: 'Qnh_1',
      label: '修正海压'
    },
    {
      value: 'Qfe_1',
      label: '场压'
    },
    {
      value: 'Temp_1',
      label: '温度'
    },
    {
      value: 'Hum_1',
      label: '相对湿度'
    },
    {
      value: 'Td_1',
      label: '露点温度'
    },
    {
      value: 'RoadTemp_1',
      label: '道面温度'
    },
    {
      value: 'CBASE_L_1',
      label: '低云层高度'
    },
    {
      value: 'CBASE_M_1',
      label: '中云层高度'
    },
    {
      value: 'CBASE_H_1',
      label: '高云层高度'
    },
    {
      value: 'VV_1',
      label: '垂直能见度'
    },
    {
      value: 'WEA_1',
      label: '天气现象'
    },
    {
      value: 'Pi_1',
      label: '降水强度'
    },
    {
      value: 'PREC_1',
      label: '降水量'
    },
    {
      value: 'collect_date',
      label: '采集日期'
    },
    {
      value: 'airport_code',
      label: '机场代码'
    },
    {
      value: 'RVR_1_2',
      label: '1分钟RVR平均'
    },
    {
      value: 'RVR_1_3',
      label: '1分钟RVR平均'
    },
    {
      value: 'RVR_10_2',
      label: '10分钟RVR平均'
    },
    {
      value: 'RVR_10_3',
      label: '10分钟RVR平均'
    },
    {
      value: 'MOR_1_2',
      label: '1分钟MOR平均'
    },
    {
      value: 'MOR_1_3',
      label: '1分钟MOR平均'
    },
    {
      value: 'MOR_10_2',
      label: '10分钟MOR平均'
    },
    {
      value: 'MOR_10_3',
      label: '10分钟MOR平均'
    },
    {
      value: 'WindS_2_2',
      label: '2分钟平均风风速'
    },
    {
      value: 'WindS_2_3',
      label: '2分钟平均风风速'
    },
    {
      value: 'WindF_2_2',
      label: '2分钟平均风风向'
    },
    {
      value: 'WindF_2_3',
      label: '2分钟平均风风向'
    },
    {
      value: 'WindS_10_2',
      label: '10分钟平均风风速'
    },
    {
      value: 'WindS_10_3',
      label: '10分钟平均风风速'
    },
    {
      value: 'WindF_10_2',
      label: '10分钟平均风风向'
    },
    {
      value: 'WindF_10_3',
      label: '10分钟平均风风向'
    },
    {
      value: 'WindS_max_2',
      label: '最大阵风风速'
    },
    {
      value: 'airport_code',
      label: '最大阵风风速'
    },
    {
      value: 'WindF_max_2',
      label: '最大阵风风向'
    },
    {
      value: 'WindF_max_3',
      label: '最大阵风风向'
    },
    {
      value: 'Qnh_2',
      label: '修正海压'
    },
    {
      value: 'Qnh_3',
      label: '修正海压'
    },
    {
      value: 'Qfe_2',
      label: '场压'
    },
    {
      value: 'Qfe_3',
      label: '场压'
    },
    {
      value: 'Temp_2',
      label: '温度'
    },
    {
      value: 'Temp_3',
      label: '温度'
    },
    {
      value: 'Hum_2',
      label: '相对湿度'
    },
    {
      value: 'Hum_3',
      label: '相对湿度'
    },
    {
      value: 'Td_2',
      label: '露点温度'
    },
    {
      value: 'Td_3',
      label: '露点温度'
    },
    {
      value: 'RoadTemp_2',
      label: '道面温度'
    },
    {
      value: 'RoadTemp_3',
      label: '道面温度'
    },
    {
      value: 'CBASE_L_2',
      label: '低云层高度'
    },
    {
      value: 'CBASE_L_3',
      label: '低云层高度'
    },
    {
      value: 'CBASE_M_2',
      label: '中云层高度'
    },
    {
      value: 'CBASE_M_3',
      label: '中云层高度'
    },
    {
      value: 'CBASE_H_2',
      label: '高云层高度'
    },
    {
      value: 'CBASE_H_3',
      label: '高云层高度'
    },
    {
      value: 'VV_2',
      label: '垂直能见度'
    },
    {
      value: 'VV_3',
      label: '垂直能见度'
    },
    {
      value: 'WEA_2',
      label: '天气现象'
    },
    {
      value: 'WEA_3',
      label: '天气现象'
    },
    {
      value: 'Pi_2',
      label: '降水强度'
    },
    {
      value: 'Pi_3',
      label: '降水强度'
    },
    {
      value: 'PREC_2',
      label: '低云层高度'
    },
    {
      value: 'PREC_3',
      label: '降水量'
    }
  ],
  optionsWeather: [
    {
      value: 'alias',
      label: '天气个例别名'
    },
    {
      value: 'element',
      label: '记录要素'
    },
    {
      value: 'remark',
      label: '备注'
    },
    {
      value: 'timeBegin',
      label: '开始时间'
    },
    {
      value: 'timeEnd',
      label: '结束时间'
    },
  ]
}

export default options
