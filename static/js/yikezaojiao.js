/**
 * Created by luoweis on 2017/8/21.
 */
//语言交流，感觉运动，认知发展，数理逻辑，情绪表达，社群交往
var config = {
    server:"http://127.0.0.1:8080",
    // cloudServer:"http://211.159.153.82:8080"
    level1Init:
    [
        {id:'cf1',name:'语言',detail:'语言交流',check:true,num:1},//生理发育为默认
        {id:'cf2',name:'感觉',detail:'感觉运动',check:false,num:2},
        {id:'cf3',name:'认知',detail:'认知发展',check:false,num:3},
        {id:'cf4',name:'数理',detail:'数理逻辑',check:false,num:4},
        {id:'cf5',name:'情绪',detail:'情绪表达',check:false,num:5},
        {id:'cf6',name:'社群',detail:'社群交往',check:false,num:6}
    ]
};