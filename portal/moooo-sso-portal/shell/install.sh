#!/bin/sh
# 
# Description: Deploy application shell.

name=$(date +%Y-%m-%d) 
date_now=$(date +%s)
BACK_PATH=/backup/v5.0/tomcat/sso/$name/portal/$date_now
if [ ! -d "$BACK_PATH/portal" ]; then
    mkdir -p $BACK_PATH
    \cp -av /usr/local/tomcat/webapps/portal $BACK_PATH
    echo "BackUP completed!"
fi

rm -rf /usr/local/tomcat/webapps/portal
rm -rf /usr/local/tomcat/work/*
unzip -o ./portal.war  -d  /usr/local/tomcat/webapps/portal

