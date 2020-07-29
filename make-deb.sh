#!/bin/sh

rm dist/* -r
mkdir dist/DEBIAN
mkdir dist/usr
mkdir dist/usr/share
mkdir dist/usr/share/symon-v2
cp deb-control dist/DEBIAN/control
cp node_modules dist/usr/share/symon-v2/ -r
cp checks dist/usr/share/symon-v2/ -r
cp index.js dist/usr/share/symon-v2
dpkg-deb --build dist
mv dist.deb dist/symon-v2-1.0.0_amd64.deb