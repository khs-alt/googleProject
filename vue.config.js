const { defineConfig } = require("@vue/cli-service");
const fs = require("fs"); // fs 모듈을 불러옵니다.

module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: "/label/",
  devServer: {
    //   https: {
    //     key: fs.readFileSync('localhost-key.pem'), // 개인 키 파일 경로
    //     cert: fs.readFileSync('localhost.pem'), // 인증서 파일 경로
    //   },
    //port: 8080, // HTTPS 서버 포트 설정
    https: {
      key: fs.readFileSync("./key.pem"),
      cert: fs.readFileSync("./cert.pem"),
      ca: fs.readFileSync("./rootca.crt"),
    },
    // proxy: {
    //   "/label/api/": {
    //     target: "http://localhost:8000", // 백엔드 서버 주소
    //     //  changeOrigin: true,
    //   },
    // },
  },
});
