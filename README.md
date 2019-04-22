# myapp_51pwn

## how use
```
npm install -g myapp_51pwn
```
## see example test.js
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
    cbk4AppIo:function(server,app,io)
    {
        // 开启webssh
        require(szSSP + '/ssh').mySSH(app,io.of("/s_s-hX"));
        // win远程桌面
        require(szSSP + '/mstsc')(server,io.of("/r_dpX"));
        require(szSSP + '/p2pchat').fnInit(io.of("/pChat"));
    },
    onLog:function(s)
    {
        console.log(s);
    }
});

```js

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