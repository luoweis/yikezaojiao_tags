/**
 * Created by luoweis on 2017/8/10.
 */
var yikezaojiao = new Vue({
    el: '#app',
    data:{
        title:'一刻早教标签系统',
        tagNow:'尿不湿',
        lastTag:'',
        chooseLevel1:'',
        ykzjTagLevel1:[
            {id:'cf1',name:'生理',detail:'生理发育'},
            {id:'cf2',name:'自然',detail:'自然教育'},
            {id:'cf3',name:'情绪',detail:'情绪品格'},
            {id:'cf4',name:'语言',detail:'语言能力'},
            {id:'cf5',name:'社交',detail:'社会交往'},
            {id:'cf6',name:'逻辑',detail:'逻辑思维'}
        ]
    },

    // beforeCreate:function () {
    //     // alert('beforeCreate!')
    //     this.$nextTick(function () {
    //         var _self = this;
    //         var url = "http://127.0.0.1:5000/yikezaojiao/api/aboutTag/v1.0/level1";
    //         $.ajax({
    //             type: "GET",
    //             url: url,
    //             // username: "luoweis",
    //             // password: "yikezaojiao",
    //             // dataType:'',
    //             success:function(res) {
    //                 console.log(res.level1);
    //                 // yikezaojiao.$data.ykzjTagLevel1=res.level1;
    //                 _self.ykzjTagLevel1 = res.level1
    //         }
    //     });
    //     });
    // },
    methods:{
        write2Database:function(levelName){
            // alert('写入数据库！');
            yikezaojiao.$data.lastTag=yikezaojiao.$data.tagNow;
            yikezaojiao.$data.chooseLevel1 = levelName;
            yikezaojiao.$data.tagNow = '孕四周';

        },
        showHistory:function () {
            
        }
    }
});