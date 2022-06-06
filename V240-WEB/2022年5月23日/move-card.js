import one from '@/one-builder';
import KB from '@/api/KB.API.js';
import {onBeforeMount, ref} from '@vue/composition-api';

const useHttp = function (courseId) {
  // eslint-disable-next-line no-unused-vars
  const list = ref([]);
  onBeforeMount(async () => {
    const result = await one.uc.http.post(KB.getChapterListToCourseId, {data: {courseId: courseId}});
    list.value = result.data;
  });
  return list;
};

const useCollapse = function ($store) {
  const collapseIndex = ref([]);
  const calculateClassNumObj = ref({});
  const selectedList = ref([]); // 选中的节 的 ids

  const clickSection = function (id, chapterId) {
    const flag = event.target.checked;
    $store.commit('classCourse/chooseChapterId', {value: id});
    if (flag) {
      // 选中
      selectedList.value.push(id);
      if (!calculateClassNumObj.value.hasOwnProperty(chapterId)) {
        calculateClassNumObj.value[chapterId] = [];
      }
      calculateClassNumObj.value[chapterId].push(id);
    } else {
      // 非选中
      const index = selectedList.value.indexOf(id);
      selectedList.value.splice(index, 1);
      // eslint-disable-next-line camelcase
      const index_s = calculateClassNumObj.value[chapterId].indexOf(id);
      calculateClassNumObj.value[chapterId].splice(index_s, 1);
    }
  };
  return {
    collapseIndex,
    calculateClassNumObj,
    clickSection
  };
};

// 阿拉伯数字转中文数字
// eslint-disable-next-line camelcase
function Arabia_To_SimplifiedChinese(Num) {
  for (let i = Num.length - 1; i >= 0; i--) {
    Num = Num.replace(',', ''); // 替换Num中的','
    Num = Num.replace(' ', ''); // 替换Num中的空格
  }
  if (isNaN(Num)) { // 验证输入的字符是否为数字
    // alert("请检查小写金额是否正确");
    return false;
  }
  // 字符处理完毕后开始转换，采用前后两部分分别转换
  const part = String(Num).split('.');
  let newchar = '';
  // 小数点前进行转化
  for (let i = part[0].length - 1; i >= 0; i--) {
    if (part[0].length > 10) {
      // alert("位数过大，无法计算");
      return '';
    }
    // 若数量超过拾亿单位，提示
    let tmpnewchar = '';
    const perchar = part[0].charAt(i);
    switch (perchar) {
      case '0':
        tmpnewchar = '零' + tmpnewchar;
        break;
      case '1':
        tmpnewchar = '一' + tmpnewchar;
        break;
      case '2':
        tmpnewchar = '二' + tmpnewchar;
        break;
      case '3':
        tmpnewchar = '三' + tmpnewchar;
        break;
      case '4':
        tmpnewchar = '四' + tmpnewchar;
        break;
      case '5':
        tmpnewchar = '五' + tmpnewchar;
        break;
      case '6':
        tmpnewchar = '六' + tmpnewchar;
        break;
      case '7':
        tmpnewchar = '七' + tmpnewchar;
        break;
      case '8':
        tmpnewchar = '八' + tmpnewchar;
        break;
      case '9':
        tmpnewchar = '九' + tmpnewchar;
        break;
    }
    const tmpnewcharTwo = tmpnewchar;
    switch (part[0].length - i - 1) {
      case 0:
        tmpnewchar = tmpnewcharTwo;
        break;
      case 1:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '十';
        break;
      case 2:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '百';
        break;
      case 3:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '千';
        break;
      case 4:
        tmpnewchar = tmpnewchar + '万';
        break;
      case 5:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '十';
        break;
      case 6:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '百';
        break;
      case 7:
        if (perchar !== 0) tmpnewchar = tmpnewchar + '千';
        break;
      case 8:
        tmpnewchar = tmpnewchar + '亿';
        break;
      case 9:
        tmpnewchar = tmpnewchar + '十';
        break;
    }
    newchar = tmpnewchar + newchar;
  }
  // 替换所有无用汉字，直到没有此类无用的数字为止
  while (newchar.search('零零') !== -1 || newchar.search('零亿') !== -1 || newchar.search('亿万') !== -1 || newchar.search('零万') !== -1) {
    newchar = newchar.replace('零亿', '亿');
    newchar = newchar.replace('亿万', '亿');
    newchar = newchar.replace('零万', '万');
    newchar = newchar.replace('零零', '零');
  }
  // 替换以“一十”开头的，为“十”
  if (newchar.indexOf('一十') === 0) {
    newchar = newchar.substr(1);
  }
  // 替换以“零”结尾的，为“”
  if (newchar.lastIndexOf('零') === newchar.length - 1) {
    newchar = newchar.substr(0, newchar.length - 1);
  }
  return newchar;
}

const ICON = {
  triangleDownIcon: 'https://gok-static.goktech.cn/edu/images/public/triangle-down.svg',
  triangleTopIcon: 'https://gok-static.goktech.cn/edu/images/public/triangle-up.svg',
};
export {
  ICON,
  useHttp,
  useCollapse,
  // eslint-disable-next-line camelcase
  Arabia_To_SimplifiedChinese,
};
