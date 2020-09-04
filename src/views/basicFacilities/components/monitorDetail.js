
// var weatherIcons = {
//     'RAM': ROOT_PATH + 'data/asset/img/weather/sunny_128.png',
//     '磁盘': ROOT_PATH + 'data/asset/img/weather/cloudy_128.png',
// };

var seriesLabel = {
    normal: {
        show: true,
        textBorderColor: '#333',
        textBorderWidth: 2
    }
}

const optionBar = {
    title: {
        text: '资源利用'
    },
    backgroundColor: '#fff',
    tooltip: {
        trigger: 'axis',
        axisPointer: {
            type: 'shadow'
        }
    },
    legend: {
        data: ['已用', '剩余']
    },
    grid: {
        left: 100
    },
    // toolbox: {
    //     show: true,
    //     feature: {
    //         saveAsImage: {}
    //     }
    // },
    xAxis: {
        type: 'value',
        name: 'GB',
        axisLabel: {
            formatter: '{value}'
        }
    },
    yAxis: {
        type: 'category',
        inverse: true,
        data: [ '磁盘'],
        axisLabel: {
            margin: 20,
            rich: {
                value: {
                    lineHeight: 30,
                    align: 'center'
                },
                Sunny: {
                    height: 40,
                    align: 'center',
                    backgroundColor: {
                        // image: weatherIcons.Sunny
                    }
                },
                Cloudy: {
                    height: 40,
                    align: 'center',
                    backgroundColor: {
                        // image: weatherIcons.Cloudy
                    }
                },
                Showers: {
                    height: 40,
                    align: 'center',
                    backgroundColor: {
                        // image: weatherIcons.Showers
                    }
                }
            }
        }
    },
    series: [
        {
            name: '已用',
            type: 'bar',
            data: [170],
            label: seriesLabel,
            markPoint: {
                symbolSize: 1,
                symbolOffset: [0, '50%'],
                label: {
                    formatter: '{a|{a}\n}{b|{b} }{c|{c}}',
                    backgroundColor: 'rgb(242,242,242)',
                    borderColor: '#aaa',
                    borderWidth: 1,
                    borderRadius: 4,
                    padding: [4, 10],
                    lineHeight: 26,
                    position: 'right',
                    distance: 20,
                    rich: {
                        a: {
                            align: 'center',
                            color: '#fff',
                            fontSize: 18,
                            textShadowBlur: 2,
                            textShadowColor: '#000',
                            textShadowOffsetX: 0,
                            textShadowOffsetY: 1,
                            textBorderColor: '#333',
                            textBorderWidth: 2
                        },
                        b: {
                            color: '#333'
                        },
                        c: {
                            color: '#ff8811',
                            textBorderColor: '#000',
                            textBorderWidth: 1,
                            fontSize: 22
                        }
                    }
                }
            }
        },
        {
            name: '剩余',
            type: 'bar',
            label: seriesLabel,
            data: [105]
        }
    ]
}

export default optionBar