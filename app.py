# -*- coding:utf-8 -*-
from flask import Flask,jsonify
from config import ProdConfig,DevConfig
from flask import abort
from flask import make_response
from flask import request
from flask_httpauth import HTTPBasicAuth
from yikezaojiao_redis import yikezaojiao_redis
from tagLevel1 import level1
app = Flask(__name__)

#加载开发配置
app.config.from_object(DevConfig)
#实例化 redis
red_yikezaojiao = yikezaojiao_redis()
#api server 验证
auth = HTTPBasicAuth()
@auth.get_password
def get_password(username):
    if username == "luoweis":
        return 'yikezaojiao' #此处是一个回调函数
    return None

@auth.error_handler
def unauthorized():
    # return make_response(jsonify({'error':'unauthorized access'}),401)
    # 当请求收到一个401错误时，浏览器会弹出一个登陆框，即使请求是在后台发生的
    # 解决方法：不返回401错误，使用403错误进行替代
    return make_response(jsonify({'error':'unauthorized access!'}),403)
# 错误返回 404
@app.errorhandler(404)
def not_found(error):
    return make_response(jsonify({'error': 'Not found'}), 404)

# 错误返回 400
@app.errorhandler(400)
def bad_request(error):
    return make_response(jsonify({'error': 'Bad Request'}), 400)



#初始化动作
#删除
# 调用方法：curl -u luoweis:yikezaojiao  http://localhost:5000/yikezaojiao/api/aboutTag/v1.0/init
@app.route("/yikezaojiao/api/aboutTag/v1.0/init",methods=['GET'])
@auth.login_required
def init_tags_pool():
    red = red_yikezaojiao.connection()
    # red.sadd('tags_pool','尿不湿','发育期','玩具','开始说话','湿疹','数数','孕4周')
    tags_pool = red.smembers(DevConfig.redis_key_all_tags)
    tags_list=[]
    for tag in tags_pool:
        tags_list.append(tag)
    return jsonify({"tags_list":tags_list})

# 提取redis数据中经过初始化后所有的标签
#
# 调用方法：curl -u luoweis:yikezaojiao  http://localhost:5000/yikezaojiao/api/aboutTag/v1.0/tags
@app.route("/yikezaojiao/api/aboutTag/v1.0/tags",methods=['GET'])
# @auth.login_required
def get_tags():

    red = red_yikezaojiao.connection()
    tags_pool = list(red.smembers(DevConfig.redis_key_all_tags))
    delete_tags_pool = list(red.smembers(DevConfig.redis_key_delete_tag))
    deal_tags_pool = list(red.smembers(DevConfig.redis_key_deal_tag))
    # 列出每个大类中的子标签
    level1_tags = []
    for level in level1:
        level1_tags.append({
            'level1':level['detail'],
            'count':red.scard(level['detail']),
            'tags':list(red.smembers(level['detail']))#将set格式通过list转换成列表否则json化会报错
        })
    return jsonify({"tags_list":tags_pool,"deal_tags_list":deal_tags_pool,"level1_tags":level1_tags,"delete_tags_list":delete_tags_pool})
#提取redis数据库大标签的数量在前端进行数据可视化
@app.route("/yikezaojiao/api/aboutTag/v1.0/level1/count", methods=['GET'])
# @auth.login_required
def level1_tags_count():
    red = red_yikezaojiao.connection()
    level1_number = {}
    for level in level1:
        level1_number[level['detail']] = red.scard(level['detail'])

    return jsonify({"level1_number": level1_number})
#前端提交的数据在这里准备写入redis数据库中
# # 前端调用方法： curl -i -H "Content-Type:application/json" -X POST -d '{"chooseLevel1":u"cf1","tag":u"尿不湿"}' http://localhost:5000/yikezaojiao/api/aboutTag/v1.0/save
@app.route("/yikezaojiao/api/aboutTag/v1.0/save",methods=['POST'])
# @auth.login_required
def save_tags():
    red = red_yikezaojiao.connection()
    if not request.json or not 'chooseLevel1' in request.json:
        abort(400)

    if not request.json or not 'tag' in request.json:
        abort(400)
    #初始化
    save_success=[]
    for level1 in request.json['chooseLevel1']:
        if level1['check']:#如果是true
            ok = red.sadd(level1['detail'],request.json['tag'])
            if ok==1:
                save_success.append(
                    {"tagNow":request.json['tag'],"count":red.scard(level1['detail']),"level1":level1['detail']}
                )
            else:
                pass
    #将已经分配的标签从可用标签池中移动到已处理的标签池中
    red.smove(DevConfig.redis_key_all_tags,DevConfig.redis_key_deal_tag,request.json['tag'])

    return jsonify({"saved":save_success})
#从可用标签池中删除指定的标签，提前预处理
@app.route("/yikezaojiao/api/aboutTag/v1.0/delete/<string:tag>", methods=['GET'])
# @auth.login_required
def delete_tag(tag):
    red = red_yikezaojiao.connection()
    # red.srem('tags_pool',tag)
    # 将已经分配的标签从"tags_pool"中移到"tags_pool_removed"中
    ok = red.smove(DevConfig.redis_key_all_tags, DevConfig.redis_key_delete_tag, tag)
    if ok:
        return jsonify({"res": 'ok'})
    else:
        return jsonify({"res": 'error'})

# 从已删除池中恢复指定的标签到可用标签池中
@app.route("/yikezaojiao/api/aboutTag/v1.0/recovery/<string:tag>", methods=['GET'])
# @auth.login_required
def recovery_tag(tag):
    red = red_yikezaojiao.connection()

    # 将已经分配的标签从"tags_pool_delete"中移到"tags_pool"中
    ok = red.smove(DevConfig.redis_key_delete_tag, DevConfig.redis_key_all_tags, tag)
    if ok:
        return jsonify({"res": 'ok'})
    else:
        return jsonify({"res": 'error'})


if __name__ == "__main__":
    app.run()


#链接数据库
#多用户机制
#get 检索可以携带可选的页的参数