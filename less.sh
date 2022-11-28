#!/bin/sh
node_modules/lessc/node_modules/less/bin/lessc src/less/main.less src/css/main.css
node_modules/lessc/node_modules/less/bin/lessc src/less/_dark.less src/css/_dark.css
node_modules/lessc/node_modules/less/bin/lessc src/less/_light.less src/css/_light.css
node_modules/lessc/node_modules/less/bin/lessc src/bootstrap/less/bootstrap.less src/bootstrap/css/bootstrap.css
