import React from 'react';
import { Row, Col, Card, Button, notification, Select,Divider,Table,Modal,Form,Input,InputNumber,Radio,Popconfirm,message,Tag} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios/index';
import { FeeTabs } from './feeTabs';
import  Elderlys  from './elderlys'
import  Cost  from '@/common/costDetail'
import {host} from '@/axios/config'

const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;
class SettleAccounts extends React.Component {
    state={
        fee:{},
        activeKey:'nursingFee',
        count:0, //计算费用
        computed:0,
        collection:[],//付款项
        ids:{},
        visible:false,
        record:{},
        pageTxt:'在院',
        elderlyInfo:{},
        costFlag:false,
        sumMoney:{}
    };
    param={};
    componentWillMount(){
    	const pageTxt=(this.props.location.pathname.indexOf('settleAccounts')>-1)?'在院':'出院';
    	this.setState({pageTxt})
 
//      if(data){
//         this.setState({pageTxt,elderlyInfo:data,elderSelected:data.id});
//         this.elderlyId = data.id;
//      }else{
//         const { history } = this.props;
//        // history.replace('/app/pension-agency/financial/settleAccounts') 
//      }
        
    }
    componentDidMount(){
        const {customerId, account}= this.props.auth;
        this.urlObj = {
            urlLists:{
                nursingFee:'listNursingAndCheckItem',
                mealFee:'listMealFeeList',
                waterFee:'listWaterRecoder',
                roomFee:'listRoomFeeList',
                drugFee:'listDrugFeeList'
            },
            urlSaves:{
                nursingFee:'settlementNursingItem',
                mealFee:'saveSettlementMealFee',
                waterFee:'saveSettlementWaterFee',
                roomFee:'saveSettlementRoomFee',
                drugFee:'saveSettlementDrugFee'
            }
        }
        this.customerId = customerId;
        this.param = {account,customerId};
        this.fetchSysParams('creditList');
        this.fetchElderlyInfo()
        this.fetchSumMoney()
       
    }
    componentWillUnmount(){
    	this.setState=(state,cb)=>{
    		return 
    	}
    }
    fetchSysParams(t){
    	const type = t==="creditList"?12:2;
        httpServer.listParam({ type}).then(res => {
            this.param[t]= res.data||[];
        })
    }
     
