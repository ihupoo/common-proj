#!/bin/sh

cd ../target/
find  portal/  -path "portal/META-INF" -prune -o -type  f  -print0  |  xargs --null  md5sum  >  portal.md5
cd ../shell/