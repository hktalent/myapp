var juicerExpressAdapter = require('../index');

juicerExpressAdapter('test_html/parent_good.html', {}, function (error, str) {
    if (error) {
        console.log(error);
        return;
    }
    console.log(str);
});

juicerExpressAdapter('test_html/parent_bad.html', {}, function (error, str) {
    if (error) {
        console.log(error);
        return;
    }
    console.log(str);
});
