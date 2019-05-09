// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = (event, context) => {
	const wxContext = cloud.getWXContext()
	let id = event.id,recordDate = event.recordDate,accountGroup = event.accountGroup
	/*if(id){//修改

	}else{//新增*/
		db.collection('account_water').add({
	        data: {
	          openid: wxContext.OPENID,
	          createDate: new Date(),
	          recordDate:recordDate
	          // accountGroup:accountGroup
	        }
	    }).then(res => {
	    	return event
	    })
	    
	// }
  /*return {
  	dafa,
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }*/
}