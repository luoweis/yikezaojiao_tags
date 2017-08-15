/**
 * Created by luoweis on 2017/8/10.
 */
var host = "http://127.0.0.1:5000/yikezaojiao/api";
var id = 0;
var yikezaojiao = new Vue({
    el: '#app',
    data:{
        title:'一刻早教标签系统',
        tagNow:'',
        lastTag:'',
        chooseLevel1:'',
        allTags:[],
        welcome:"一刻早教标签系统，欢迎使用！",
        ykzjTagLevel1:[
            {id:'cf1',name:'生理',detail:'生理发育'},
            {id:'cf2',name:'自然',detail:'自然教育'},
            {id:'cf3',name:'情绪',detail:'情绪品格'},
            {id:'cf4',name:'语言',detail:'语言能力'},
            {id:'cf5',name:'社交',detail:'社会交往'},
            {id:'cf6',name:'逻辑',detail:'逻辑思维'}
        ]
    },

    beforeCreate:function () {
        // alert('beforeCreate!')
        //this.$nextTick方法保证数据加载完再进行渲染
        this.$nextTick(function () {
            var _self = this;
            var url = host + "/aboutTag/v1.0/tags";
            $.ajax({
                type: "GET",
                url: url,
                // username: "luoweis",
                // password: "yikezaojiao",
                // dataType:'',
                success:function(res) {
                    // console.log(res.level1);
                    // yikezaojiao.$data.ykzjTagLevel1=res.level1;
                    _self.allTags = res.tags_list;
                    yikezaojiao.$data.tagNow = res.tags_list[0];
                }
            });
        });
    },
    methods:{
        write2Database:function(levelName){
            var that = this;
            yikezaojiao.$data.lastTag=yikezaojiao.$data.tagNow;//上一个标签
            yikezaojiao.$data.chooseLevel1 = levelName;//选择的一类标签
            // 写入redis数据库的过程
            var url = host+ "/aboutTag/v1.0/save";
            $.ajax({
                type: "post",
                url: url,
                 async: false, // 使用同步方式
                // 1 需要使用JSON.stringify 否则格式为 a=2&b=3&now=14...
                // 2 需要强制类型转换，否则格式为 {"a":"2","b":"3"}
                data: JSON.stringify({
                        // a: parseInt($('input[name="a"]').val()),
                        // b: parseInt($('input[name="b"]').val()),
                        // now: new Date().getTime()
                        chooseLevel1:that.chooseLevel1,
                        tag:that.lastTag
                }),
                contentType: "application/json;",
                dataType: "json",
                success: function(data) {
                    // alert(data.level1_tags_number);
                    //控制自动读取标签列表的下一个标签进行判断分析
                    id = id +1;
                    yikezaojiao.$data.tagNow = that.allTags[id];
                    yikezaojiao.$data.welcome = false;
                }
            });


        },
        showHistory:function () {
            
        }
    }
});