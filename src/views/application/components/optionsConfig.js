import RECORDS from './grib_elements'
class Options {
  constructor(option) {
    this.option = option
  }
  getTimeList() {
    const num = 240
    const arr = []
    for (let i = 0; i <= num; i += 3) {
      arr.push(i)
    }
    return arr
  }
  setTimeList(s) {
    if (s.length === 1) {
      return '00' + s
    }
    if (s.length === 2) {
      return '0' + s
    }
    // eslint-disable-next-line semi
    return s
  }
  setPressureFn() {
    const arr = [
      1000,
      950,
      925,
      900,
      850,
      800,
      700,
      600,
      500,
      400,
      300,
      250,
      200,
      150,
      100,
      70,
      50,
      20,
      10
    ]
    const ar = arr.map(item => {
      return {
        key: item,
        label: item + '',
        disabled: false
      }
    })
    return ar
  }
  forecastData(argu) {
    const options = {
      element: RECORDS.map(item => {
        return {
          value: item.id,
          label: item.name_en
        }
      }),
      type: [
        {
          value: 'ECHR',
          label: 'NECP'
        },
        {
          value: 'NCEP',
          label: 'ECHR'
        },
        {
          value: 'WAFS',
          label: 'WAFS'
        }
      ],
      timeList: this.getTimeList(),
      pressure: this.setPressureFn()
    }
    return options[argu]
  }
  historyData(argu) {
    const options = {
      type: [
        {
          value: '全部',
          label: '全部'
        },
        {
          value: 'NECP',
          label: 'NECP'
        },
        {
          value: 'ECHR',
          label: 'ECHR'
        },
        {
          value: 'WAFS',
          label: 'WAFS'
        },
        {
          value: 'ground_data',
          label: '全国地面'
        },
        {
          value: 'upper_data',
          label: '全国高空'
        },
        {
          value: 'auto_station',
          label: '区域自动站'
        },
        {
          value: 'FY2G',
          label: 'FY2G'
        },
        {
          value: 'kh_8',
          label: '葵花8'
        },
        {
          value: 'oradata',
          label: '多普勒雷达'
        },
      ]
    }
    return options[argu]
  }
}
export default Options
