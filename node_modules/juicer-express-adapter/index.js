var juicer = require('juicer');
var fs = require('fs');
var path = require('path');
var crypto = require('crypto');
var LRUCache = require('lru-cache');
var cache = LRUCache({
    max: 1000,
    maxAge: 1000 * 60 * 60 * 24
});

var _cacheset = cache.set;
var _cacheget = cache.get;
var _cachehas = cache.has;

var noop = function () {
    return false;
};

var cacheset = cache.set = function (key, value, maxAge) {
    key = crypto.createHash('md5').update(key).digest('hex');
    return _cacheset.call(cache, key, value, maxAge);
};

var cacheget = cache.get = function (key) {
    key = crypto.createHash('md5').update(key).digest('hex');
    return _cacheget.call(cache, key);
};

var cachehas = cache.has = function (key) {
    key = crypto.createHash('md5').update(key).digest('hex');
    return _cachehas.call(cache, key);
};

// disabled auto strip
juicer.set('strip', false);
juicer.set('cache', true);
juicer.set('cachestore', cache);

module.exports = function(tplPath, options, fn) {
    var deep = function(data, scope, _tmp) {
        _tmp = data;
        scope = scope.replace(/\[([^\]]+)\]/igm, '.$1');
        scope = scope.split('.');

        for(var i = 0; i < scope.length; i++) {
            scope[i] = scope[i].replace(/["']/igm, '');
            if(scope[i] === '_') {
                continue;
            }

            _tmp = _tmp[scope[i]];
        }
        return _tmp;
    };

    var includeFileDetect = function(tplPath, str, opts) {
        var includeWithoutRender = juicer.tags.operationOpen + 'include\\s*([^}]*?)\\s*' + juicer.tags.operationClose;
        juicer.settings.includeWithoutRender = new RegExp(includeWithoutRender, 'igm');

        str = str.replace(juicer.settings.include, function($, tpl, data) {
            try {
                if(tpl.match(/^file\:\/\//igm)) {
                    tpl = tpl.substr(7);

                    var _tplPath = path.resolve(path.dirname(tplPath), tpl);

                    if(!cache.has(_tplPath)) {
                        tpl = fs.readFileSync(_tplPath, 'utf8');
                        cache.set(_tplPath, tpl);
                    } else {
                        tpl = cache.get(_tplPath);
                    }

                    data === '_' ? data = options : data = deep(options, data);
                    return juicer(includeFileDetect(_tplPath, tpl, opts), data, opts);
                }

                return $;
            } catch(e) {
                console.error('includeFileDetect Error: %s', e.message);
            }
        });

        str = str.replace(juicer.settings.includeWithoutRender, function($, tpl) {
            try {
                if(tpl.match(/^file\:\/\//igm)) {
                    tpl = tpl.substr(7);
                    var _tplPath = path.resolve(path.dirname(tplPath), tpl);
                    tpl = fs.readFileSync(_tplPath, 'utf8');
                    return includeFileDetect(_tplPath, tpl, opts);
                }

                return $;
            } catch(e) {
                console.error('includeFileDetect Error: %s', e.message);
            }
        });

        return str;
    };

    var callback = function(err, str, tplPath) {
        if (err) {
            return fn(err);
        }

        str = juicer(str, options);
        str = includeFileDetect(tplPath, str);
        fn(null, str);
    };

    if(cache.has(tplPath)) {
        return callback(null, cache.get(tplPath), tplPath);
    }

    fs.readFile(tplPath, 'utf8', function(err, str) {
        if(!err) {
            cache.set(tplPath, str);
        }

        callback(err, str, tplPath);
    });
};

// export API for cache
module.exports.cacheOff = function () {
    juicer.set('cache', false);
    cache.set = cache.get = cache.has = noop;
};

module.exports.cacheOn = function () {
    juicer.set('cache', true);
    cache.set = cacheset;
    cache.get = cacheget;
    cache.has = cachehas;
};
