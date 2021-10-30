var fs = require('fs'),
    szPath = __dirname + "/static/js/", 
    szPathC = __dirname + "/static/css/", 
    aFCache = {};

function fnWc()
{
    var a = [szPath,szPathC];
    for(var i = 0; i < a.length; i++)
    fs.watch(a[i], { encoding: 'buffer' }, (eventType, filename) => 
    {
        
        var sF = filename.toString();
        if(fs.existsSync(szPath + sF))sF = szPath + sF;
        else sF = szPathC + sF;
        if (sF && "change" == eventType)
        {
            var szT = fs.readFileSync(sF).toString("utf-8");
            aFCache[sF] = szT;
        }
    });
}

function fnMerg(s,t)
{
    var a = s.split(/[,;\| ]/),i = 0,b = [],sF,szPathT = (t && "css" == t) ? szPathC : szPath, szHz;
    if(t == "css")szHz = ".css";
    else szHz = ".js";
    for(; i < a.length; i++)
    {
        if(fs.existsSync(sF = szPathT + a[i] + szHz))
        {
            var szT = aFCache[sF] || fs.readFileSync(sF).toString("utf-8");
            aFCache[sF] = szT;
            b.push(szT);
        }
    }
    return b.join("\n");
}

// var reRes = /\/(js|css)\/([^.]+)$/;
function fnDoMg(req,res,next,reRes)
{
    var a = reRes.exec(req.url),t = a[1],tp = "js" == t? "javascript":"css";
    if(!(/[,;\|]/g.test(req.url)))return next();
    
    res.setHeader('content-type', 'text/' + tp);
    res.end(fnMerg(a[2],t));
}
function fnSetPath(s)
{
    if(s)
    szPath = s + "js/", 
    szPathC = s + "css/";
}

module.exports = {fnDoMg:fnDoMg,fnSetPath:fnSetPath,fnWc:fnWc};