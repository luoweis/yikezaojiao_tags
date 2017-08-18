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
        deletedTags:[],
        dealTags:[],
        welcome:"一刻早教标签系统，欢迎使用！",
        ykzjTagLevel1:level1Init,
        isA:true,
        isShow:true,
        isShowDelete:true,
        availabilityNum:'',//可用标签池中的标签数量
        deletedNum:''//删除标签池中的标签数量
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
                    yikezaojiao.$data.deletedTags=res.delete_tags_list;
                    yikezaojiao.$data.dealTags=res.deal_tags_list;
                    _self.availabilityNum = res.tags_list.length;
                    _self.deletedNum = res.delete_tags_list.length;
                    // console.log(res.level1_tags)
                }
            });
        });
    },
    methods:{
        //保存某个标签的方法
        write2Database:function(levelName){
            var that = this;
            yikezaojiao.$data.lastTag=yikezaojiao.$data.tagNow;//上一个标签
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
                    yikezaojiao.$data.saved = data.saved;
                    yikezaojiao.$data.dealTags.unshift(that.lastTag);
                    yikezaojiao.$data.allTags.remove(that.lastTag);
                    // console.log(data.saved)


                }
            });


        },
        showHistory:function () {
            
        },
        checkLevel1:function (levelName) {
            // console.log(levelName);
            var that = this;
            yikezaojiao.$data.ykzjTagLevel1[levelName-1].check = !yikezaojiao.$data.ykzjTagLevel1[levelName-1].check;
            // console.log(yikezaojiao.$data.ykzjTagLevel1[levelName-1].check)
        },
        //将某个tag从可用标签池中删除
        deleteFromTagsPool:function (tag) {
            // alert("delete"+tag)
            var that = this;
            this.$nextTick(function () {
                var url = host + "/aboutTag/v1.0/delete/"+tag;
                $.ajax({
                    type: "GET",
                    url: url,
                    success:function(res) {
                        //首先移除标签池中的指定tag
                        yikezaojiao.$data.allTags.remove(tag);
                        //插入到删除标签池的前端
                        yikezaojiao.$data.deletedTags.unshift(tag);
                        //转换现在的要处理的标签
                        if(yikezaojiao.$data.tagNow=tag) {
                            yikezaojiao.$data.tagNow = yikezaojiao.$data.allTags[0]
                            that.availabilityNum = that.allTags.length;
                            that.deletedNum = that.deletedTags.length;
                        }
                        // console.log(res.level1_tags)
                    }
                });
            });
        },
        recoveryFromDeleteTagsPool:function (tag) {
            // alert("delete"+tag)
            var that = this;
            this.$nextTick(function () {
                var url = host + "/aboutTag/v1.0/recovery/"+tag;
                $.ajax({
                    type: "GET",
                    url: url,
                    success:function(res) {
                        yikezaojiao.$data.deletedTags.remove(tag);
                        yikezaojiao.$data.allTags.unshift(tag);
                        that.availabilityNum = that.allTags.length;
                        that.deletedNum = that.deletedTags.length;
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
        },
        hiddenAllTags:function () {
            var that = this;
            that.isShow = !that.isShow;
        },
        hiddenDeleteTags:function () {
            var that = this;
            that.isShowDelete = !that.isShowDelete;
        }
    }
});

//列表删除指定的元素
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