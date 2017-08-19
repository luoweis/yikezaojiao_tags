# -*- coding:utf-8 -*-

class Config(object):
    pass

class ProdConfig(Config):
    word = "product configure"
    
class DevConfig(Config):
    #Debug
    DEBUG = True
    redis_server='123.207.164.215'
    redis_port='9736'
    redis_db = 0
    redis_password = 'P@ssword991120'
    redis_key_stop_word = 'yikezaojiao:stop_tag' #存放初始停止词
    redis_key_all_tags = 'yikezaojiao:tags_pool_available' #存放可用标签库
    redis_key_delete_tag = 'yikezaojiao:tags_pool_delete' #存放删除操作的标签库
    redis_key_deal_tag = 'yikezaojiao:tags_pool_deal' #存放已经处理的标签库


    #SQLALCHEMY_TRACK_MODIFICATIONS = True
    #SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://cdb_outerroot:P@ssword!@#123@59560724aa35c.bj.cdb.myqcloud.com:8336/flask_project1'




