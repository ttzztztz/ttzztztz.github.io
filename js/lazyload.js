(function () {
    'use strict';
    function throttle(fn, delay, mustRunDelay) {
        var timer = null,
            last;
        return function () {
            var context = this,
                args = arguments,
                now = +new Date();
            if (last && (now - last) < mustRunDelay) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    fn.apply(context, args);
                    last = now;
                }, delay);
            } else {
                last = now;
                fn.apply(context, args);
            }
        }
    }
    function getViewPortHeight() {
        return window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight || 0;
    }
    function getScrollTop() {
        return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
    }
    function offsetTop(el) {
        if (el) {
            var t = el.offsetTop,
                p = el.offsetParent;
            while (p) {
                if (window.navigator.userAgent.indexOf('MSIE 8.0') === -1) {
                    t += p.clientTop;
                }
                t += p.offsetTop;
                p = p.offsetParent;
            }
            return t;
        }

    }
    function isElementInViewport(el, offset) {
        var h = offset || 20;
        var box = el.getBoundingClientRect();
        var top = (box.top >= 0),
            left = (box.left >= 0),
            bottom = (box.bottom <= (window.innerHeight || document.documentElement.clientHeight) + h),
            right = (box.right <= (window.innerWidth || document.documentElement.clientWidth) + h);
        return (top && left && bottom && right);
    }

    var count = 0,
        lazyImages = [],
        selector,
        lazyClass,
        offset;
    function LazyLoad(options) {
        options = options || {};
        selector = options.selector || 'm-lazyload';
        lazyClass = options.lazyClass || 'lazy-src';
        offset = options.offset || 0;

        this._init();
    }
    LazyLoad.prototype = {
        Constructor: LazyLoad,
        _init: function () {
            this._getLazyImages();
            this._lazyLoad();
            this._throttleLoad();
        },
        _getLazyImages: function () {
            var imgEles = document.querySelectorAll(selector);
            for (var j = 0; j < imgEles.length; j++) {
                if (typeof (imgEles[j].getAttribute(lazyClass))) {
                    lazyImages.push(imgEles[j]);
                    count++;
                }
            }
        },
        _lazyLoad: function () {
            if (!count) return;
            for (var i = 0; i < lazyImages.length; i++) {
                var lazyImg = lazyImages[i];
                /* var isInViewport = (offsetTop(lazyImg) - getScrollTop() - offset) < getViewPortHeight(); */
                if (isElementInViewport(lazyImg)) {
                    lazyImg.src = lazyImg.getAttribute(lazyClass);
                    lazyImg.removeAttribute(lazyClass);
                    lazyImages.splice(i, 1);
                    count--;
                }
            }
        },
        _throttleLoad: function () {
            window.onscroll = window.onresize = throttle(this._lazyLoad, 100, 200);
        }
    };

    window.LazyLoad = LazyLoad;
})();

window.onload = function () {
    new LazyLoad({
        selector: 'img',
        lazyClass: 'data-src',
        offset: 300
    });
};