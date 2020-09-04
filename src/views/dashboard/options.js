import airportAaddress from './airport.js'

function air() {
  const arr = []
  airportAaddress.forEach(item => {
    if (item.airportData) {
      item.airportData.forEach(d => {
        if (d.lat) {
          arr.push({
            name: d.airportName,
            value: [d.lat, d.lon]
          })
        }
      })
    }
  })
  return arr
}
const color = ['#3ed4ff', '#ffa022', '#a6c84c', '#008080']

const options = {
  dataType: [
    {
      id: '1',
      type: '1',
      datatypename: '民航报文',
      datatypecode: 'cac'
    },
    {
      id: '2',
      type: '5',
      datatypename: '云',
      datatypecode: 'CLOUD'
    },
    {
      id: '3',
      type: '2',
      datatypename: '全国机场自观',
      datatypecode: 'awos'
    },
    {
      id: '4',
      type: '2',
      datatypename: '全国地面',
      datatypecode: 'ground_data'
    },
    {
      id: '5',
      type: '2',
      datatypename: '全国高空',
      datatypecode: 'upper_data'
    },
    {
      id: '6',
      type: '1',
      datatypename: '航空器空中报',
      datatypecode: 'msg'
    },
    {
      id: '7',
      type: '4',
      datatypename: '欧洲细网格',
      datatypecode: 'EC_HR'
    },
    {
      id: '8',
      type: '4',
      datatypename: 'FY2G',
      datatypecode: 'FY2G'
    },
    {
      id: '9',
      type: '4',
      datatypename: 'NCEP',
      datatypecode: 'ncep'
    },
    {
      id: '10',
      type: '4',
      datatypename: 'WAFS',
      datatypecode: 'wafs'
    },
    {
      id: '11',
      type: '3',
      datatypename: '葵花8',
      datatypecode: 'kh_8'
    },
    {
      id: '12',
      type: '3',
      datatypename: '多普勒雷达',
      datatypecode: 'oradata'
    },
    {
      id: '13',
      type: '2',
      datatypename: '区域自动站',
      datatypecode: 'auto_station'
    },
    {
      id: '14',
      type: '3',
      datatypename: '机场天气雷达',
      datatypecode: 'weather_radar'
    },
    {
      id: '15',
      type: '6',
      datatypename: '预报产品数据',
      datatypecode: 'prog'
    },
    {
      id: '16',
      type: '5',
      datatypename: '温湿度',
      datatypecode: 'HUMITEMP'
    },
    {
      id: '17',
      type: '5',
      datatypename: '大气压力',
      datatypecode: 'PRESS'
    },
    {
      id: '18',
      type: '5',
      datatypename: '降水',
      datatypecode: 'RAIN'
    },
    {
      id: '19',
      type: '5',
      datatypename: '能见度跑道视程',
      datatypecode: 'VIS'
    },
    {
      id: '20',
      type: '5',
      datatypename: '风速风向',
      datatypecode: 'WIND'
    },
    {
      id: '21',
      type: '5',
      datatypename: '天气现象',
      datatypecode: 'PW'
    },
    {
      id: '22',
      type: '5',
      datatypename: '主导能见度',
      datatypecode: 'PV'
    },
    {
      id: '23',
      type: '5',
      datatypename: '道面传感器',
      datatypecode: 'ROSA'
    },
    {
      id: '24',
      type: '5',
      datatypename: '跑道灯光',
      datatypecode: 'RWYLIGHTS'
    },
    {
      id: '28',
      type: '1',
      datatypename: '民航报文_TAF机场预报_24h',
      datatypecode: 'FT'
    },
    {
      id: '29',
      type: '1',
      datatypename: 'MATAR机场例行天气报告',
      datatypecode: 'SA'
    },
    {
      id: '30',
      type: '1',
      datatypename: 'SPECI机场特殊天气报告',
      datatypecode: 'SP'
    },
    {
      id: '31',
      type: '3',
      datatypename: '机场风廓线',
      datatypecode: 'wind_profiling'
    },
    {
      id: '33',
      type: '1',
      datatypename: 'SIGMET重要气象情报',
      datatypecode: 'WS'
    },
    {
      id: '66',
      type: '1',
      datatypename: '民航报文_TAF机场预报_9h',
      datatypecode: 'FC'
    },
    {
      id: '67',
      type: '6',
      datatypename: '机场警报',
      datatypecode: 'JJ'
    },
    {
      id: '68',
      type: '6',
      datatypename: '航空器空中报告',
      datatypecode: 'AR'
    },
    {
      id: '69',
      type: '6',
      datatypename: '航空器空中报告',
      datatypecode: 'AR'
    },
    {
      id: '60',
      type: '6',
      datatypename: '机场天气概率通报表',
      datatypecode: 'MR2'
    },
    {
      id: '71',
      type: '6',
      datatypename: '终端区预警',
      datatypecode: 'ZD'
    },
    {
      id: '72',
      type: '6',
      datatypename: '区域天气概率通报表',
      datatypecode: 'MR1'
    },
    {
      id: '73',
      type: '6',
      datatypename: '区域预警',
      datatypecode: 'YJ'
    },
    {
      id: '74',
      type: '6',
      datatypename: '重要天气预告图',
      datatypecode: 'FN'
    },
    {
      id: '75',
      type: '6',
      datatypename: '高空风温预告图',
      datatypecode: 'FB'
    },
    {
      id: '76',
      type: '6',
      datatypename: '民航重要天气快报',
      datatypecode: 'KB'
    },
    {
      id: '77',
      type: '6',
      datatypename: '地区天气趋势',
      datatypecode: 'WZ'
    },
    {
      id: '78',
      type: '6',
      datatypename: '天气通报',
      datatypecode: 'WT'
    },
    {
      id: '79',
      type: '7',
      datatypename: '任意',
      datatypecode: 'ANY'
    }
  ],
  fileLists: [
    {
      type: 1,
      name: '民航报文',
      img: require('@/assets/sys_images/1.png'),
      subClass: 0,
      total: 0,
      capacity: 0,
      status: false,
      timer: null,
      subChild: null
    },
    {
      type: 2,
      name: '常规观测资料',
      img: require('@/assets/sys_images/2.png'),
      subClass: 0,
      total: 0,
      capacity: 0,
      status: false,
      timer: null,
      subChild: null
    },
    {
      type: 3,
      name: '非常规观测',
      img: require('@/assets/sys_images/3.png'),
      subClass: 0,
      total: 0,
      capacity: 0,
      status: false,
      timer: null,
      subChild: null
    },
    {
      type: 4,
      name: '模式预报资料',
      img: require('@/assets/sys_images/4.png'),
      subClass: 0,
      total: 0,
      capacity: 0,
      status: false,
      timer: null,
      subChild: null
    },
    {
      type: 5,
      name: '咸阳机场自观',
      img: require('@/assets/sys_images/6.png'),
      subClass: 0,
      total: 0,
      capacity: '-',
      status: false,
      timer: null,
      subChild: null
    },
    {
      type: 6,
      name: '预报产品',
      img: require('@/assets/sys_images/1.png'),
      subClass: 0,
      total: 0,
      capacity: 0,
      status: false,
      timer: null,
      subChild: null
    }
  ],
  dataStatistic: [
    { type: 'day', fileNum: 112, messageNum: 99 },
    { type: 'week', fileNum: 112, messageNum: 99 },
    { type: 'month', fileNum: 112, messageNum: 99 }
  ],
  extremeWeatherOptions: [
    { key: 'attr', label: '要素' },
    { key: 'max', label: '历史最高', width: 180 },
    { key: 'min', label: '历史最低', width: 180 },
    { key: 'average', label: '平均' }
  ],
  extremeWeatherData: [
    { attr: '气温', max: '15°C', min: '-2°C', average: '8°C' },
    { attr: '降水', max: '20mm', min: '0.0mm ', average: '5mm' },
    { attr: '日变温', max: '15°C', min: '-2°C', average: '8°C' },
    { attr: 'RVR≤350日数', max: '15°C', min: '-2°C', average: '8°C' },
    { attr: '350≤RVR≤550', max: '15°C', min: '-2°C', average: '8°C' },
    { attr: '降雪日数', max: '15°C', min: '-2°C', average: '8°C' },
    { attr: '雾', max: '15°C', min: '-2°C', average: '8°C' },
    { attr: '霾', max: '15°C', min: '-2°C', average: '8°C' }
  ],
  monthClimateOptions: [
    { key: 'attr', label: '要素', width: 180 },
    { key: 'maxRate', label: '最大出现概率' },
    { key: 'lowRate', label: '次出现概率' }
  ],
  monthClimateData: [
    { attr: 'RVR', maxRate: '>1500m', lowRate: '1000＜RVR<1500 m' },
    { attr: '降水', maxRate: '2-4mm', lowRate: '0-2mm' },
    { attr: '降温', maxRate: '0-2°C', lowRate: '2-4°C' },
    { attr: '雾霾出现时间', maxRate: '10点', lowRate: '8点' },
    { attr: '能见度', maxRate: '4-6km', lowRate: '2-4km' }
  ],
  mapOption: {
    backgroundColor: '#080a20',
    title: {
      text: '机场模拟分布图',
      subtext: '数据',
      left: 'left',
      textStyle: {
        color: '#fff'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: function(params) {
        return params.name
      }
    },
    legend: {
      orient: 'vertical',
      top: 'bottom',
      left: 'right',
      data: ['北京 Top10', '上海 Top10', '广州 Top10'],
      textStyle: {
        color: '#fff'
      },
      selectedMode: 'single'
    },
    geo: {
      map: 'china',
      label: {
        emphasis: {
          show: false
        }
      },
      roam: true,
      itemStyle: {
        normal: {
          areaColor: '#132937',
          borderColor: '#0692a4'
        },
        emphasis: {
          areaColor: '#0b1c2d'
        }
      }
    },
    bmap: {},
    series: [
      {
        name: '机场',
        mapType: 'china',
        type: 'scatter',
        coordinateSystem: 'geo',
        symbolSize: 6,
        zlevel: 1,
        itemStyle: {
          normal: {
            color: color[0],
            borderWidth: 1,
            borderColor: color[2],
            shadowColor: '#ffffff',
            shadowBlur: 2,
            areaColor: color[1]
          }
        },
        data: air(),
        visualMap: false
      },
      {
        name: '最新数据',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 5,
        rippleEffect: {
          brushType: 'stroke'
        },
        symbolSize: val => {
          return 10
        },
        itemStyle: {
          normal: {
            color: '#EEC900'
          }
        },
        data: []
      },
      {
        name: '最新数据',
        type: 'effectScatter',
        coordinateSystem: 'geo',
        zlevel: 5,
        rippleEffect: {
          brushType: 'stroke'
        },
        symbolSize: val => {
          return 18
        },
        itemStyle: {
          normal: {
            color: color[1]
          }
        },
        data: []
      }
    ]
  }
}

export default options
