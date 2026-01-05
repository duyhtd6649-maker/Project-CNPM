import pymysql

pymysql.install_as_MySQLdb()

import MySQLdb

if hasattr(MySQLdb, 'version_info'):
    MySQLdb.version_info = (2, 2, 1, 'final', 0)

if hasattr(MySQLdb, '__version__'):
    MySQLdb.__version__ = '2.2.1'