    fetchElderlyInfo(){
        const { activeKey, fee, elderSelected } = this.state;
        const url = this.urlObj.urlLists[activeKey] ;
        httpServer[url]({ elderlyId:this.elderlyId}).then(res => {
            res.code === 200 ? this.setState({
                fee: { ...fee ,[activeKey]: {list:res.data ? res.data: {data:[]}, elderly:elderSelected, param:this.param}}
            }) : this.notice('error', res.msg) ;
            
        })
    }
    notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }
     
    onBillSubmitHandler = (data,t) => {
        if(data.money){
        	let  {count,ids} = this.state;
	    	let type = '';
	    	switch(t){
	    		case '1': type = 'nursingIds'; break;
	    		case '2': type = 'mealIds'; break;
	    		case '3': type = 'waterIds'; break;
	    		case '4': type = 'roomIds'; break;
	    	}
	    	if(!ids[type]){
	    		ids[type]=data.data?data.data.map(i=>(i.id)).join(','):'';
	    	}
	        count += data.money; 
	        this.setState({count})
        }
    };
    onTabChangeHandler = (activeKey) => {
        const {fee } = this.state;
        this.setState({activeKey},() => {
            !fee[activeKey] && this.fetchElderlyInfo();
        });
    };
    
    add=()=>{ 
        this.setState({visible:true,record:{}});   
    }
    
    fetchSumMoney=()=>{
    	httpServer.getMoneyInfo({elderlyId:this.elderlyId}).then(res=>{
    	    if(res.code===200){
    	        this.setState({sumMoney:res.data||{}})	
    	    }else{
    	    	message.error('获取账户预交出错，请不要用预交结算');
    	    }
    	     
    	})
    }
    handleOk=()=>{
    	this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
    	   if(!err){
    	   	   let {collection,sumMoney} = this.state;
    	   	   if(fieldsValue.type==="6"||fieldsValue.type==="7"){
    	   	   	  if(fieldsValue.money>sumMoney['je'+fieldsValue.type]){
    	   	   	  	 message.error('预交金额不足，请选择其他方式');
    	   	   	  	 return;
    	   	   	  }else{
    	   	   	  	 fieldsValue.flag =fieldsValue.type;
    	   	   	  }
    	   	   	  
    	   	   }
    	   	   const index = collection.findIndex(i=>(i.type===fieldsValue.type));
    	   	   if(index>-1){
    	   	   	   collection.splice(index,1,{...fieldsValue})
    	   	   }else{
    	   	   	   collection.push(fieldsValue)
    	   	   }
    	       let money = collection.map(i=>(i.money)).reduce((t,n)=>(t+n));
    	   	   this.setState({collection,computed:money,visible:false})   
    	   }
    	})
    }
    handleCancel=()=>{
    	this.setState({visible:false});
    }
    handleModify=(r)=>{
    	  this.setState({visible:true,record:r});
    }
    handleRowDelete(id){
       this.setState(state=>{
       	   const index = state.collection.findIndex(i=>(i.id===id));
    	   state.collection.splice(index,1);
    	   return {...state}
       })
    }
    
    handleSubmit=()=>{
    	const {collection,ids,count,computed} = this.state;
    	if(!count){
    		message.error('没有要结算费用');
    		return false;
    	}
    	
    	if(computed!==count){
    		message.error('收款金额不对，请核对');
    		return false;
    	}
    	
    	if(collection.length===0){
    		message.error('没有付款记录,无法进行结算');
    		return false;
    	}
    	
    	const { name,customerId } = this.props.auth;
    	 
    	var values = {
    		...ids,
    		tbPayMoneyDetailInfo: collection,
    		elderlyId:this.elderlyId,
    		payee:name,
    		sumMoney:computed,
    		customerId:customerId
    	}
    	let request = new Request(host.api+'/saveSettlementWaterFee', {
	        body: JSON.stringify(values),
	        method: 'POST',
	        headers: new Headers({
	          'Content-Type': 'application/json;charset=utf-8'
	        })
	      });
          fetch(request).then(resp => resp.json()).then( res => {
            if(res.code === 200) {
				this.setState({costId:res.data.uuidCode})
					this.notice('success', res.msg);
			} else {
					this.notice('error', res.msg);
			}
		   const { history } = this.props;
           history.replace('/app/pension-agency/financial/settleAccounts') 
          }).catch(err => { console.log(err) });
 
    }
    
    showCost=()=>{
        this.setState({costFlag:true})	
    }
    
    close =()=>{
    	this.setState({costFlag:false})	
    }
    
    changeElderly=(r)=>{
    	console.log(r)
    	this.elderlyId = r.id;
        this.setState({elderlyInfo:r,elderSelected:r.id},()=>{
         	this.fetchSysParams('creditList');
            this.fetchElderlyInfo()
            this.fetchSumMoney()
        })
    }
    render() {
        const {elderlyInfo, fee, elderSelected, pageTxt,collection,record,sumMoney} = this.state;
        const { account }= this.props.auth;
        const creditList = this.param.creditList;
      
        const columns=[{
			title: '序号',
			render: (text, record, index) => `${index+1}`,
			width: '5%',
			key:'index'
		},{
        	title:'付款方式',
        	dataIndex:'type',
        	width:'10%',
        	render:(t,r)=>{
        		 switch(t){
        		 	case '1': return "现金";
        		 	case '2': return "支付宝"
        		 	case '3': return "微信"
        		 	case '4': return "刷卡"
        		 	case '5': return "转账"
        		 	case '6': return "住院预交"
        		 	case '7': return "其他预交"
        		 }
        	}
        },{
        	title:'金额',
        	dataIndex:'money',
        	width:'10%'
        },{
        	title:'账号',
        	dataIndex:'account',
        	width:'10%'
        },{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			width: '8%',
			render: (text, record) => {
				return(
					<span>
			            <a href="javascript:;" onClick={() => { this.handleModify(record) }} style={{color:'#2ebc2e'}}>修改</a>
			              <Divider type="vertical" />
			              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id)}>
			                <a href="javascript:;" style={{color:'#2ebc2e'}}>删除</a>
			              </Popconfirm>
			          </span>
				)
			},
		}]
        const formItemLayout = {
			labelCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 6
				},
			},
			wrapperCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 18
				},
			},
		};
		const {
			getFieldDecorator,
		} = this.props.form;
		
		
        return (
            <div>
                <BreadcrumbCustom first="财务管理" second={`${pageTxt}结算`} />
                <Card bordered={false} style={{marginBottom:10}}>
	                <Row gutter={16}>
	                  <Col md={20}>
	                   {elderlyInfo.id?
	                    <span>
	                             姓名:&emsp; <Tag color="magenta">{elderlyInfo.name}</Tag>
	                           性别:&emsp;<Tag color="#108ee9">{elderlyInfo.sex===1?'男':'女'}</Tag>&emsp;&emsp;
	                          	年龄:&emsp;<Tag color="orange" >{elderlyInfo.age}</Tag>岁&emsp;&emsp;
	                           	生日:&emsp;<Tag color="blue">{elderlyInfo.birthday.split(' ')[0]}</Tag>&emsp;&emsp;
	                               房间:&emsp;<Tag color="cyan">{elderlyInfo.roomName}</Tag>
	                               
	                    </span>:null
	                    }</Col>
	                  <Col md={4}>
	                    <Elderlys onChange={this.changeElderly} launchFlag={pageTxt==="在院"?"0":"1"}/>
	                  </Col>                
	                </Row>
	            </Card>
                <Card  bordered={false} style={{marginBottom:10}} title="费用明细">
                    <Row className="mb-s">
                        <FeeTabs
                            key={this.elderlyId}
                            data={fee}
                            selected={elderSelected}
                            onBillSubmit={this.onBillSubmitHandler}
                            onTabChange={this.onTabChangeHandler}
                        />
                    </Row>
                </Card>
                <Card title="结算明细">
                    <Row gutter={16}>
                       <Col xs={24} sm={6}>
                         <Card title="费用统计">
                           <h3> 结算老人: <span className="ml-m"><Tag color="magenta">{elderlyInfo.name}</Tag></span></h3>
                           <h3> 应收费用 : <span className="ml-m">{this.state.count}元</span></h3>
                           <h3> 收 款 人 : <span className="ml-m">{account}</span></h3>
                         </Card>  
                       </Col>
                       <Col xs={24} sm={18}>
                          <Table 
                          bordered
                          columns={columns} 
                          rowKey='type' 
                          dataSource={collection} 
                          pagination={{ pageSize: 50 }} 
                          scroll={{ y: 240 }}   
                          footer={() =><div>合计:{this.state.computed}元<Button className="pull-right tb-footer-text" type="primary" size="small" onClick={this.showCost}>历史记录</Button><Button className="pull-right tb-footer-text" type="primary" size="small" onClick={this.handleSubmit}>提交</Button><Button className="pull-right tb-footer-text" size="small" type="primary" onClick={this.add}>付款</Button></div>}
                          />
                       </Col>
                    </Row> 
                     
                </Card>
                <Modal
		          title="付款清单"
		          key ={this.state.visible}
		          visible={this.state.visible}
		          onOk={this.handleOk}
		          onCancel={this.handleCancel}
		          
		        > 
		          <Form>
				        <Form.Item
				            label='付款方式'
			                {...formItemLayout}
			                style={{marginBottom:'4px'}}
				        >
				          {getFieldDecorator('type', {
				            rules: [{ required: true, message: '请选择付款方式' }],
				            initialValue:record.type||"1"
				          })(
				             <RadioGroup  buttonStyle="solid">
				                <Radio.Button value="1">现金</Radio.Button>
						        <Radio.Button value="2">支付宝</Radio.Button>
						        <Radio.Button value="3">微信</Radio.Button>
						        <Radio.Button value="4">刷卡</Radio.Button>
						        <Radio.Button value="5">转账</Radio.Button>
						        <Radio.Button value="6">住院预交</Radio.Button>
						        <Radio.Button value="7">其他预交</Radio.Button>
						      </RadioGroup>
				          )}
				        </Form.Item>
				        <Form.Item
				            label='付款金额'
			                {...formItemLayout}
			                style={{marginBottom:'4px'}} 
				        >
				          {getFieldDecorator('money', {
				            rules: [{ required: true, message: '请输入付款金额' }],
				            initialValue:record.money
				          })(
				            <InputNumber min={1} style={{width:'100%'}}/>
				          )}
				        </Form.Item>
				         <Form.Item
				            label='收款账号'
			                {...formItemLayout}
			                style={{marginBottom:'4px'}} 
				        >
				          {getFieldDecorator('account', {
				            rules: [{ required: false, message: 'Please input your account' }],
				            initialValue:record.account
				          })(
				              <Select>
				                 {creditList&&creditList.map(i=>(<Option key={i.id} value={i.value}>{i.value}</Option>))}
				              </Select>
				          )}
				        </Form.Item>
				      </Form>
		        </Modal> 
		        {this.state.costFlag?<Cost visible={this.state.costFlag} elderlyInfo={elderlyInfo} close={this.close} sumMoney={sumMoney} />:null}
            </div>
        )
    }
}
    
export default Form.create()(SettleAccounts);