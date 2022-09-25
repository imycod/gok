const { default: axios } = require('axios')
const chalk = require('chalk');
const log = console.log;
// chalk.level = 1;
const fs = require('fs');
// const { dirname } = require('path');
const path = './mapJson/'
const mapKeyValue = require('./mapCodeKeyValue.json')
const baseUrl = 'https://geo.datav.aliyun.com/areas_v3/bound/'
async function main() {
  try {
    log(chalk.blue('拼命执行中....'));
    const cityArr = Object.keys(mapKeyValue).map(key=>{return{key:key, code:mapKeyValue[key]}})
    // 发起请求
    cityArr.forEach(async city=> {
      const mapRes = await axios.get(baseUrl + city.code + '_full.json')
      // log(chalk.green(`请求${city.key}成功....、\n`));
      const data = mapRes.data
      const json =  JSON.stringify(data);
    // 写入数据
    fs.writeFile(`${path}${city.code}.json`, json, (err) => {
      if (err) {
        console.error(`写入${city.key}数据失败`)
         throw err;
      }
      log(chalk.green(`写入${city.key}成功！ \n ${path}${city.code}.json\n`));
  });
    })
  } catch (error) {
    console.error('报错', error)
  }

}

main()
