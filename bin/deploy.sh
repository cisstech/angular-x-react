yarn build:react-for-angular --skip-nx-cache
yarn build:angular-for-react --skip-nx-cache

yarn build:react --skip-nx-cache
yarn build:angular --skip-nx-cache

rm -rf dist/github

mkdir -p dist/github/angular
mkdir -p dist/github/react

mv dist/apps/angular dist/github
mv dist/apps/react dist/github

cp bin/index.html dist/github/index.html

rm -rf dist/apps

cd dist/github
git init
git add .
git commit -m "Deploying Angular and React apps"
git remote add origin https://github.com/cisstech/angular-x-react
git push -f origin main:gh-pages