const tags = [
    { // 最大居中，或放第一个
        value: 150000,
        label: '视频时长',
        unit: '分钟'
    },
    {
        value: 2080,
        label: '题库',
        unit: ''
    },
    {
        value: 1112,
        label: '课件',
        unit: ''
    },
    {
        value: 1357,
        label: '课程',
        unit: '人'
    },
    {
        value: 618,
        label: '其它',
        unit: ''
    },
    {
        value: 150000,
        label: '视频时长',
        unit: '分钟'
    },
]


function draw() {
    const option = getOptions()
    const ngrChart = echarts.init(
        document.getElementById('bubbles')
    )
    ngrChart.setOption(option)
}

function getOptions() {
    const datas = getDatas()

    const option = {
        grid: {
            show: false,
            top: 10,
            bottom: 10,
        },
        xAxis: {
            type: 'value',
            show: false,
            min: 0,
            max: 100,
            nameLocation: 'middle',
            nameGap: 5,
        },
        yAxis: {
            min: 0,
            show: false,
            max: 100,
            nameLocation: 'middle',
            nameGap: 30,
        },

        series: [
            {
                type: 'scatter',
                symbol: 'circle',
                symbolSize: 120,
                label: {
                    normal: {
                        show: true,
                        formatter: '{b}',
                        color: '#fff',
                        textStyle: {
                            fontSize: '20',
                        },
                    },
                },
                itemStyle: {
                    normal: {
                        color: '#00acea',
                    },
                },
                data: datas,
            },
        ],
    };

    return option
}


function getDatas() {
    //偏移量
    const offsetData = [
        [80, 53],
        // [35, 73],
        // [30, 33],
        // [60, 33],
        // [10, 48],
        // [65, 58],
    ];
    //symbolSize 散点气泡大小
    const symbolSizeData = [200, 185, 175, 165, 135, 113];

    //循环定义series的data值
    const datas = [];
    for (let i = 0; i < tags.length; i++) {
        const item = tags[i];

        datas.push({
            name: item.label + '\n' + item.value + item.unit,
            value: offsetData[i],
            symbolSize: symbolSizeData[i],
            label: {
                normal: {
                    textStyle: {
                        fontSize: 24,
                    },
                },
            },
            itemStyle: {
                normal: {
                    color: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0,color: 'rgba(41, 241, 250, 1)', // 0% 处的颜色
                        }, {
                            offset: 1, color: 'blue' // 100% 处的颜色
                        }],
                    },
                    borderWidth: 1,
                    borderColor: {
                        type: 'linear',
                        x: 0,
                        y: 0,
                        x2: 0,
                        y2: 1,
                        colorStops: [{
                            offset: 0, color: '#33D1C9' // 0% 处的颜色
                        }, {
                            offset: 1, color:  'rgba(0,163,156,0.29)' // 100% 处的颜色
                        }],
                        globalCoord: true // 缺省为 false
                      },
                    // shadowColor: '#2e78eca8',
                    // shadowBlur: 10,
                    // shadowOffsetX: 1,
                    // shadowOffsetY: 1,
                },
            },
        });
    }
    return datas
}