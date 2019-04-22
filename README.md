# myapp_51pwn

## how use
```
npm install -g myapp_51pwn
```
## see example
```
node test.js
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