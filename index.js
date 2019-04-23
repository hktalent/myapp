process.setMaxListeners(500);
var fs = require('fs'),
    // https://www.npmjs.com/package/spdy
    spdy = require('spdy'),
    express = require('express'),
    app = express(),
    expresslimiter = require('express-limiter'),
    webStaticPath = __dirname + "/static/",
    mergeRes = require('./mergeRes'),
    // browserify = require('browserify-middleware'),
    os = require('os'),
    szCurPath = __dirname + "/",
    uuid  = require('node-uuid'),
    EventEmitter = require('events').EventEmitter,
    inherits = require('util').inherits,
    juicer = require("juicer"),
    useragent = require('useragent'),
    // yum install redis;systemctl start redis.service;systemctl status redis.service
    // apt install redis;service redis-server start
    // brew install redis;brew services restart redis
    client = require('redis').createClient(),
    nMaxConn = 20,
    // https://github.com/helmetjs/csp, standalone module: helmet-csp
    helmet = require('helmet'),
    // session = require('express-session'),
    expressOptions = require('./expressOptions'),
    compression = require('compression'),
    path = require('path'),
    bUseHttps = false,
    // 白名单host
    wtHosts = [],
    redisAdapter = require('socket.io-redis'),
    credentials = {};
function myapp(option)
{
    var _t = this;
    fnOnLog = option.onLog || function(s)
    {
        _t.emit('log',s,_t);
    };
    var fnElog = option.onError || function(e)
    {
        _t.emit('error',e,_t);
    };
    process.on('uncaughtException', fnElog);
    process.on('unhandledRejection', fnElog);
    szCurPath = (option.serverRootPath || __dirname);
    nMaxConn = option.singleIpMaxConnect || 20;
    webStaticPath = (option.webStaticPath || webStaticPath);
    var key = option.caKey || szCurPath + '/../ca/domain.key',
        cert = option.caCert || szCurPath + '/../ca/chained.pem';
    bUseHttps = option.useHttps || false;

    wtHosts = option.wtHosts || ["127.0.0.1"];
    if(option.useHttps && fs.existsSync(key) && fs.existsSync(cert))
    {
        if(bUseHttps = true)
        {
            credentials = {
                "key": fs.readFileSync(key, 'utf8'),
                "cert": fs.readFileSync(cert, 'utf8')}
        }
    }
    else bUseHttps = false;
    
    mergeRes.fnSetPath(webStaticPath);
    mergeRes.fnWc();
    // cache静态资源等时间，这个对性能影响很大，缓冲客户端后，在设置等时间范围内、刷新不再请求
    expressOptions.maxAge = '31536000s';//'3600s';
    // gzip压缩数据
    app.use(compression({
        "level":9,
        "memLevel":9,
        // "strategy":// 
        "filter":function(req,res)
        {
            var s = String(res && res.getHeader('Content-Type') || "");
            if(-1 < s.indexOf("text/"))
            {
                return true;
            }
            return compression.filter(req, res);
        }
    }));
    if(bUseHttps)app.use(helmet({directives:{upgradeInsecureRequests:bUseHttps}}));
    app.use(helmet.referrerPolicy({policy:'no-referrer'}));
    app.use(helmet({
        // contentSecurityPolicy:true,// 与directives冲突
        frameguard:true
    }));
    app.disable('x-powered-by');

    // app.use(express.limit('4M')),app.use(express.bodyParser());
    // app.use(bodyParser.json({limit: '150mb'}));
    // app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    //     limit: '150mb',
    //     extended: true
    // })); 
    // app.use(express.json());app.use(express.urlencoded());

    // 检查user-agent，避免工具、攻击，不合法的ua拒绝访问
    function fnCheckUa(req,res)
    {
        // if(true)return true;
    // console.log(req.headers);
    // console.log('IP:' + [String(req.connection.remoteAddress),req.headers['user-agent']].join(', '));
    // 记录访问者信息
    var obj = {
        "ip":/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/g.exec(String(req.connection.remoteAddress))[1],
        "user-agent": req.headers['user-agent'],
        href:req.href
    };
    fs.appendFile("db/" + obj.ip,JSON.stringify(obj),function(){});
    
    var ua = useragent.is(req.headers['user-agent'] || ""), 
        bFlg = req.headers['user-agent'] == 'acme-tiny' || ua.opera || ua.webkit || ua.ie || ua.chrome || ua.safari || ua.mobile_safari || ua.firefox || ua.mozilla || ua.android;

    var fnFh = function(h1)
    {
        return h1 == req.headers['host'];
    };
    if(bFlg && wtHosts.find(fnFh))return true;
    fnOnLog(ua)
    fnOnLog('close:' + [String(req.connection.remoteAddress),req.headers['user-agent']].join(', '));
    req.connection.destroy();
    return false;
    }

    // 避免js转义
    juicer.set({
        'script': false,
        'strip': false,
        'cache': false
    });

    var reRes = /\/(js|css)\/(.*)$/;
    app.get(reRes,function(req,res,next)
    {
        mergeRes.fnDoMg(req,res,next,reRes);
    })

    // app.use('/stunLists.js', browserify(['fs',{'./readstunlist.js':{run: true,precompile:true,minify:true,gzip:true,debug:false}}]));
    // apt-get install coturn
    // yum install coturn
    // /etc/turnserver.conf
    app.use(function(req, res, next)
    {
        // console.log(req.url);
        if(bUseHttps)
        {
            if(!res.locals.nonce)res.locals.nonce = uuid.v4();
        }
        if(fnCheckUa(req,res))next();// else next();
    });

    // https://www.npmjs.com/package/express-session
    if(bUseHttps)app.set('trust proxy', 1),fnOnLog("open https SSL");

    // app.use(session(
    // {
    //     "secret" : 'secret',
    //     resave: false,
    //     secure:true,
    //     saveUninitialized: true,
    //     "httpOnly": true,
    //     "name" : 'x',
    //     genid:function(req)
    //     {
    //     return uuid.v4();
    //     }
    // }));
    // 并发限制
    var limiter = expresslimiter(app, client);
    limiter({
        path: '*',// "post"
        method: 'all',
        lookup: ['connection.remoteAddress'],
        // 本机访问不受并发限制
        whitelist:function (req) 
        {
            var eRg = /^(127\.0\.0\.1|192\.168\.|localhost|172\.17\.0\.[1-10]).*/g,s = String(req.connection.remoteAddress),
                eGetIp = /(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/gmi;
            s = eGetIp.exec(s) || '';
            if(s)s = s[1];
            return !!eRg.exec(s);
        },
        onRateLimited: function (req, res, next)
        {
            req.connection.destroy();
            // next({ message: '客户端1分钟内只允许并发连接' + nMaxConn, status: nCd });// 429
        },
        // 150 requests per hour
        total: nMaxConn,
        skipHeaders: false,
        expire: 1000 * 60 * 60
    });
    // Content-Type: application/csp-report
    app.post("/rptv",function(req,res)
    {
        // if(req.body)
        // {
        //     console.log(req.body);
        // }
        //   res.status(204).end();
        res.end();
    });

    var szSSP = webStaticPath;
    // app.set('view engine', 'html');
    // app.engine('html', function(path, options, fn){
    //     // console.log(options);
    // 	fs.readFile(path, 'utf8', function(err, str){
    // 		if (err) return fn(err);
    // 		str = juicer(str, options);
    // 		fn(null, str);
    // 	});
    // });
    app.get('/', function(req, res){
        res.sendFile(path.join(path.join(szSSP, 'index.html')));
    });
    if(option.cbkApp)option.cbkApp(app);

    var server = null;
    if(bUseHttps)server = spdy.createServer(credentials,app);// require('https').createServer(credentials,app);
    else server = require('http').createServer(app);
    // 不能加，否则rdp不正常：, { serveClient: false }
    var io = require('socket.io').listen(server, {
        // path:'/x',// 如果设置了需要修改相关静态的路径
        secure: bUseHttps,
        autoConnect:true});
    // https://github.com/muaz-khan/WebRTC-Experiment/blob/master/socketio-over-nodejs/signaler.js
    // 不能加下面代码，否则报错
    // io.set('transports', [
    // // 'websocket',
    // 'xhr-polling',
    // 'jsonp-polling'
    // ]);

    // 集群下用同一个redis
    io.adapter(redisAdapter(option.redisAdapter|| { host: 'localhost', port: 6379 }));
    var szSsh = [],aSsh = {},oNoRpt = {};
    var fnGetSsh = function(k)
    {
        client.get(k,function(e,r)
        {
            r = JSON.parse(r);
            szSsh.push(r.id);
            var szK = [r.host,r.port,r.username].join("_");
            if(oNoRpt[szK])
            {
                console.log("del :");
                // console.log(r);
                client.del(r.id,function(e,r1)
                {
                    // console.log(r1);
                });
                return;
            }
            else aSsh[r.id] = r;
            oNoRpt[szK] = r;
        });
    }
    global.aSsh = aSsh;
    global.oNoRpt = oNoRpt;
    client.keys('*', function (err, keys)
    {
        if (err) return console.log(err);
        for(var i = 0, len = keys.length; i < len; i++)
        {
            if(0 == keys[i].indexOf("ssh"))
            {
                fnGetSsh(keys[i]);
            }
        }
    });

    //*/ 实际上这里等数据只发送当前连接等客户端一次，因此是可以直接关闭等
    // .of("/ss_h")
    var ss_h = io.of("/ss_h");
    ss_h.on('connection', function(ioClt)
    {
        if(0 < szSsh.length)
        {
            // 权限控制好了才开通
            // ioClt.emit("onSsh",szSsh);
            console.log(szSsh);
        }
        // 接受客户端ip，特征等信息
        ioClt.on("pks",function(s)
        {
            // console.log(s)
        });
        ioClt.disconnect = function(b) {
            console.log("no Close: " + b);
        }
    });
    if(option.cbk4ServerAppIo)option.cbk4AppIo(server,app,io);
    
    app.use(express.static(szSSP, expressOptions));

    // 拦截关闭404
    app.use("*",function(req, res, next)
    {
        // if(err)
        console.log("destroy: " + req.url)
        req.connection.destroy();
        // else next();
    })
    var nPort = option.port || 3000;
    fnOnLog("start port " + nPort);
    server.listen(nPort);
}
inherits(myapp, EventEmitter);
module.exports = myapp;