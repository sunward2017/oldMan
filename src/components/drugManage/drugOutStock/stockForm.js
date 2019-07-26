import React ,{ Component,Fragment } from 'react';
import {Modal , Table ,Form ,InputNumber, Input,Button,DatePicker,Select,Radio,notification,Divider,Popconfirm,message,Tag} from 'antd';
import httpServer from '@/axios';
import ElderlySelect from '@/common/elderlySelect'
import DrugForm from './drugForm'
import moment from 'moment';
import {host} from '@/axios/config'
import ImportDrug from '../drugInStock/drugListByElderly'
 
const RadioGroup = Radio.Group;
const confirm = Modal.confirm;

class editForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      receiptTypes:[],
      record:{},
      drugFlag:false,
      drugs:[],
      units:[],
      drugInfo:{},
      drugList:{}
    }
    this.elderlyId=props.infoData?props.infoData.elderlyId:'';
  }

  handleTypes=()=>{
  	 httpServer.listParam({type:14}).then(res=>{
  	 	 const data = res.data?res.data:[]
  	   this.setState({receiptTypes:data})
  	 })
  }
  handleAddDrug=()=>{
  	 if(!this.elderlyId){
  	 	message.error('请先选择老人');
  	 }else{
  	 	 this.setState({drugInfo:{},drugFlag:true})
  	 }
  }
  handleDrug=(drug)=>{
  	 let that = this;
  	 const {drugs} = this.state;
  	 const isExist = drugs.some(i=>(i.drugCode===drug.drugCode))
  	 if(isExist){
		const index = drugs.findIndex(i=>(i.drugCode===drug.drugCode))
		drugs.splice(index,1,drug);
		that.setState({drugs,drugFlag:false})
  	 }else{
  	 	drugs.push(drug);
  	 	this.setState({drugs,drugFlag:false})
  	 }
  }
  
  handleCancel=()=>{
  	this.props.cancle()
  }
  handleSubmit=()=>{
    let that = this;
    let {drugs}= this.state;
    
    if(drugs.length===0){
       message.error('您没有选择药品 无法保存');
    }else{
      this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
  		if(!err){
  		  const {account,customerId} = this.props.auth;
  		  drugs = drugs.map(i=>({...i,elderlyId:fieldsValue.elderlyId,customerId}))
  		        if(this.props.type==='audit'){
  		        	httpServer.saveDrugStockInfo({id:this.state.record.id,auditor:fieldsValue.auditor,auditTime:fieldsValue.auditTime.format('YYYY-MM-DD HH:mm:ss')}).then(res=>{
  		        	  if(res.code===200){
  		        	    const args = {
							message: '成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
  		        	  }else{
  		        	  	const args = {
							message:'失败',
							description: res.msg,
							duration: 2,
						};
						notification.error(args);
  		        	  }
  		        	  this.handleCancel();
  		        	})
  		        }else{
  		          let  values={...fieldsValue,'inOutTime':fieldsValue['inOutTime'].format('YYYY-MM-DD HH:mm:ss'),operator:account,customerId,type:2,tbDrugInOutDetails:drugs}
  		    
  		          if(this.state.record.id)values.id = this.state.record.id;
  		          
  		           const url= values.id?'updateDrugInAndOut':'saveDrugInAndOut', msg= values.id?'更新':'新增';
  		       
			      let request = new Request(host.api+"/"+url, {
				        body: JSON.stringify(values),
				        method: 'POST',
				        headers: new Headers({
			              'Content-Type': 'application/json;charset=utf-8'
			            })
			          });
			      fetch(request).then(resp => resp.json()).then( res => {
			      	 if(res.code===200){
						const args = {
							message: msg+'成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.handleCancel();
				       }
					})
                }
  		    }
  	    })	
    }
  	
  }
  cancel=()=>{
  	this.setState({drugFlag:false})
  }
  componentDidMount(){
  	this.handleTypes();
  	this.getUnitList();
  	this.getDrugList();
  	const {infoData} = this.props
  	this.setState({record:{...infoData},drugs:infoData.tbDrugInOutDetails||[]})
  }
  //获取单位列表
  getUnitList(){
    httpServer.listParam({type:1}).then((res)=>{
      if (res.code === 200) {
        res.data?this.setState({units:res.data}):this.setState({units:[]});
      } else {
        const args = {
          message: '通信失败',
          description: res.msg,
          duration: 2,
        };
        notification.error(args);
      }
    }).catch((err)=>{
      console.log(err);
    });
  }
  handleModify=(record)=>{
  	const drugList =this.state.drugList;
  	this.setState({drugInfo:{...record,drugCode:{minUnit:record.minUbit,drugCode:record.drugCode,name:drugList[record.drugCode]}},drugFlag:true})
  }
  handleDelete=(drug)=>{
  	 const {drugs} = this.state;
     const index = drugs.findIndex(i=>(i.drugCode===drug.drugCode))
		   drugs.splice(index,1);
		   this.setState({drugs,drugFlag:false}); 
  }
  getDrugList(){
  	const {customerId} = this.props.auth;
    httpServer.listDrugInfoInfo({customerId}).then(res => {
       if(res.data){
       	 let drugList={};
       	  res.data.forEach(item=>{
       	  	drugList[item.code]=item.name;
       	  })
       	  this.setState({drugList})
       }
    })  
  }
 
  elderlyChange=id=>{
  	 this.elderlyId = id;
  }
  importDrug=drugs=>{
  	this.setState(state=>{
  		state.drugs=drugs;
  		return state;
  	})
  }
  render(){
    const {
	      getFieldDecorator
		} = this.props.form;
    const {type} = this.props;		
	const {receiptTypes,drugs,drugFlag,units} = this.state; 
	const {inOutTime,elderlyId,receiptType,docNo,auditTime,auditor} = this.state.record;
	const columns=[{
	      title: '药品名称',
	      dataIndex: 'drugCode',
	      key: 'drugCode',
	      width:'15%',
	      render:(t,r)=>{
	      	const drugList = this.state.drugList;
	      	return drugList[t]?drugList[t]:t;
	      }
	    }, {
	      title: '数量',
	      dataIndex: 'quantity',
	      key: 'quantity',
	      align:'center',
	      width:'10%'
	    },{
	      title:'最小单位',
	      dataIndex:'minUbit',
	      key:'minUbit',
	      align:'center',
	      width:'8%',
	      render:(t,r)=>{
	      	return <Tag color="cyan">{t}</Tag>
	      }
	    },{
    	    title: '操作',
			dataIndex: 'action',
			key: 'action',
			width: '15%',
			align:'center',
			render: (text, record) => {
					return(
						type==="read"?null:
						<span>
			              <a href="javascript:;" onClick={() => { this.handleModify(record) }} style={{color:'#2ebc2e'}}>修改</a>
			              <Divider type="vertical" />
			              <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record)}>
			                <a href="javascript:;" style={{color:'#2ebc2e'}}>删除</a>
			              </Popconfirm>
			            </span>
					)
			}
        }];
	   
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
   
    return (
      <Modal
        title="药品出库单"
        width={800}
        visible={true}
        onCancel={this.handleCancel}
        footer={type==="read"?null:[<Button key="cancel" onClick={this.handleCancel}>取消</Button>,<Button key="sub" type="primary" onClick={this.handleSubmit}>提交</Button>]}
        maskClosable={false}
      >
        <Form hideRequiredMark onSubmit={this.handleSubmit}>
             <Form.Item
                label='老人'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                 {getFieldDecorator('elderlyId', {
                  rules: [{ required: true, message: '请选择老人'}],
                  initialValue:elderlyId
                })(
                   <ElderlySelect listStatus="3" onChange={this.elderlyChange} />
                )}
              </Form.Item>
              <Form.Item
                label='出库单号'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('docNo', {
                  rules: [{ required: false, message: '请输入单号'}],
                  initialValue:docNo
                })(
                    <Input placeholder="自动生成" disabled/>
                )}
              </Form.Item>
              <Form.Item
                label='出库类别'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('receiptType', {
                  rules: [{ required: true, message: '请选择类别'}],
                  initialValue:receiptType||receiptTypes[0]&&receiptTypes[0].value
                })(
                  <RadioGroup buttonStyle="solid" disabled={type==="audit"||type==="read"}>
					    {receiptTypes.map(i=>{
                		    return <Radio.Button value={i.value} key={i.id}>{i.value}</Radio.Button>
                	    })}
                  </RadioGroup>  
                )}
              </Form.Item>
              <Form.Item
                label='出库时间'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('inOutTime', {
                  rules: [{ required: true, message: '请选择出库时间'}],
                  initialValue:inOutTime?moment(inOutTime):moment()
                })(
                   <DatePicker showTime disabled={type==="audit"||type==="read"}/>
                )}
              </Form.Item>
              {type==='audit'||type==="read"?
	            <Fragment>
	              	<Form.Item
	                label='审核人'
	                {...formItemLayout}
	                style={{marginBottom:'4px'}}
	              >
	                {getFieldDecorator('auditor', {
	                  rules: [{ required: true, message: '请输入审核人'}],
	                })(
	                    <Input placeholder="审核人" disabled={type==='read'}/>
	                )}
	              </Form.Item>
	              	<Form.Item
	                label='审核日期'
	                {...formItemLayout}
	                style={{marginBottom:'4px'}}
	              >
	                {getFieldDecorator('auditTime', {
	                  rules: [{ required: true, message: '请选择审核时间'}],
	                  initialValue:moment(auditTime)||moment()
	                })(
	                   <DatePicker showTime disabled={type==="read"} />
	                )}
	              </Form.Item>
	            </Fragment>:null
              }
          </Form>
          <Table 
               size="middle"
	           columns={columns} 
	           dataSource={drugs} 
	           rowKey={record => record.drugCode}
	       />
	       {
	       	type==="audit"||type==="read"?null:
	       	  <span>
	            <Button icon="plus" onClick={this.handleAddDrug}></Button>
	            <ImportDrug elderlyId={this.elderlyId} importDrug={this.importDrug}/>
	          </span> 
	       }
	       {
	       	 drugFlag?<DrugForm handleDrug={this.handleDrug} elderlyId={this.elderlyId} units={units} cancel={this.cancel} drugInfo={this.state.drugInfo}/>:null
	       }
      </Modal>
    )
  }
}

export default Form.create()(editForm)