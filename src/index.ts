import { QMainWindow, QWidget, QLabel, FlexLayout } from "@nodegui/nodegui";
import request = require('request');
import cardConfig = require('./card.config')
async function flowsearch (cardno: string) {
  return new Promise((resolve, reject) => {
    request.get(`http://tskj.iot688.com/Api/flowsearch?cardno=${cardno}`, function (error: any, response: any, body: any) {
      // console.log('error:', error); // Print the error if one occurred
      // console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      // console.log('body:', body); // Print the HTML for the Google homepage.
      var res = JSON.parse(body || '')
      // console.log('res:', res.data)
      resolve(res.data)
    })
  })
}

async function usedflow (cardno: string) {
  return new Promise((resolve, reject) => {
    request.get(`http://tskj.iot688.com/Api/flowsearch?cardno=${cardno}`, function (error: any, response: any, body: any) {
      var res = JSON.parse(body || '')
      // console.log('res:', res)
      resolve(res.data)
    })
  })
}

async function getInfo () {
  let cardno: string, usedInfo: any, flowInfo: any
  cardno = cardConfig.cardno
  flowInfo = await flowsearch(cardno)
  // usedInfo = await usedflow(cardno)
  return `==========================================
卡号    ：${flowInfo.cardno}
ICCID   ：${flowInfo.iccid}
UserID  ：${flowInfo.user_id}
用户名  ：${flowInfo.real_name}
手机号  ：${flowInfo.mobile}
身份证号：${flowInfo.idcard}

套餐类型：${flowInfo.filed2}
首充时间：${flowInfo.shouchong_time}
到期时间：${flowInfo.expired_at}
剩余流量：${(parseFloat(flowInfo.surplus) / 1024).toFixed(2)} GB(${flowInfo.surplus.toFixed(2)} MB)
使用流量：${(parseFloat(flowInfo.used) / 1024).toFixed(2)} GB(${flowInfo.used.toFixed(2)} MB)
剩余百分比：${((flowInfo.surplus / (flowInfo.surplus + flowInfo.used)) * 100).toFixed(2)} %
最后更新时间： ${flowInfo.updated_at}
==========================================`
}

const win = new QMainWindow();
win.setWindowTitle("流量查询");

const centralWidget = new QWidget();
centralWidget.setObjectName("myroot");
const rootLayout = new FlexLayout();
centralWidget.setLayout(rootLayout);

const label = new QLabel();
label.setObjectName("mylabel");
async function updateInfo () {
  label.setText(await getInfo());
}

rootLayout.addWidget(label);
win.setCentralWidget(centralWidget);
win.setStyleSheet(
  `
    #myroot {
      background-color: #d4c281;
      height: '100%';
      align-items: 'center';
      justify-content: 'center';
    }
    #mylabel {
      font-size: 16px;
      font-weight: bold;
      padding: 1;
    }
  `
);
updateInfo().then(res => {
  win.show();
});
setInterval(function () { updateInfo(); }, 1000 * 30);

(global as any).win = win;
