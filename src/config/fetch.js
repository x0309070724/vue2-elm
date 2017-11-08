import {
  baseUrl
} from './env'

export default async (url = '', data = {}, type = 'GET', method = 'fetch') => {
  type = type.toUpperCase();
  url = baseUrl + url;
  // console.log(data);
  // console.log(url);
  if (type === 'GET') {
    let dataStr = ''; //数据拼接字符串
    Object.keys(data).forEach(key => {
      dataStr += key + '=' + data[key] + '&';
    });

    if (dataStr !== '') {
      dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'));
      url = url + '?' + dataStr;
    }
  }
  if (window.fetch && method === 'fetch') {
    // console.log(111);
    let requestConfig = {
      // 请求带上cookie，使每次请求保持会话一致
      credentials: 'include',
      method: type,
      headers: {
        // Accept就表示接口要返回给客户端的数据格式，Content-Type表示客户端发送给服务器端的数据格式。
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      // cors: 该模式支持跨域请求，顾名思义它是以CORS（跨域资源共享Cross-origin resource sharing）的形式跨域
      mode: "cors",
      // 表示fetch请求不顾一切的依赖缓存, 即使缓存过期了, 它依然从缓存中读取. 除非没有任何缓存, 那么它将发送一个正常的request.
      cache: "force-cache"
    };

    if (type === 'POST') {
      // 请求体可以由传入body参数来进行设置
      Object.defineProperty(requestConfig, 'body', {
        value: JSON.stringify(data)
      })
    }

    try {
      console.log(url, requestConfig);
      const response = await fetch(url, requestConfig);
      // console.log(response);
      // 返回一个被解析为JSON格式的promise对象，这可以是任何可以由JSON表示的东西 - 一个object，一个array，一个string，一个number...
      const responseJson = await response.json();
      console.log(responseJson);
      return responseJson
    } catch (error) {
      throw new Error(error)
    }
  } else {
    console.log(222);
    return new Promise((resolve, reject) => {
      let requestObj;
      if (window.XMLHttpRequest) {
        requestObj = new XMLHttpRequest();
      } else {
        requestObj = new ActiveXObject;
      }

      let sendData = '';
      if (type == 'POST') {
        sendData = JSON.stringify(data);
      }

      requestObj.open(type, url, true);
      requestObj.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
      requestObj.send(sendData);

      requestObj.onreadystatechange = () => {
        if (requestObj.readyState == 4) {
          if (requestObj.status == 200) {
            let obj = requestObj.response
            if (typeof obj !== 'object') {
              obj = JSON.parse(obj);
            }
            resolve(obj)
          } else {
            reject(requestObj)
          }
        }
      }
    })
  }
}
