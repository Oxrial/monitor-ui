echo ">>> 正在下载未压缩依赖... <<<"
npm i
echo ">>> 下载完成 <<<"
echo ">>> 正在下载tgz格式依赖... <<<"
npm install node-tgz-downloader -g
download-tgz package-json package.json
echo ">>> 下载完成 <<<"
echo ">>> 正在移动tgz文件... \n"
mkdir tgz
find ./tarballs -maxdepth 4 -name "*.tgz" | xargs mv -t ./tgz
echo ">>> 移动完成 \n"
echo ">>> 正在删除无用依赖... <<<"
rm -r tarballs
#rm -r node_modules
echo ">>> 外网操作完成 \n"
read -n 1
