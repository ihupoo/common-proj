#!/bin/sh

cp -r install.sh ../target/

chmod +x ../target/install.sh

makeself ../target  ../target/portal.bin  "Deploy the portal application..." ./install.sh