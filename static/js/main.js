$(function () {
    var lastRefreshTime = new Date();
    var areaPeople;
    LocationPeopleNum();
    setTimeout(InitView, 500);
    ReloadLocationPeopleNum();
    LoadPeopleChar();
    $(".area").mouseover(function (e) {
        $('path').attr('class', function (index, classNames) {
            return classNames.replace('default', '');
        });
        ShowInfo(e);
    }).mouseout(
        function () {
            $(".follow").html('').removeClass();
        });

    function ShowInfo(e) {        
        $(".showArea").text($(e.currentTarget).attr("data-area"));
        // console.log($(e.currentTarget).context.id)
        areaPeople.find(function (item, index, array) {
            if (item.LID == $(e.currentTarget).context.id) {
                $("#gymPeopleNum").text(item.gymPeopleNum + " / " + item.gymMaxPeopleNum);
                $("#swimPeopleNum").text(item.swPeopleNum + " / " + item.swMaxPeopleNum);
            }
        });
        //cursor show area 
        $("#follow").addClass("follow");
        window.onmousemove = function (ev) {
            var ev = ev || window.event;
            var oLeft = ev.clientX + 40;
            var oTop = ev.clientY + 30;
            $(".follow").css({
                'display': 'block',
                'left': oLeft + 'px',
                'top': oTop + 'px'
            }).text($(e.currentTarget).attr("data-area"));
        }
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
            }
        });
    }

    function ReloadLocationPeopleNum(){
		if(new Date().getTime() - lastRefreshTime.getTime() > 10000){//10 * 1000 = 10000
			LocationPeopleNum();
		}
	    setTimeout(ReloadLocationPeopleNum, 1000);
    }
    
    function LoadPeopleChar(){
        // 基于准备好的dom，初始化echarts实例
        var chart = echarts.init(document.getElementById('pie'));
            // 指定图表的配置项和数据
            var option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        crossStyle: {
                            color: '#999'
                        }
                    }
                },
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
                        },
                        saveAsImage: {
                            show: true
                        }
                    }
                },
                legend: {
                    data: ['蒸发量', '降水量', '平均温度']
                },
                xAxis: [{
                    type: 'category',
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月',
                        '12月'
                    ],
                    axisPointer: {
                        type: 'shadow'
                    }
                }],
                yAxis: [{
                        type: 'value',
                        name: '水量',
                        min: 0,
                        max: 250,
                        interval: 50,
                        axisLabel: {
                            formatter: '{value} ml'
                        }
                    },
                    {
                        type: 'value',
                        name: '温度',
                        min: 0,
                        max: 25,
                        interval: 5,
                        axisLabel: {
                            formatter: '{value} °C'
                        }
                    }
                ],
                series: [{
                        name: '蒸发量',
                        type: 'bar',
                        data: [2.0, 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3]
                    },
                    {
                        name: '降水量',
                        type: 'bar',
                        data: [2.6, 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 2.3]
                    },
                    {
                        name: '平均温度',
                        type: 'line',
                        yAxisIndex: 1,
                        data: [2.0, 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 6.2]
                    }
                ]
            };
            // 使用刚指定的配置项和数据显示图表。
            chart.setOption(option);
    }
})