// 图片不存在时显示的默认图片
const defaultTypes = ['class'];
const defaultImg = (type) => {
    switch (type) {
        default:
            return 'https://gok-static.obs.cn-east-2.myhuaweicloud.com/portal/images/error/default.png';
    }
}
/**debugger
 * 判断一个图片地址是否真实存在此图片
 * @param {String} url 图片地址
 * @returns Promise
 */
const imgIsExist = function (url) {
    return new Promise((r, j) => {
        const img = new Image();
        img.onload = function () { if (this.complete == true) r(url) }
        img.onerror = function () { r('https://gok-static.obs.cn-east-2.myhuaweicloud.com/portal/images/error/img-error.png') }
        img.src = url;
    })
}

/**
 * 设置元素图片
 * @param {Object} el 元素
 * @param {String} url 图片地址
 * @param {Boolean} child 是否检查子元素，只有父节点不是图片的情况下才检测子元素的img标签
 */
const setDomImg = function (el, url, child) {
    const tagName = el.tagName;
    const elChild = el.querySelector('images');
    // 如果是图片标签
    if (tagName === 'IMG') {
        el.setAttribute('src', url);
    } else {
        if (child && elChild) {
            elChild.setAttribute('src', url);
            return
        }
        // 不是图片标签
        el.style.backgroundImage = `url(${url})`;
        el.style.backgroundRepeat = 'no-repeat';
        el.style.backgroundSize = 'contain';
        el.style.backgroundPosition = 'center center';
    }
}

const imageErr = {
    inserted: (el, binding, vnode) => {
        const url = binding.value;
        const modifiers = binding.modifiers;
        let type = '';
        for (const key in modifiers) defaultTypes.includes(key) && (type = key);
        if (!url) {
            setDomImg(el, defaultImg(type), modifiers.child);
            return
        }
        imgIsExist(url).then(res => {
            setDomImg(el, res || defaultImg(type), modifiers.child);
        })
    },
    update: (el, binding, vnode) => {
        const url = binding.value;
        const modifiers = binding.modifiers;
        let type = '';
        for (const key in modifiers) defaultTypes.includes(key) && (type = key);
        if (!url) {
            setDomImg(el, defaultImg(type), modifiers.child);
            return
        }
        imgIsExist(url).then(res => {
            setDomImg(el, res || defaultImg(type), modifiers.child);
        })
    }
}
