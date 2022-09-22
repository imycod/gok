/* PLEASE DO NOT COPY AND PASTE THIS CODE. */
(function() {
    var w = window,
        C = '___grecaptcha_cfg',
        cfg = w[C] = w[C] || {},
        N = 'grecaptcha';
    var gr = w[N] = w[N] || {};
    gr.ready = gr.ready || function(f) {
        (cfg['fns'] = cfg['fns'] || []).push(f);
    };
    w['__recaptcha_api'] = 'https://www.recaptcha.net/recaptcha/api2/';
    (cfg['render'] = cfg['render'] || []).push('6LedP6MZAAAAAJ5Il5RtcbYl_m1csdSvmAh_P566');
    w['__google_recaptcha_client'] = true;
    var d = document,
        po = d.createElement('script');
    po.type = 'text/javascript';
    po.async = true;
    po.src = 'https://www.gstatic.cn/recaptcha/releases/zmiYzsHi8INTJBWt2QZC9aM5/recaptcha__zh_cn.js';
    po.crossOrigin = 'anonymous';
    po.integrity = 'sha384-sETsUJiNEVvqx4LsEimFnMtu6++VfxXGlQqJQNrjJCJn1F+upBeAyVm1DwO6RZap';
    var e = d.querySelector('script[nonce]'),
        n = e && (e['nonce'] || e.getAttribute('nonce'));
    if (n) {
        po.setAttribute('nonce', n);
    }
    var s = d.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(po, s);
})();