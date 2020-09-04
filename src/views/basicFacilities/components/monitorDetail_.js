
const option = {
    title: {
        text: '资源利用率',
        top: 20,
        textStyle: {
            color: '#000'
        }
    },
    backgroundColor: '#fff',
    legend: {
        top: 20,
        data: ['CPU利用率', '内存利用率'],
        textStyle: {
            color: '#000'
        }
    },
    backgroundColor: '#fff',
    series: [{
        name: 'CPU利用率',
        type: 'liquidFill',
        radius: '50%',
        color: ['#195ba6'],
        center: ['25%', '50%'],
        data: [0.4844],
        backgroundStyle: {
            borderWidth: 2,
            borderColor: '#1789fb',
            color: '#1c233f',
        },
        outline: {
            itemStyle: {
                borderWidth: 5,
                borderColor: '#1789fb',
                borderType: 'dashed',
            }
        },
        label: {
            normal: { //此处没有生效，本地生效
                textStyle: {
                    fontSize: 20,
                    color: '#e6e6e6',
                },
            },
        },
    },
    {
        name: '内存利用率',
        type: 'liquidFill',
        data: [0.7],
        radius: '50%',
        center: ['70%', '50%'],
        color: 'rgba(67,209,100,1)',
        label: {
            normal: {
                color: '#fff',
                insideColor: 'transparent',
                textStyle: {
                    fontSize: 16,
                    fontWeight: 'bold',
                    fontFamily: 'Microsoft YaHei'
                }
            }
        },
        outline: {
            show: true,
            borderDistance: 5,
            itemStyle: {
                borderColor: 'rgba(67,209,100,1)',
                borderWidth: 2
            }
        },
        backgroundStyle: {
            color: 'rgba(67,209,100,.3)'
        }

    }
    ]
};

export default option