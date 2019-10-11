#!/bin/sh

cd ..
mvn clean version:config install -Dmaven.test.skip=true -U

