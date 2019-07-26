import React from 'react';
import { Row, Col, Card, Button, notification, Select,Divider,Table,Modal,Form,Input,InputNumber,Radio,Popconfirm,message,Tag,Avatar} from 'antd';
import httpServer,{fetchAll}from '@/axios/index'
import  Cost  from '@/common/costDetail'
import {host} from '@/axios/config'
import {costType} from "@/utils/constant"
import img from '@/style/imgs/timg.jpg'
import { BillInfo } from './billInfo';

const { Meta} = Card;
const Option = Select.Option;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

class SettleAccounts extends React.Component {
    state={
        fee:{},
        count:0, //计算费用
        computed:0,
        collection:[],//付款历史
        ids:{},
        visible:false,
        record:{},
        costFlag:false,
        creditList:[],
        costSet:{},
    }
    isLoading=true
    componentWillMount(){
        this.fetchSysParams();
    }
    componentDidMount(){
       const elderlyId = this.props.elderlyInfo.id;
       fetchAll(['/listNursingAndCheckItem','/listMealFeeList','/listWaterRecoder','/listRoomFeeList'],{elderlyId}).then((res)=>{
       	  if(res.some(r=>r.code!==200)){
       	  	 this.notice('error',"获取结算信息失败");
       	  }else{
       	  	this.setState({costSet:res.map(item=>item.data?item.data.data||[]:[])})
       	  }
       })
    }
    componentWillUnmount(){
    	this.setState=(state,cb)=>{
    		return 
    	}
    }
    fetchSysParams(){
        httpServer.listParam({ type:12}).then(res => {
           this.setState({creditList:res.data||[]})
        })
    }
    
    notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:5
        })
    }
     
    onBillSubmit = (data,t) => {
        	let  {ids} = this.state;
	    	let type = '',count=0;
	    	switch(t){
	    		case '1': type = 'nursingIds'; break;
	    		case '2': type = 'mealIds'; break;
	    		case '3': type = 'waterIds'; break;
	    		case '4': type = 'roomIds'; break;
	    	}
	    	if(data.length>0){
	    	   ids[type]={ids:data.map(i=>(i.id)).join(','),money:data.reduce((p,c)=>({money:p.money+c.money})).money}; 	
	    	}else{
	    	  ids[type]={ids:"",money:0}
	    	}
	        
	        for(var k in ids){
	        	count +=ids[k].money;
	        }
	        this.setState({count:Math.round(count)})
    };
    
    
    add=()=>{ 
        this.setState({visible:true,record:{}});   
    }
    
    handleOk=()=>{
    	this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
    	   if(!err){
    	   	   let {collection} = this.state;
    	   	   const {tbMoneyLibrary} = this.props.elderlyInfo;
    	   	   if(fieldsValue.type==="6"||fieldsValue.type==="7"||fieldsValue.type==="3"){
    	   	   	  if(!tbMoneyLibrary||!tbMoneyLibrary["je"+fieldsValue.type]||tbMoneyLibrary["je"+fieldsValue.type]<fieldsValue.money){
    	   	   	  	 message.error("余额不足，请选择其他付款方式");
    	   	   	  	 return false;
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
    	if(this.isLoading){
    		this.isLoading = false;
	    	const {collection,ids,count,computed,pageTxt} = this.state;
	    	const {elderlyInfo} = this.props;
	    	if(!count){
	    		message.error('没有要结算费用');
	    		this.isLoading = true;
	    		return false;
	    	}
	    	if(parseInt(computed)!==parseInt(count)){
	    		message.error('收款金额不对，请核对');
	    		this.isLoading = true; 
	    		return false;
	    	}
	    	const { name,customerId } = this.props.auth
	    	let keys={};
	    	for(var k in ids){
	    		keys[k] = ids[k].ids;
	    	}
	    	var values = {
	    		...keys,
	    		tbPayMoneyDetailInfo: collection,
	    		elderlyId:elderlyInfo.id,
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
	          	this.isLoading = true;
	            if(res.code === 200) {
					this.notice('success', res.msg);
					this.props.reback();
				} else {
				    this.notice('error', res.msg);
				}
	          }).catch(err => {this.isLoading=true});
        }
    }
    
    showCost=()=>{
        this.setState({costFlag:true})	
    }
    
    close =()=>{
    	this.setState({costFlag:false})	
    }
    renderCostType=()=>{
    	const arr =[];
    	for(var k in costType){
    	      arr.push(<Radio.Button value={k} key={k} >{costType[k]}</Radio.Button>)	
    	}
    	return  arr.map(i=>(i))
    }
    render() {
        const {elderlyInfo,auth} = this.props;
        const tbMoneyLibrary = elderlyInfo.tbMoneyLibrary||{};
        const { pageTxt,collection,record,count,creditList,costSet} = this.state;
        const columns=[{
			title: '序号',
			render: (text, record, index) => `${index+1}`,
			width: '5%',
			align:'center',
			key:'index'
		},{
        	title:'付款方式',
        	dataIndex:'type',
        	width:'10%',
        	render:(t,r)=>{
        		 return costType[t]||'';
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
					span: 4
				},
			},
			wrapperCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 20
				},
			},
		};
		const {
			getFieldDecorator,
			getFieldValue
		} = this.props.form;
		 const columnsN=[{
		        title:'结算日期',
		        dataIndex:'endTime',
		        render:(text,record)=>{
		            return  text.substr(0,10)
		        }
			    },{
			        title:'项目名称',
			        dataIndex:'itemName'
			    },{
			    	title:'金额',
			        dataIndex: 'money',
			    }];
			    const columnsM =[{
			        title: '月份',
			        dataIndex: 'month',
			    },{
			        title:'项目名称',
			        dataIndex:'itemName'
			    },{
			    	title:'天数',
			    	dataIndex:'inDay',
			    	align:'center',
			    },{
			        title:'费用/月',
			        dataIndex:'mealFee'
			    },{
			        title:'外出天数',
			        dataIndex:'outDays'
			    },{
			        title:'减免金额',
			        dataIndex:'returnMoney'
			    },{
			        title:'金额',
			        dataIndex:'money',
			        width:'12%'
			    }];
			    const columnsWC = [{
			        title: '月份',
			        dataIndex: 'month',
			    },{
			        title:'房间',
			        dataIndex:'roomName'
			    },{
			        title:'上次度数',
			        dataIndex:'lastValue'
			    },{
			        title:'本次度数',
			        dataIndex:'curValue'
			    },{
			        title:'抄表日期',
			        dataIndex:'regDate',
			        render:(t,r)=>{
			        	return t?t.substr(0,10):''
			        }
			    },{
			        title:'使用度数',
			        dataIndex:'diffValue',
			        align:'center',
			    },{
			       title:'类别',
			       dataIndex:'flag',
			       render:(text,record)=>{
			          return record.flag === 1? <Tag color="magenta">水表</Tag>:<Tag color="green">电表</Tag>  
			       }
			    },{
			        title:'单价',
			        dataIndex:'price'
			    },{
			        title:'分担比例',
			        dataIndex:'percentage'
			    },{
			        title:'应收金额',
			        dataIndex:'money',
			        width:'12%'
			    }];
			    const columnsR = [{
			        title: '月份',
			        dataIndex: 'month',
			    },{
			        title:'房间',
			        dataIndex:'roomName'
			    },{
			        title:'入住天数',
			        dataIndex:'days',
			        align:'center',
			    },{
			        title:'床位费/月',
			        dataIndex:'bedFee'
			    },{
			        title:'金额',
			        dataIndex:'money',
			        align:'center',
			        width:'12%'
			    }];
        return (
            <div>
               
	            <Row gutter={16}>
	              <Col sm={24} md={4}>
	                  <Card title="基础信息"
	                        extra={<Button type="primary" title="返回" icon="rollback" onClick={()=>this.props.reback()}></Button>}
			                cover={<img src={img}/>}>
						       <h4 className="mb-m">姓名:&emsp;<Tag color="magenta">{elderlyInfo.name}</Tag></h4>
			                   <h4  className="mb-m">入住日期:<Tag color="blue">{elderlyInfo.checkInDate.substr(0,10)}</Tag></h4>
			                   <h4  className="mb-m">房间号:<span className="ml-m"><Tag color="purple">{elderlyInfo.roomName}</Tag></span></h4>
			                   <h4  className="mb-m">费用合计: <span className="ml-s">{count}元</span></h4>
                               <h4  className="mb-m">收 款人 : <span className="ml-s"><Tag color="cyan">{auth.name}</Tag></span></h4>
			            </Card>
	              </Col>
	              <Col sm={24} md={20}>
	                    <Row gutter={16} className="mb-m">
		                   <Col sm={24} md={14}>
			                  <BillInfo  data={{dataSource:costSet[1], type:'2'}} columns={columnsM} onBillSubmit={this.onBillSubmit} title="餐费"/>
			                </Col>
				            <Col sm={24} md={10}>
			                  <BillInfo  data={{dataSource:costSet[0], type:'1'}} columns={columnsN} onBillSubmit={this.onBillSubmit} title="护理费"/>
			                </Col>
			            </Row>
			            <Row gutter={16} className="mb-m">
			                <Col sm={24} md={14}>
			                  <BillInfo  data={{dataSource:costSet[2], type:'3'}} columns={columnsWC} onBillSubmit={this.onBillSubmit} title="水电费" />
			                </Col>
			                <Col sm={24} md={10}>
			                   <BillInfo  data={{dataSource:costSet[3], type:'4'}} columns={columnsR} onBillSubmit={this.onBillSubmit} title="房费"/>
			                </Col>
		               </Row> 
		               <Table 
		                   size="small"
		                   columns={columns} 
		                   rowKey='type' 
		                   dataSource={collection} 
		                   pagination={{ pageSize: 50 }} 
		                  
		                   footer={() =><div className="white">
		                        	合计:{this.state.computed}元
		                            <Button className="pull-right tb-footer-text" type="primary" size="small" onClick={this.handleSubmit} disabled={this.state.collection.length===0} loading={!this.isLoading}>提交</Button>
		                            <Button className="pull-right tb-footer-text" size="small" type="primary" onClick={this.add} >付款</Button></div>}
		                     />  
	              </Col>
	            </Row>
	              
	              
                <Modal
		          title="付款清单"
		          key ={this.state.visible}
		          visible={this.state.visible}
		          onOk={this.handleOk}
		          onCancel={this.handleCancel}
		          width={800}
		        > 
		         <Row gutter={0}>
		           <Col span={6}>
		              <Card title="账户信息">
		                 <h4>住院预交:&emsp;<span className="blue">{tbMoneyLibrary.je6||0}元</span></h4>
		                 <h4>医疗押金:&emsp;<span className="blue">{tbMoneyLibrary.je3||0}元</span></h4>
		                 <h4>其他预交:&emsp;<span className="blue">{tbMoneyLibrary.je7||0}元</span></h4>
		              </Card>
		           </Col>
		           <Col span={18}>
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
				               
						         {
						            this.renderCostType()
						         }
						      </RadioGroup>
				          )}
				        </Form.Item>
				        <Form.Item
				            label='付款金额'
			                {...formItemLayout}
			                style={{marginBottom:'4px'}} 
				        >
				          {getFieldDecorator('money', {
				            rules: [{ required: true, message: '请输入付款金额'}],
				            initialValue:record.money
				          })(
				            <InputNumber placeholder="请输入金额" min={0} style={{width:'100%'}}/>
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
				              <Select placeholder="请选择收款账号">
				                 {creditList&&creditList.map(i=>(<Option key={i.id} value={i.value}>{i.value}</Option>))}
				              </Select>
				          )}
				        </Form.Item>
				      </Form> 
		           </Col>
		         </Row>
		          
		        </Modal> 
            </div>
        )
    }
}
    
export default Form.create()(SettleAccounts);