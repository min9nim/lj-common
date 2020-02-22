
#!/bin/sh

yarn test
if [ $? -ne 0 ]; then
  echo "test failed"
  exit 1
fi
rm -r dist
yarn build:lib
mv ~/.npmrc ~/.npmrc.tmp
mv ~/.npmrc.mgsong ~/.npmrc
npm publish --acces=public
mv ~/.npmrc ~/.npmrc.mgsong
mv ~/.npmrc.tmp ~/.npmrc