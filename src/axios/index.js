import { post } from './tools';
import urls from './config';

// 访问获取
let obj = {};
Object.keys(urls).forEach(item => {
    obj[item] = (data, headers) => {
        return new Promise((resolve, reject) => {
            post({url: urls[item], data, headers}, (resData) => {
                resolve(resData);
            })
        })
    }
});
export default obj;