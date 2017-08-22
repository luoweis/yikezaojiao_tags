/**
 * Created by luoweis on 2017/8/15.
 */
// 基于准备好的dom，初始化echarts实例

var myChart1 = echarts.init(document.getElementById('main1'));
app.title = '';
var dmax = 0;
option1 = {
    title: {
        text: ''
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        x: 'center'
        // data:['标签系统']
    },
    radar: [
        {
            indicator: [
                {text: '语言交流', max: dmax},
                {text: '感觉运动', max: dmax},
                {text: '认知发展', max: dmax},
                {text: '数理逻辑', max: dmax},
                {text: '情绪表达', max: dmax},
                {text: '社群交往', max: dmax}
            ],
            // center: ['25%','40%'],
            radius: 80
        }
    ],
    series: [
        {
            type: 'radar',
             tooltip: {
                trigger: 'item'
            },
            itemStyle: {normal: {areaStyle: {type: 'default'}}},
            data: [
                {
                    value: [],
                    name: '标签系统'
                }
            ]
        },
    ]
};
// myChart1.setOption(option1);
// var server = "http://211.159.153.82:8080";

var host = config.server + "/yikezaojiao/api";
var url = host + "/aboutTag/v1.0/level1/count";

function changeData1() {
    $.ajax({
        type: "GET",
        url: url,
        // username: "luoweis",
        // password: "yikezaojiao",
        // dataType:'',
        success:function(res) {
            // console.log(res.level1);
            // yikezaojiao.$data.ykzjTagLevel1=res.level1;
            // alert(res.level1_number[option.legend.data[0]])
            // for(var i=0;i<option.legend.data;i++) {
            //     option.series[0].data[i].value = res.level1_number[option.legend.data[i]];
            // }
            //语言交流，感觉运动，认知发展，数理逻辑，情绪表达，社群交往
            option1.series[0].data[0].value[0]=res.level1_number['语言交流'];
            option1.series[0].data[0].value[1]=res.level1_number['感觉运动'];
            option1.series[0].data[0].value[2]=res.level1_number['认知发展'];
            option1.series[0].data[0].value[3]=res.level1_number['数理逻辑'];
            option1.series[0].data[0].value[4]=res.level1_number['情绪表达'];
            option1.series[0].data[0].value[5]=res.level1_number['社群交往'];
            // dmax = sum(option1.series[0].data[0].value);
            dmax = Math.max.apply(null, option1.series[0].data[0].value) * 1.2;
            option1.radar[0].indicator[0].max=dmax;
            option1.radar[0].indicator[1].max=dmax;
            option1.radar[0].indicator[2].max=dmax;
            option1.radar[0].indicator[3].max=dmax;
            option1.radar[0].indicator[4].max=dmax;
            option1.radar[0].indicator[5].max=dmax;
            myChart1.setOption(option1);
        }
    });
}
function sum(arr)
{
    var sum = 0;
    for(var i=0;i<arr.length;i++){
        sum += arr[i];
    }
    return sum;
}
changeData1();

setInterval(function (){
    changeData1();
}, 31000);
