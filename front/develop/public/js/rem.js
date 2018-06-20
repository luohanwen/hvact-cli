(function(win) {
    var doc = win.document, docEl = doc.documentElement, dpr = 1, tid;

    docEl.setAttribute('data-dpr', dpr);

    function refreshRem(){
        var width = docEl.getBoundingClientRect().width;
        if (width / dpr > 750) {
            width = 750 * dpr;
        }
        var rem = width / 10;
        docEl.style.fontSize = rem + 'px';
        win.rem = rem;
        fixRem();
    }

    win.addEventListener('resize', function() {
        clearTimeout(tid);
        tid = setTimeout(refreshRem, 300);
    }, false);

    refreshRem();


    if (doc.readyState === 'complete') {
        fixRem();
    } else {
        doc.addEventListener('DOMContentLoaded', function(e) {
            fixRem();
        }, false);
    }

    function fixRem(){
        //修正华为安卓1rem计算不准确的bug
        if(!doc.body) return;
        var ele = doc.createElement('div'), w;
        ele.style.cssText = 'position: fixed;left: -1rem;top: 0;width: 1rem;height: 1px';
        doc.body.appendChild(ele);
        w = ele.getBoundingClientRect().width;
        if(w != win.rem){
            var rem = Math.round(win.rem/w*win.rem);
            docEl.style.fontSize = rem + 'px';
            win.rem = rem;
        }
        doc.body.removeChild(ele);
    }

})(window);