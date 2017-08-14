#!/usr/bin/env python
# -*- coding: utf-8 -*-
import redis
from config import DevConfig,ProdConfig

class yikezaojiao_redis():
    def __init__(self):
        self.host = DevConfig.redis_server
        self.port = DevConfig.redis_port
        self.db = DevConfig.redis_db
        self.password = DevConfig.redis_password
    #创建redis链接池
    def connection(self):
        pool = redis.ConnectionPool(
            host=self.host,
            port=self.port,
            db = self.db,
            password = self.password
        )
        r = redis.Redis(connection_pool=pool)
        return r