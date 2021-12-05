#  wget -c https://nodejs.org/download/release/v14.17.6/node-v14.17.6.pkg
npx npm-check-updates -u
npm install
npm --no-git-tag-version version patch
git commit -m "update" .
git push
npm publish

