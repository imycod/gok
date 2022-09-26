let str='/src/components/esals/demo1.vue'

str.replace(/\/components(.)\/*.vue/g, '')

console.log(str);
console.log(str.replace(/\/components(.)\/\*\.vue/g, ''));
console.log(str);