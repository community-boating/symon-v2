#!/bin/sh
VERSION=`grep -oP '"version": "\K[\.0-9]*(?=")' package.json`

sed -i "s/Version: .*/Version: $VERSION/g" deb-control
rm dist/* -r
mkdir dist/DEBIAN
mkdir dist/usr
mkdir dist/usr/share
mkdir dist/usr/share/symon-v2
mkdir dist/usr/share/icinga2
mkdir dist/usr/share/icinga2/include
cp deb-control dist/DEBIAN/control
cp node_modules dist/usr/share/symon-v2/ -r
cp checks dist/usr/share/symon-v2/ -r
cp index.js dist/usr/share/symon-v2
cp nagios-checks.conf dist/usr/share/icinga2/include/symon_definitions.conf
dpkg-deb --build dist
mv dist.deb dist/symon-v2-${VERSION}_amd64.deb
scp dist/symon-v2-${VERSION}_amd64.deb root@rsx.community-boating.org:/root/
