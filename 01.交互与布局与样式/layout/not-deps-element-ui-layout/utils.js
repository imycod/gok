const isExternal = (path) => {
  return /^(https?:|mailto:|tel:)/.test(path);
};

// 是否是http开头
const isHttp = (path) => {
  return /^http/.test(path);
}

// 是否是png jpg gif结尾
const isImg = (path) => {
  return /\.(png|jpg|jpeg|svg|gif)$/.test(path);
}
