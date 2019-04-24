
##### Twitter: [@Hktalent3135773](https://twitter.com/Hktalent3135773) 
[![Tweet](https://img.shields.io/twitter/url/http/Hktalent3135773.svg?style=social)](https://twitter.com/intent/tweet?original_referer=https%3A%2F%2Fdeveloper.twitter.com%2Fen%2Fdocs%2Ftwitter-for-websites%2Ftweet-button%2Foverview&ref_src=twsrc%5Etfw&text=myapp%20-%20Automated%20Pentest%20Recon%20Scanner%20%40Hktalent3135773&tw_p=tweetbutton&url=https%3A%2F%2Fgithub.com%2Fhktalent%2Fmyapp)
[![Follow on Twitter](https://img.shields.io/twitter/follow/Hktalent3135773.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=Hktalent3135773)
[![Github Stars](https://img.shields.io/github/stars/hktalent/myapp.svg?style=social&label=Stars&color=orange)](https://github.com/hktalent/myapp/) 
[![GitHub Followers](https://img.shields.io/github/followers/hktalent.svg?style=social&label=Follow)](https://github.com/hktalent/myapp/)
![GitHub forks](https://img.shields.io/github/forks/hktalent/myapp.svg?style=social&label=Fork)

[![GitHub issues](https://img.shields.io/github/issues/hktalent/myapp.svg)](https://github.com/hktalent/myapp/issues) 
![GitHub watchers](https://img.shields.io/github/watchers/hktalent/myapp.svg?label=Watch)
![GitHub contributors](https://img.shields.io/github/contributors/hktalent/myapp.svg?colorB=red&colorA=orange)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/hktalent/myapp.svg?colorB=ff9988&colorA=006666)
![GitHub language count](https://img.shields.io/github/languages/count/hktalent/myapp.svg?colorB=995500&colorA=551166)
![GitHub search hit counter](https://img.shields.io/github/search/hktalent/myapp/goto.svg?colorB=0077ff&colorA=11aadd)
![GitHub top language](https://img.shields.io/github/languages/top/hktalent/myapp.svg?colorB=red&colorA=dd88ff)
![os](https://img.shields.io/badge/OS-Linux,%20Window,%20macOS-green.svg)
![nodejs](https://img.shields.io/badge/nodejs-blue.svg)
![python](https://img.shields.io/badge/python2-red.svg)
![license](https://img.shields.io/github/license/mashape/apistatus.svg)

# myapp_51pwn

## how use
```
npm install -g myapp_51pwn
# fix Incorrect Handling of Non-Boolean Comparisons During Minification
# fix Regular Expression Denial of Service
npm i  uglify-js
npm audit fix
npm audit
```
## see example test.js,or example/
```
node test.js
```
```js
var myapp = require('myapp_51pwn'),
    serverRootPath = __dirname + "/",
    szSSP = serverRootPath + "static/";

var oMyapp = new myapp({
    serverRootPath:serverRootPath,
    webStaticPath:szSSP,
    singleIpMaxConnect:30,
    useHttps:false,
    port:3000,
    // caKey:,
    // caCert:,
    wtHosts:["51pwn.com","www.51pwn.com","exploit-poc.com","www.exploit-poc.com"],
    redisAdapter:{ host: '127.0.0.1', port: 6379 },
    cbkApp:function(app)
    {
        app.get(/\/:[^\.\? ]+/, (req, res) => res.sendFile(szSSP + '/p2pchat.html'));
    },
    cbk4ServerAppIo:function(server,app,io)
    {
        // web webssh
        require(szSSP + '/ssh').mySSH(app,io.of("/s_s-hX"));
        // win rdp
        require(szSSP + '/mstsc')(server,io.of("/r_dpX"));
        require(szSSP + '/p2pchat').fnInit(io.of("/pChat"));
    },
    onLog:function(s)
    {
        console.log(s);
    }
});

```
## web Microservices，Distributed service,Distributed web service
```
node example/server.js
# other shell,test
node example/client.js
```

## open web
```
firefox http://127.0.0.1:3000/index.html
```
## other test
```
curl -v -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/73.0.3683.103 Safari/537.36' -H "Host: 51pwn.com" http://127.0.0.1:3000/index.html

# refuse no User-Agent or Host spoof attack
Empty reply from server

```
## security headers
```
Referrer-Policy: no-referrer
X-DNS-Prefetch-Control: off
X-Frame-Options: SAMEORIGIN
Strict-Transport-Security: max-age=15552000; includeSubDomains
X-Download-Options: noopen
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
x-timestamp: 1555951796755
Accept-Ranges: bytes
Cache-Control: public, max-age=31536000
Last-Modified: Mon, 22 Apr 2019 16:16:28 GMT
```
### nginx.conf
```
server{
add_header X-Frame-Options SAMEORIGIN;
add_header X-Download-Options  noopen;
add_header X-XSS-Protection "1;mode=block";
# your other
}
```
