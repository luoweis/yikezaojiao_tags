/**
 * Created by luoweis on 2017/8/10.
 */
var host = "http://127.0.0.1:5000/yikezaojiao/api";
var id = 0;
var level1Init =
    [
        {id:'cf1',name:'生理',detail:'生理发育',check:true,num:1},//生理发育为默认
        {id:'cf2',name:'自然',detail:'自然教育',check:false,num:2},
        {id:'cf3',name:'情绪',detail:'情绪品格',check:false,num:3},
        {id:'cf4',name:'语言',detail:'语言能力',check:false,num:4},
        {id:'cf5',name:'社交',detail:'社会交往',check:false,num:5},
        {id:'cf6',name:'逻辑',detail:'逻辑思维',check:false,num:6}
    ];
Vue.filter('top5', function(tags) {
    return tags.slice(0,4);
});
var yikezaojiao = new Vue({
    el: '#app',
    data:{
        title:'一刻早教标签系统',
        tagNow:'',
        lastTag:'',
        chooseLevel1:'',
        saved:{},
        tagsInLevel1:[],
        allTags:[],
        welcome:"一刻早教标签系统，欢迎使用！",
        ykzjTagLevel1:level1Init
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
                    yikezaojiao.$data.tagsInLevel1 = res.level1_tags;
                    // console.log(res.level1_tags)
                }
            });
        });
    },
    methods:{
        write2Database:function(levelName){
            var that = this;
            yikezaojiao.$data.lastTag=yikezaojiao.$data.tagNow;//上一个标签
            // yikezaojiao.$data.chooseLevel1 = levelName;//选择的一类标签
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
                        chooseLevel1:that.ykzjTagLevel1,
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
                    //重置默认设置
                    yikezaojiao.$data.ykzjTagLevel1=
                        [
                        {id:'cf1',name:'生理',detail:'生理发育',check:true,num:1},//生理发育为默认
                        {id:'cf2',name:'自然',detail:'自然教育',check:false,num:2},
                        {id:'cf3',name:'情绪',detail:'情绪品格',check:false,num:3},
                        {id:'cf4',name:'语言',detail:'语言能力',check:false,num:4},
                        {id:'cf5',name:'社交',detail:'社会交往',check:false,num:5},
                        {id:'cf6',name:'逻辑',detail:'逻辑思维',check:false,num:6}
                        ];
                    // console.log(level1Init);
                    yikezaojiao.$data.saved = data.saved
                    console.log(data.saved)

                }
            });


        },
        showHistory:function () {
            
        },
        checkLevel1:function (levelName) {
            console.log(levelName);
            var that = this;
            yikezaojiao.$data.ykzjTagLevel1[levelName-1].check = !yikezaojiao.$data.ykzjTagLevel1[levelName-1].check;
            // console.log(yikezaojiao.$data.ykzjTagLevel1[levelName-1].check)
        },
        deleteFromTagsPool:function (tag) {
            // alert("delete"+tag)

            this.$nextTick(function () {
                var url = host + "/aboutTag/v1.0/delete/"+tag;
                $.ajax({
                    type: "GET",
                    url: url,
                    success:function(res) {
                        yikezaojiao.$data.allTags.remove(tag);
                        // console.log(res.level1_tags)
                    }
                });
            });
        },
        showDelete:function (tag) {
            document.getElementById(tag).innerHTML=" "+ '<li class="fa fa-trash-o fa-lg" @click="deleteFromTagsPool('+"'"+tag+"'"+')">'+ tag +'</li>'+"  ";

        },
        hiddenDelete:function(tag){
            document.getElementById(tag).innerHTML=tag+" ";
        }
    }
});

Array.prototype.indexOf = function(val) {
for (var i = 0; i < this.length; i++) {
if (this[i] == val) return i;
}
return -1;
};
Array.prototype.remove = function(val) {
var index = this.indexOf(val);
if (index > -1) {
this.splice(index, 1);
}
};