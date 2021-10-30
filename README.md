[![Tweet](https://img.shields.io/twitter/url/http/Hktalent3135773.svg?style=social)](https://twitter.com/intent/follow?screen_name=Hktalent3135773) [![Follow on Twitter](https://img.shields.io/twitter/follow/Hktalent3135773.svg?style=social&label=Follow)](https://twitter.com/intent/follow?screen_name=Hktalent3135773) [![GitHub Followers](https://img.shields.io/github/followers/hktalent.svg?style=social&label=Follow)](https://github.com/hktalent/)

# myapp_51pwn
```
npm i child_process compression express express-limiter  helmet node-uuid redis socket.io-client spdy socket.io-redis spdy uglify-js useragent
```
DeprecationWarning: Access to process.binding('http_parser') is deprecated.
https://github.com/spdy-http2/node-spdy/issues/380
https://github.com/spdy-http2/http-deceiver/issues/6
<!--
,"postversion": "git commit -m 'update' . && git push && git push --tags && npm publish"
-->

now, node 8 spdy http2 is ok
## how use
```
docker run --rm  --name mywebapp-redis -d redis:6.2.6-alpine3.14
npm install -g myapp_51pwn
# fix Incorrect Handling of Non-Boolean Comparisons During Minification
# fix Regular Expression Denial of Service
npm i  uglify-js
npm audit fix
npm audit
```

## default
- singleIpMaxConnect 100,lan net unlimited for dev
- static resource cache time life maxAge  31536000s
- gzip static resource level 9(max is 9)

## see example test.js,or example/
```
node --trace-deprecation test.js
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
    redisAdapter:{ host: 'docker.for.mac.localhost', port: 6379 },
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
