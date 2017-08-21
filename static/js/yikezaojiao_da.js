/**
 * Created by luoweis on 2017/8/15.
 */
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('main'));
app.title = '标签系统';

option = {
    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b}: {c} ({d}%)"
    },
    legend: {
        orient: 'vertical',
        x: 'left',
        data:["生理发育","自然教育","情绪品格","语言能力","社会交往","逻辑思维"]
    },
    series: [
        {
            name:'访问来源',
            type:'pie',
            radius: ['50%', '70%'],
            avoidLabelOverlap: false,
            label: {
                normal: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    show: true,
                    textStyle: {
                        fontSize: '20',
                        fontWeight: 'bold'
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data:[
                {value:335, name:'生理发育'},
                {value:310, name:'自然教育'},
                {value:234, name:'情绪品格'},
                {value:135, name:'语言能力'},
                {value:456, name:'社会交往'},
                {value:789, name:'逻辑思维'}
            ]
        }
    ]
};
// var server = "http://211.159.153.82:8080";

var host = config.server + "/yikezaojiao/api";
var url = host + "/aboutTag/v1.0/level1/count";

function changeData() {
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
            option.series[0].data[0].value = res.level1_number[option.legend.data[0]];
            option.series[0].data[1].value = res.level1_number[option.legend.data[1]];
            option.series[0].data[2].value = res.level1_number[option.legend.data[2]];
            option.series[0].data[3].value = res.level1_number[option.legend.data[3]];
            option.series[0].data[4].value = res.level1_number[option.legend.data[4]];
            option.series[0].data[5].value = res.level1_number[option.legend.data[5]];
            myChart.setOption(option);
        }
    });
}
changeData();

setInterval(function (){
    changeData();
}, 20000);
