npx npm-check-updates -u
npm install
npm --no-git-tag-version version patch
git commit -m "update" .
git push
npm publish

