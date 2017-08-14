# -*- coding:utf-8 -*-

class Config(object):
    pass

class ProdConfig(Config):
    hello_word = "product configure"
class DevConfig(Config):
    #Debug
    DEBUG = True
    redis_server='123.207.164.215'
    redis_port='9736'
    redis_db = 0
    redis_password = 'P@ssword991120'
    #SQLALCHEMY_TRACK_MODIFICATIONS = True
    #SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://cdb_outerroot:P@ssword!@#123@59560724aa35c.bj.cdb.myqcloud.com:8336/flask_project1'




