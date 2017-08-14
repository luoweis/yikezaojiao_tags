# -*- coding:utf-8 -*-
from flask import Flask,jsonify
from config import ProdConfig,DevConfig
from flask import abort
from flask import make_response
from flask import request
from flask_httpauth import HTTPBasicAuth
from tagLevel1 import level1
from yikezaojiao_redis import yikezaojiao_redis
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



#初始化标签库
# 调用方法：curl -u luoweis:yikezaojiao  http://localhost:5000/yikezaojiao/api/aboutTag/v1.0/init
@app.route("/yikezaojiao/api/aboutTag/v1.0/init",methods=['GET'])
@auth.login_required
def init_tags_pool():
    red = red_yikezaojiao.connection()
    red.sadd('tags_pool','尿不湿','发育期','玩具','开始说话','湿疹','数数','孕4周')
    tags_pool = red.smembers("tags_pool")
    tags_list=[]
    for tag in tags_pool:
        tags_list.append(tag)
    return jsonify({"tags_list":tags_list})
# 返回所有的结果
# 取出所有的一类大标签
# 调用方法：curl -u luoweis:yikezaojiao  http://localhost:5000/yikezaojiao/api/aboutTag/v1.0/level1
@app.route("/yikezaojiao/api/aboutTag/v1.0/level1",methods=['GET'])
# @auth.login_required
def get_tasks():
    red = red_yikezaojiao.connection()
    name = red.get('name')
    return jsonify({"level1":name})

#
# # 查询某一个id的信息
# @app.route("/yikezaojiao/api/v1.0/tasks/<int:task_id>",methods=['GET'])
# @auth.login_required
# def get_task(task_id):
#     task = filter(lambda t:t['id'] == task_id,tasks)
#     if len(task) == 0:
#         abort(404)
#     return jsonify({"tasks":task[0]})
#
#
# #添加一个task
# # 采用方法 POST
# # 前端调用方法： curl -i -H "Content-Type:application/json" -X POST -d '{"title":u"read a book"}' http://localhost:5000/yikezaojiao/api/v1.0/tasks
#
# @app.route("/yikezaojiao/api/v1.0/tasks",methods=['POST'])
# @auth.login_required
# def create_task():
#     if not request.json or not 'title' in request.json:
#         abort(400)
#     task = {
#         'id':tasks[-1]['id'] + 1,
#         'title':request.json['title'],
#         'description':request.json.get('description',""),
#         'done':request.json.get('done',False)
#     }
#     tasks.append(task)
#     return jsonify({"tasks": tasks})
#
# # 修改指定的task
# # PUT方法
# # 前端调用方法：curl -i -H "Content-Type:application/json" -X PUT -d '{"done":11,"description":"not unicode"}' http://localhost:5000/yikezaojiao/api/v1.0/tasks/1
# @app.route("/yikezaojiao/api/v1.0/tasks/<int:task_id>",methods=["PUT"])
# @auth.login_required
# def update_task(task_id):
#     task = filter(lambda t:t['id']==task_id,tasks)
#     if len(task) == 0:
#         abort(404)
#     if not request.json:
#         abort(400)
#     if 'title' in request.json and type(request.json['title']) !=unicode:
#         abort(400)
#     if 'description' in request.json and type(request.json['description']) != unicode:
#         abort(400)
#     if 'done' in request.json and type(request.json['done']) is not bool:
#         abort(400)
#     task[0]['title'] = request.json.get('title',task[0]['title'])
#     task[0]['description'] = request.json.get('description', task[0]['description'])
#     task[0]['done'] = request.json.get('done', task[0]['done'])
#     return jsonify({"task":task[0]})
# # 删除指定的task
# # delete
# # 调用方法：curl -i -H "Content-Type:application/json" -X DELETE http://localhost:5000/yikezaojiao/api/v1.0/tasks/2
# @app.route("/yikezaojiao/api/v1.0/tasks/<int:task_id>",methods=["DELETE"])
# @auth.login_required
# def delete_task(task_id):
#     task = filter(lambda t:t["id"] == task_id,tasks)
#     if len(task) == 0:
#         abort(400)
#     tasks.remove(task[0])
#     return jsonify({"result": True})

if __name__ == "__main__":
    app.run()


#链接数据库
#多用户机制
#get 检索可以携带可选的页的参数