# 使用阿里云服务进行车牌识别

## 导航
- [前端](#web-recognition)
- [后端](#server-recognition)

## web-recognition

前端，使用 React + ant design 构建。因配置跨域请求，所以请求接口地址为：`/api/getCarInfo` 。

#### 使用

```javascript
cd web-recognition
yarn install
npm run start   // localhost:3000
```

#### 描述



## server-recognition

后端，使用 `node.js` 调用[阿里云接口](https://market.aliyun.com/products/57124001/cmapi020094.html?spm=5176.730005-56956004.0.0.1b7a3524KT3X65#sku=yuncode1409400000),地址为：`http(s)://ocrcp.market.alicloudapi.com/rest/160601/ocr/ocr_vehicle_plate.json`。

#### 使用
```javascript
cd server-recognition
npm install
npm start // localhost:5000
```

#### 描述
使用 `express-generator` 生成项目。 


```javascript
"aliyun-api-gateway"  // 阿里云 sdk
"body-parser"   // 解析 `post` 请求
```

#### 接口

|路径|方法|参数|
| -- | -- | -- |
|/getCarInfo|post|image(base64)|