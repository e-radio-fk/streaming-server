#!/bin/sh
node_modules/lessc/node_modules/less/bin/lessc docs/less/main.less docs/css/main.css
node_modules/lessc/node_modules/less/bin/lessc docs/less/_dark.less docs/css/_dark.css
node_modules/lessc/node_modules/less/bin/lessc docs/less/_light.less docs/css/_light.css
