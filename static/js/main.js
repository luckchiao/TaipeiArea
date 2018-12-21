$(function () {
    var lastRefreshTime = new Date();
    var areaPeople;
    LocationPeopleNum();
    setTimeout(InitView, 500);
    ReloadLocationPeopleNum();
    LoadPie1();
    LoadTotalPeopleChar();
    LoadChart1();

    $(".area").mouseover(function (e) {
        ShowSportCenterPeopleInfo(e);
    }).mouseout(function () {
        $(".follow").html('').removeClass();
    });

    function ShowSportCenterPeopleInfo(e) {
        $(".showArea").text($(e.currentTarget).attr("data-area") + '運動中心');
        // console.log($(e.currentTarget).context.id)
        areaPeople.find(function (item, index, array) {
            if (item.LID == $(e.currentTarget).context.id) {
                $("#gymPeopleNum").text(item.gymPeopleNum + " / " + item.gymMaxPeopleNum);
                $("#swimPeopleNum").text(item.swPeopleNum + " / " + item.swMaxPeopleNum);
                $(".pGym").attr('max', item.gymMaxPeopleNum);
                $(".pGym").val(item.gymPeopleNum);
                $(".pSwim").attr('max', item.swMaxPeopleNum);
                $(".pSwim").val(item.swPeopleNum);
            }
        });
        //cursor show area 
        // $("#follow").addClass("follow");
        // window.onmousemove = function (ev) {
        //     var ev = ev || window.event;
        //     var oLeft = ev.clientX + 40;
        //     var oTop = ev.clientY + 30;
        //     $(".follow").css({
        //         'display': 'block',
        //         'left': oLeft + 'px',
        //         'top': oTop + 'px'
        //     }).text($(e.currentTarget).attr("data-area"));
        // }
    }

    function LocationPeopleNum() {
        fetch('http://127.0.0.1:5000/gym').then(response =>
            response.json().then(data => ({
                data: data,
                status: response.status
            })).then(res => {
                lastRefreshTime = new Date();
                areaPeople = res.data.locationPeopleNums
                // console.log(areaPeople[0].LID)
            }));
    }

    function InitView() {
        areaPeople.find(function (item, index, array) {
            if (item.LID == "BTSC") {
                $("#gymPeopleNum").text(item.gymPeopleNum + " / " + item.gymMaxPeopleNum);
                $("#swimPeopleNum").text(item.swPeopleNum + " / " + item.swMaxPeopleNum);
                $(".pGym").attr('max', item.gymMaxPeopleNum);
                $(".pGym").val(item.gymPeopleNum);
                $(".pSwim").attr('max', item.swMaxPeopleNum);
                $(".pSwim").val(item.swPeopleNum);
            }
        });
    }

    function ReloadLocationPeopleNum() {
        if (new Date().getTime() - lastRefreshTime.getTime() > 10000) { //10 * 1000 = 10000
            LocationPeopleNum();
        }
        setTimeout(ReloadLocationPeopleNum, 1000);
    }

    function formatNum(strNum) {
        if (strNum.length <= 3) {
            return strNum;
        }
        if (!/^(\+|-)?(\d+)(\.\d+)?$/.test(strNum)) {
            return strNum;
        }
        var a = RegExp.$1,
            b = RegExp.$2,
            c = RegExp.$3;
        var re = new RegExp();
        re.compile("(\\d)(\\d{3})(,|$)");
        while (re.test(b)) {
            b = b.replace(re, "$1,$2$3");
        }
        return a + "" + b + "" + c;
    }

    function LoadPie1() {
        var pie1 = echarts.init(document.getElementById('pie1'), 'dark', {
            renderer: 'svg'
        });
        // 指定图表的配置项和数据
        var option = {
            title: {
                text: '北投區',
                subtext: '女性運動佔比',
                x: 'center'
            },
            subtextStyle: {
                color: '#333',
                fontSize: 18 // 副标题文字颜色
            },
            tooltip: {
                trigger: 'item',
                formatter: function (data) {
                    return data.seriesName + "<br/>" + data.name + "：" + formatNum(data.value);
                }
                // formatter: "{a} <br/>{b}: {c} ({d}%)"
            },
            backgroundColor: 'rgba(128, 128, 128, 0)',
            color: ['#D7709F', '#a03d69'],
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['運動人數', '總人數'],
                textStyle: {
                    color: '#1f2a3e' // 副标题文字颜色
                }
            },
            series: [{
                name: '區域人口數',
                type: 'pie',
                radius: ['40%', '60%'],
                avoidLabelOverlap: false,
                selectedMode: 'single',
                label: {
                    normal: {
                        show: false,
                        position: 'inner'
                    },
                    emphasis: {
                        show: true,
                        textStyle: {
                            fontSize: '20',
                            fontWeight: 'bold'
                        },
                        formatter: "{d}%"
                    }
                },
                data: [{
                        value: 1357,
                        name: '運動人數'
                    },
                    {
                        value: 2468,
                        name: '總人數'
                    }
                ]
            }]
        };
        pie1.setOption(option);
        $(".area").mousemove(function (e) {
            setTimeout(function () {
                pie1.dispatchAction({
                    type: 'showTip',
                    seriesIndex: 0,
                    name: '總人數'
                });
            })
            pie1.setOption({
                title: {
                    text: $(e.currentTarget).attr("data-area"),
                },
                series: [{
                    name: $(e.currentTarget).attr("data-area") + '女性人數',
                    data: [{
                            value: $(e.currentTarget).attr("data-sport"),
                            name: '運動人數'
                        },
                        {
                            value: $(e.currentTarget).attr("data-female"),
                            name: '總人數'
                        }
                    ],
                }]
            });
        })
    }

    function LoadTotalPeopleChar() {
        // 基于准备好的dom，初始化echarts实例
        var chart = echarts.init(document.getElementById('chart2'), 'dark');
        // 指定图表的配置项和数据
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'cross',
                    crossStyle: {
                        color: '#999',

                    },
                    label: {
                        color: '#999'
                    }
                }
            },
            backgroundColor: 'rgba(128, 128, 128, 0)',
            color: ['#D7709F', '#5294E2', '#58c9ce'],
            toolbox: {
                feature: {
                    dataView: {
                        show: true,
                        readOnly: false
                    },
                    magicType: {
                        show: true,
                        type: ['line', 'bar']
                    },
                    restore: {
                        show: true
                    }
                }
            },
            legend: {
                data: ['女性', '男性', '次數/月'],
            },
            xAxis: [{
                id: 'month',
                type: 'category',
                data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'],
                axisPointer: {
                    type: 'shadow'
                }
            }],
            yAxis: [{
                    id: 'people',
                    type: 'value',
                    name: '人次',
                    min: 0,
                    max: 800000,
                    interval: 200000,
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    name: '次數/月',
                    min: 0,
                    max: 80,
                    interval: 20,
                    axisLabel: {
                        formatter: '{value}'
                    }
                }
            ],
            series: [{
                    name: '女性',
                    type: 'bar',
                    data: [369871, 319098, 415116, 411844, 460791, 471264, 518267, 509317, 427683, 416635]
                },
                {
                    name: '男性',
                    type: 'bar',
                    data: [432740, 364972, 475745, 469037, 525486, 536259, 588385, 579526, 468692, 462715]
                },
                {
                    name: '次數/月',
                    type: 'line',
                    yAxisIndex: 1,
                    data: [6, 6.9, 9, 16.2, 20, 35, 33, 40, 38, 43]
                }
            ]
        };
        // 使用刚指定的配置项和数据显示图表。
        chart.setOption(option);
    }

    function LoadChart1() {
        var chart1 = echarts.init(document.getElementById('chart1'), 'dark');
        var dataMap = {};

        function dataFormatter(obj) {
            var pList = ['松山', '信義', '大安', '中山', '中正', '大同', '萬華', '文山', '南港', '內湖', '士林', '北投'];
            var temp;
            for (var month = 1; month <= 10; month++) {
                var max = 0;
                var sum = 0;
                var maxArea;
                temp = obj[month];
                for (var i = 0, l = temp.length; i < l; i++) {
                    max = Math.max(max, temp[i]);
                    sum += temp[i];
                    obj[month][i] = {
                        name: pList[i],
                        value: temp[i]
                    }
                    if(i == l-1){
                        maxArea = $.map(obj[month], function( value, index ) {
                            if(obj[month][index].value == max)
                                return obj[month][index].name;
                        });
                    }
                }
                obj[month + 'area'] = maxArea;
                obj[month + 'max'] = max;
                obj[month + 'sum'] = sum;
            }
            return obj;
        }

        dataMap.dataSwim = dataFormatter({
            1: [23480, 38181, 28977, 14927, 12038, 16943, 9332, 15959, 21377, 0, 7167, 9032],
            2: [17424, 3357, 13825, 11197, 7587, 7206, 8492, 8368, 2167, 8317, 5671, 8109],
            3: [27658, 6498, 34472, 15403, 11990, 18837, 9991, 17497, 20978, 12445, 9831, 5680],
            4: [28748, 7138, 35738, 15094, 12183, 19880, 10790, 17093, 22492, 13326, 8806, 7963],
            5: [31612, 10326, 41572, 17895, 15765, 21500, 11974, 21344, 26138, 16620, 11374, 9564],
            6: [33796, 10646, 47648, 18516, 16273, 24480, 11864, 21162, 27046, 16741, 11439, 10238],
            7: [37453, 17294, 54199, 22634, 20188, 25880, 11838, 29372, 15425, 24174, 17476, 12757],
            8: [35975, 15559, 51772, 21796, 23751, 16500, 14425, 26802, 29440, 22222, 16615, 12698],
            9: [30383, 10525, 42342, 19875, 15208, 0, 12555, 20774, 24959, 17707, 14183, 8860],
            10: [24052, 8380, 36389, 18127, 14161, 0, 10789, 19202, 22699, 25988, 12507, 9007]
        });

        dataMap.dataGym = dataFormatter({
            1: [16883, 11640, 17112, 16100, 17922, 5033, 19722, 18910, 21790, 0, 15649, 10159],
            2: [11071, 8600, 13522, 11694, 12780, 5288, 20493, 14728, 15860, 8067, 12117, 11652],
            3: [15621, 12117, 18674, 16814, 17915, 7252, 23707, 19858, 21324, 14737, 17713, 10893],
            4: [13243, 11514, 17587, 16186, 16225, 7820, 30816, 19031, 20112, 14870, 17863, 10447],
            5: [15936, 12852, 19644, 17662, 17718, 8080, 32872, 20682, 23037, 17971, 19465, 12533],
            6: [14156, 12381, 21196, 16883, 17190, 7822, 34745, 19095, 22342, 18586, 20046, 13662],
            7: [17694, 14092, 21114, 18622, 20520, 8010, 19225, 23124, 25301, 21292, 21883, 13896],
            8: [17689, 14039, 20429, 18134, 19859, 5167, 21247, 22827, 24248, 21100, 21912, 13566],
            9: [15878, 11852, 18901, 17265, 17471, 0, 18503, 21206, 21562, 18667, 20985, 10057],
            10: [19245, 11298, 17761, 16507, 16995, 0, 15625, 20270, 212029, 18465, 19106, 10189]
        });

        dataMap.dataDance = dataFormatter({
            1: [4266, 15385, 17278, 9265, 6800, 2213, 2632, 16713, 17132, 0, 2688, 5138],
            2: [2560, 15244, 12121, 6863, 4274, 2416, 2282, 11498, 17132, 347, 1665, 4369],
            3: [4770, 14863, 19087, 9038, 8180, 2519, 2900, 16539, 15668, 6712, 2633, 0],
            4: [4132, 14999, 17661, 8763, 6438, 2498, 3105, 15431, 15668, 6904, 2453, 4598],
            5: [5036, 16368, 16053, 9916, 7936, 1500, 2962, 18109, 15900, 8930, 2948, 6291],
            6: [4997, 16216, 15162, 9182, 8144, 1680, 3035, 17780, 15900, 7824, 2866, 7896],
            7: [4620, 18020, 15431, 9762, 7656, 1480, 2181, 18800, 23676, 8428, 2835, 7506],
            8: [4423, 17710, 15741, 10492, 8063, 9650, 2353, 18829, 21303, 8821, 3389, 7253],
            9: [4135, 15841, 18651, 8957, 7900, 0, 1905, 16339, 16206, 7839, 2848, 6382],
            10: [4545, 15413, 18851, 10051, 8050, 0, 1984, 16080, 18201, 9011, 3344, 6698]
        });

        var option = {
            baseOption: {
                timeline: {
                    // y: 0,
                    axisType: 'category',
                    // realtime: false,
                    // loop: false,
                    autoPlay: true,
                    // currentIndex: 2,
                    playInterval: 1500,
                    // controlStyle: {
                    //     position: 'left'
                    // },
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月'],
                    label: {
                        formatter: '{value}'
                    }
                },
                tooltip: {},
                legend: {
                    x: 'right',
                    data: ['游泳池', '健身房', '瑜珈教室'],
                    // selected: {
                    //     'GDP': false,
                    //     '金融': false,
                    //     '房地产': false
                    // }
                },
                backgroundColor: 'rgba(128, 128, 128, 0)',
                color:['#3caaba','#eca92c','#fbe251'],
                calculable: true,
                grid: {
                    top: 80,
                    bottom: 100,
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'shadow',
                            label: {
                                show: true,
                                formatter: function (params) {
                                    return params.value;
                                }
                            }
                        }
                    },
                },
                xAxis: [{
                    type: 'category',
                    data: ['松山', '信義', '大安', '中山', '中正', '大同', '萬華', '文山', '南港', '內湖', '士林', '北投'],
                    splitLine: {
                        show: false
                    },
                    axisPointer: {
                        type: 'shadow',
                        label:{
                            color:'#999'
                        }
                    }
                }],
                yAxis: [{
                    type: 'value',
                    name: '人次'
                }],
                series: [
                    {
                        name: '游泳池',
                        type: 'bar'
                    },
                    {
                        name: '健身房',
                        type: 'bar'
                    },
                    {
                        name: '瑜珈教室',
                        type: 'bar'
                    },
                    {
                        name: '',
                        type: 'pie',
                        center: ['75%', '35%'],
                        radius: '28%',
                        z: 100,
                    }
                ]
            },
            options: [{
                    title: {
                        text: '2018/01-台北市運動中心場地使用'
                    },
                    series: [
                        {
                            data: dataMap.dataSwim['1']
                        },
                        {
                            data: dataMap.dataGym['1']
                        },
                        {
                            data: dataMap.dataDance['1']
                        },
                        {
                            data: [{
                                    name: '游泳池',
                                    value: dataMap.dataSwim['1max']
                                },
                                {
                                    name: '健身房',
                                    value: dataMap.dataGym['1max']
                                },
                                {
                                    name: '瑜珈教室',
                                    value: dataMap.dataDance['1max']
                                }
                            ]
                        }
                    ]
                },
                {
                    title: {
                        text: '2018/02-台北市運動中心場地使用'
                    },
                    series: [
                        {
                            data: dataMap.dataSwim['2']
                        },
                        {
                            data: dataMap.dataGym['2']
                        },
                        {
                            data: dataMap.dataDance['2']
                        },
                        {
                            data: [{
                                    name: '游泳池',
                                    value: dataMap.dataSwim['2max']
                                },
                                {
                                    name: '健身房',
                                    value: dataMap.dataGym['2max']
                                },
                                {
                                    name: '瑜珈教室',
                                    value: dataMap.dataDance['2max']
                                }
                            ]
                        }
                    ]
                },{
                    title: {
                        text: '2018/03-台北市運動中心場地使用'
                    },
                    series: [
                        {
                            data: dataMap.dataSwim['3']
                        },
                        {
                            data: dataMap.dataGym['3']
                        },
                        {
                            data: dataMap.dataDance['3']
                        },
                        {
                            data: [{
                                    name: '游泳池',
                                    value: dataMap.dataSwim['3max']
                                },
                                {
                                    name: '健身房',
                                    value: dataMap.dataGym['3max']
                                },
                                {
                                    name: '瑜珈教室',
                                    value: dataMap.dataDance['3max']
                                }
                            ]
                        }
                    ]
                },{
                    title: {
                        text: '2018/04-台北市運動中心場地使用'
                    },
                    series: [
                        {
                            data: dataMap.dataSwim['4']
                        },
                        {
                            data: dataMap.dataGym['4']
                        },
                        {
                            data: dataMap.dataDance['4']
                        },
                        {
                            data: [{
                                    name: '游泳池',
                                    value: dataMap.dataSwim['4max']
                                },
                                {
                                    name: '健身房',
                                    value: dataMap.dataGym['4max']
                                },
                                {
                                    name: '瑜珈教室',
                                    value: dataMap.dataDance['4max']
                                }
                            ]
                        }
                    ]
                },{
                    title: {
                        text: '2018/05-台北市運動中心場地使用'
                    },
                    series: [
                        {
                            data: dataMap.dataSwim['5']
                        },
                        {
                            data: dataMap.dataGym['5']
                        },
                        {
                            data: dataMap.dataDance['5']
                        },
                        {
                            data: [{
                                    name: '游泳池',
                                    value: dataMap.dataSwim['5max']
                                },
                                {
                                    name: '健身房',
                                    value: dataMap.dataGym['5max']
                                },
                                {
                                    name: '瑜珈教室',
                                    value: dataMap.dataDance['5max']
                                }
                            ]
                        }
                    ]
                },{
                    title: {
                        text: '2018/06-台北市運動中心場地使用'
                    },
                    series: [
                        {
                            data: dataMap.dataSwim['6']
                        },
                        {
                            data: dataMap.dataGym['6']
                        },
                        {
                            data: dataMap.dataDance['6']
                        },
                        {
                            data: [{
                                    name: '游泳池',
                                    value: dataMap.dataSwim['6max']
                                },
                                {
                                    name: '健身房',
                                    value: dataMap.dataGym['6max']
                                },
                                {
                                    name: '瑜珈教室',
                                    value: dataMap.dataDance['6max']
                                }
                            ]
                        }
                    ]
                },{
                    title: {
                        text: '2018/07-台北市運動中心場地使用'
                    },
                    series: [
                        {
                            data: dataMap.dataSwim['7']
                        },
                        {
                            data: dataMap.dataGym['7']
                        },
                        {
                            data: dataMap.dataDance['7']
                        },
                        {
                            data: [{
                                    name: '游泳池',
                                    value: dataMap.dataSwim['7max']
                                },
                                {
                                    name: '健身房',
                                    value: dataMap.dataGym['7max']
                                },
                                {
                                    name: '瑜珈教室',
                                    value: dataMap.dataDance['7max']
                                }
                            ]
                        }
                    ]
                },{
                    title: {
                        text: '2018/08-台北市運動中心場地使用'
                    },
                    series: [
                        {
                            data: dataMap.dataSwim['8']
                        },
                        {
                            data: dataMap.dataGym['8']
                        },
                        {
                            data: dataMap.dataDance['8']
                        },
                        {
                            data: [{
                                    name: '游泳池',
                                    value: dataMap.dataSwim['8max']
                                },
                                {
                                    name: '健身房',
                                    value: dataMap.dataGym['8max']
                                },
                                {
                                    name: '瑜珈教室',
                                    value: dataMap.dataDance['8max']
                                }
                            ]
                        }
                    ]
                },{
                    title: {
                        text: '2018/09-台北市運動中心場地使用'
                    },
                    series: [
                        {
                            data: dataMap.dataSwim['9']
                        },
                        {
                            data: dataMap.dataGym['9']
                        },
                        {
                            data: dataMap.dataDance['9']
                        },
                        {
                            data: [{
                                    name: '游泳池',
                                    value: dataMap.dataSwim['9max']
                                },
                                {
                                    name: '健身房',
                                    value: dataMap.dataGym['9max']
                                },
                                {
                                    name: '瑜珈教室',
                                    value: dataMap.dataDance['9max']
                                }
                            ]
                        }
                    ]
                },{
                    title: {
                        text: '2018/10-台北市運動中心場地使用'
                    },
                    series: [
                        {
                            data: dataMap.dataSwim['10']
                        },
                        {
                            data: dataMap.dataGym['10']
                        },
                        {
                            data: dataMap.dataDance['10']
                        },
                        {
                            data: [{
                                    name: '游泳池',
                                    value: dataMap.dataSwim['10max']
                                },
                                {
                                    name: '健身房',
                                    value: dataMap.dataGym['10max']
                                },
                                {
                                    name: '瑜珈教室',
                                    value: dataMap.dataDance['10max']
                                }
                            ]
                        }
                    ]
                }
            ]
        };
        chart1.setOption(option);
    }
})