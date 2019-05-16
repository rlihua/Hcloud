// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
	const wxContext = cloud.getWXContext()
	let id = event.id,recordDate = event.recordDate,accountGroup = event.accountGroup
	if(id){//修改
		return await db.collection('account_water').where({
			_id: id
		}).update({
			createDate: new Date(),
			recordDate:new Date(recordDate),
			accountGroup:accountGroup
		})
	}else{//新增
		return await db.collection('account_water').add({
	        data: {
	          openid: wxContext.OPENID,
	          createDate: new Date(),
	          recordDate:new Date(recordDate),
	          accountGroup:accountGroup
	        }
	    })
	}
}