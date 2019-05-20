import React,{Fragment} from 'react';
import { Card, Input,Modal ,Button,Select, Form, Avatar, notification, Divider,Icon,Tag,DatePicker,Table} from 'antd';
import httpServer from '@/axios';
import moment from 'moment';

const { Meta } = Card;
const Option = Select.Option;

class Cost extends React.Component {
	state={
		data:{},
		userName:'',
		costType:{"1":"现金","2":"支付宝","4":"微信","3":"住院押金","5":"转账","6":"住院预交","7":"其他预交","8":"刷卡"},
		flag:'list',
		dataSource:[],
		uuidCode:'',
	}
    
    notice(status, msg) {
        notification[status]({
            message: `提示`,
            description:msg,
            duration:2,
        })
    }
    cancel=()=>{
    	this.props.close();
    }
    handleOk=()=>{
    	window.document.body.innerHTML= window.document.getElementById('cost').innerHTML; 
		window.print(); 
		window.location.reload();
    }
    componentDidMount(){
    	this.fetchSettlementInfo();
        const name = JSON.parse(sessionStorage.getItem("auth")).name;
    	this.setState({userName:name});
    }
    fetchSettlementInfo=()=>{
    	const {elderlyInfo} = this.props
    	httpServer.getSettlementInfo({elderlyId:elderlyInfo.id}).then(res=>{
    		if(res.code===200){
    		   this.setState({dataSource:res.data||[]})	
    		}else{
    		   this.notice('error', res.msg) 
    		}
    	})
    }
    fetchRecord=()=>{
    	const {uuidCode} = this.state; 
    	httpServer.getSettlementInfoPrint({uuidCode}).then(res=>{
    		if(res.code===200){
    		    this.setState({data:res.data?res.data[0]:{}});
    		}else{
    			this.notice('error', res.msg) 
    			this.setState({data:{}}) 
    		}
    		
    	})
    }
    rowClick=(r,t)=>{
    	this.setState({flag:'table',uuidCode:r.uuidCode},()=>{
    		this.fetchRecord();
    	})
    }
    render() {
        const {elderlyInfo,account,visible,sumMoney} = this.props;
        const { data,costType,flag ,dataSource} = this.state;
        const  {je1,je2,je3,je4,je5,je6,je7}= data.tbMoneyLibrary?data.tbMoneyLibrary:{je1:0,je2:0,je3:0,je4:0,je5:0,je6:0,je7:0};
        const total=data.tbPayMoneyDetailInfo?data.tbPayMoneyDetailInfo.reduce((p,c)=>{
        	return p+=c.money;
        },0):0;
        const columns = [{
        	    title: '序号',
				render: (text, record, index) => `${index+1}`,
				width: '5%',
				key:'index'
            },{
			  title: '结算单号',
			  dataIndex: 'settlementNum',
			},{
			  title: '老人姓名',
			  dataIndex: 'tbElderlyInfo',
			  render:(t,r)=>{
			  	return elderlyInfo.name
			  }
			}, {
			  title: '结算日期',
			  dataIndex: 'settlementDate',
			}, {
			  title: '结算金额',
			  dataIndex: 'sumMoney',
			},{
			  title: '收款人',
			  dataIndex: 'payee',
			}];
		let subJe6=0,subJe7=0; 	
	    if(data.tbPayMoneyDetailInfo&&data.tbPayMoneyDetailInfo.find(i=>(i.type===6))){
	    	subJe6=data.tbPayMoneyDetailInfo.find(i=>(i.type===6)).money;
	    }
	    if(data.tbPayMoneyDetailInfo&&data.tbPayMoneyDetailInfo.find(i=>(i.type===7))){
	    	subJe7=data.tbPayMoneyDetailInfo.find(i=>(i.type===7)).money
	    }
        return ( 
        	<Modal
		        title="费用清单"
		        okText='确认'
		        width="40%"
		        visible={visible}
		        onOk={this.handleOk}
		        onCancel={this.cancel}
		        maskClosable={false}
		        footer={flag==="list"?null:[
            <Button key="back" onClick={this.cancel}>取消</Button>,
            <Button key="submit" type="primary" onClick={this.handleOk}>
              打印
            </Button>,
          ]}
		      >
        	   {flag==="list"?
        	    <Table rowKey='id' columns={columns} dataSource={dataSource} onRow={(record,rowkey)=>({onClick:this.rowClick.bind(this,record,rowkey)})}/>
        	   :<div  id={"cost"}>
               <h2 style={{textAlign:'center'}}>欢乐之家养老院</h2> 
               <div><span>结算单号:&emsp;{data.settlementNum}</span></div>
               <div>老人姓名: &emsp;{elderlyInfo.name}&emsp;&emsp;房间:&emsp;{elderlyInfo.roomName}&emsp;&emsp;
               上月结余: &emsp;住院预交:&emsp;{je6?(je6+subJe6):subJe6}元&emsp;&emsp;其他预交:&emsp;{je7?(je7+subJe7):subJe7}元</div>
               <hr />
               <h3>基础收费项:</h3>
               <table border='1' cellSpacing="0" style={{width:'100%',textAlign:'center'}}>
                  <thead>
                  <tr>
                    <th>收费月份</th>
                    <th>收费项目</th>  
                    <th>基础金额</th>  
                    <th>天数</th>  
                    <th>请假天数</th>  
                    <th>减免</th>  
                    <th>应收</th>  
                  </tr>
                  </thead>
                  <tbody>
                   {data.tbBaseItemFee&&data.tbBaseItemFee.map(item=>(<tr key={item.itemName}>
                   	  <td>{item.endTime}</td>
                   	  <td>{item.itemName||'护理费'}</td>
                   	  <td>{item.nursingFee}</td>
                   	  <td>{item.inDays}</td>
                   	  <td>{item.outDays}</td>
                   	  <td>{item.returnMonry}</td>
                   	  <td>{item.money}</td>
                   </tr>))}
                  </tbody>
                </table>  
                <h3>水电费收费项:</h3>
                <table border='1' cellSpacing="0" style={{width:'100%',textAlign:'center'}}>
                  <thead>
                  <tr>
                    <th>收费月份</th>
                    <th>收费项目</th>  
                    <th>上次度数</th>  
                    <th>本次度数</th>  
                    <th>使用度数</th>  
                    <th>单价</th>  
                    <th>分担比例</th>
                    <th>应收</th>  
                  </tr>
                  </thead>
                  <tbody>
                    {
                    	data.tbElderlyUtilitiesInfo&&data.tbElderlyUtilitiesInfo.map(item=>(
                    	  <tr key={item.id+'u'}>
		                   	  <td>{item.year}-{item.month}</td>
		                   	  <td>{item.itemName}</td>
		                   	  <td>{item.lastValue}</td>
		                   	  <td>{item.curValue}</td>
		                   	  <td>{item.diffValue}</td>
		                   	  <td>{item.price}</td>
		                   	  <td>{item.percentage}</td>
		                   	  <td>{item.money}</td>
		                   </tr>	
                    	))
                    }
                  </tbody>
                </table>  
                <h3>其他收费项:</h3>
                <table border='1' cellSpacing="0" style={{width:'100%',textAlign:'center'}}>
                  <thead>
                  <tr>
                    <th>产生日期</th>
                    <th>收费项目</th>  
                    <th>基础金额</th>  
                    <th>单位(次/天)</th>
                    <th>应收</th>  
                  </tr>
                  </thead>
                  <tbody>
                    {
                    	data.tbNursingItemRecoder&&data.tbNursingItemRecoder.map(item=>(
                    		<tr key={item.id+'n'}>
                    	      <td>{item.endTime}</td>
		                   	  <td>{item.itemName}</td>
		                   	  <td>{item.price}</td>
		                   	  <td>{item.times}</td>
		                   	  <td>{item.money}</td>
		                   	</tr>  
                    	))
                    }
                  </tbody>
                </table>    
                  <hr />
                  <div style={{textAlign:'right',fontWeight:'bold'}}>合计:{total}元</div>
                  <hr />
                  <div style={{float:'left',fontWeight:'bold'}}>
                    <p>账户信息:</p>
                    <p>本次支付:&nbsp;¥{total}元</p>
                    <p>住院预交:&nbsp;¥{je6||0}元</p>
                    <p>其他结余:&nbsp;¥{je7||0}元</p>
                    <p>预约定金:&nbsp;¥{je1||0}元</p>
                    <p>
                      押&emsp;金:&emsp;热水器:&nbsp;¥{je2||0}元 
                     &emsp;医疗押金:&nbsp;¥{je3||0}元
                     &emsp;锁押金:&nbsp;¥{je4||0}元
                     </p>
                  </div>
                  <div style={{float:'right',fontWeight:'bold'}}>
                   <p>支付信息:</p>
                    {
                    	data.tbPayMoneyDetailInfo&&data.tbPayMoneyDetailInfo.map(m=>{
                    		return <p key={m.id}>{`${costType[m.type]}支付:¥${m.money}元`}</p>
                    	})
                    }
                    <p>结算日期:{data.settlementDate}</p>
                  </div>
                   <h3 style={{clear:'both',textAlign:'right'}}><p>开票人:&emsp;{this.state.userName}</p></h3>
                </div>}
            </Modal>    
        )
    }
}
export default Cost;