function lazy_throttle(fn, delay, atleast) {
    var timeout = null,
        startTime = new Date();
    return function() {
        var curTime = new Date();
        clearTimeout(timeout);
        if(curTime - startTime >= atleast) {
            fn();
            startTime = curTime;
        }else {
            timeout = setTimeout(fn, delay);
        }
    }
}
function lazyload() {
    var images = document.getElementsByTagName('img');
    var len    = images.length;
    var n      = 0;
    return function() {
        var seeHeight = document.documentElement.clientHeight;
        var scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        for(var i = n; i < len; i++) {
            if(images[i].offsetTop < seeHeight + scrollTop) {
                if(images[i].getAttribute('src') === 'img/loading.png') {
                    images[i].src = images[i].getAttribute('data-src');
                }
                n = n + 1;
            }
        }
    }
}
var loadImages = lazyload();
loadImages();
window.addEventListener('scroll', lazy_throttle(loadImages, 500, 1000), false);