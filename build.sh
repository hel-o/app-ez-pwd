#!/usr/bin/env bash

echo "BUILDING..."

npm run generate
cd .output
tar -cJvf app-ez-pwd.tar.xz public/
mkdir -p /tmp/tmp-ez-pwd/
mv app-ez-pwd.tar.xz /tmp/tmp-ez-pwd
cd ..
rm -rf .output/
rm -rf dist/
echo "DONE!!"
