import React ,{ Component,Fragment } from 'react';
import {Modal,Table ,Form ,InputNumber, Input,Button,DatePicker,Select,Radio,notification,Divider,Popconfirm,message} from 'antd';
import httpServer from '@/axios';
import ElderlySelect from '@/common/elderlySelect'
import DrugForm from './drugForm'
import moment from 'moment'
import {host} from '@/axios/config'

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
  }

  handleTypes=()=>{
  	 const {customerId} = JSON.parse(sessionStorage.getItem('auth'));
  	 httpServer.listParam({type:14,customerId}).then(res=>{
  	 	 const data = res.data?res.data:[]
  	   this.setState({receiptTypes:data})
  	 })
  }
  handleAddDrug=()=>{
  	 if(!this.state.record.elderlyId){
  	 	message.error('请先选择老人');
  	 }else{
  	 	 this.setState({drugInfo:{},drugFlag:true})
  	 }
  	
  }
  handleDrug=(drug)=>{
  	 let that = this;
  	 const {drugs} = this.state;
  	 if(drug.id){
  	 	 const index = drugs.findIndex(i=>(i.drugCode===drug.drugCode))
		       drugs.splice(index,1,drug);
		       that.setState({drugs,drugFlag:false});
		return;       
  	 }
  	 const isExist = drugs.some(i=>(i.drugCode===drug.drugCode))
  	 if(isExist){
  	   confirm({
		    title: '警告',
		    content: '出库单中已存在相同的药品记录，你确定覆盖吗？',
		    onOk() {
		       const index = drugs.findIndex(i=>(i.drugCode===drug.drugCode))
		       drugs.splice(index,1,drug);
		       that.setState({drugs,drugFlag:false})
		    },
		    onCancel() {
		    	return;
		    },
		  });
  	 }else{
  	 	drugs.push(drug);
  	 	this.setState({drugs,drugFlag:false})
  	 }
  	 
  }
  
  handleCancel=()=>{
  	this.props.cancle()
  }
  elderlyChange=(v)=>{
  	const record = this.state.record;
  	record.elderlyId =v;
  	this.setState({record})
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
  		          let url=values.id?'updateDrugInAndOut':'saveDrugInAndOut',
  		            msg= values.id?'更新':'新增';
  		       
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
  	this.setState({drugInfo:{...record,drugCode:{drugCode:record.drugCode,drugName:drugList[record.drugCode]}},drugFlag:true})
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
  bringDrugUse=()=>{
  	const {customerId} = this.props.auth;
  	const {elderlyId} = this.state.record;
  	if(!elderlyId){
  	 	message.error('请先选择老人');
  	}else{
  		httpServer.listElderlyUseDrugInfo({customerId,elderlyId}).then(res=>{
  			if(res.code===200){
  				if(res.data){
  			    this.setState(state=>{
  			    	let drugs = state.drugs.slice();
  			    	const data = res.data?res.data.map(m=>({drugCode:m.drugCode,quantity:m.quantity,minUbit:m.tbDrugInfo?m.tbDrugInfo.minUnit:''})):[]
  			    	drugs = [...drugs,...data];
  			    	return{drugs} 
  			    })
  			    
  			   }else{
  			   	 message.error("没有该老人用药记录");
  			   }
  			}else{
  				message.error("导入发生错误");
  			}
  		})
  	}
  }
  
  render(){
    const {
			getFieldDecorator
		} = this.props.form;
    const {type} = this.props;		
	const {receiptTypes,drugs,drugFlag,units} = this.state; 
	const {inOutTime,elderlyId,receiptType,docNo} = this.state.record;
	const columns=[{
	      title: '药品名称',
	      dataIndex: 'drugCode',
	      key: 'drugCode',
	      render:(t,r)=>{
	      	const drugList = this.state.drugList;
	      	return drugList[t]?drugList[t]:t;
	      }
	    }, {
	      title: '出库数量',
	      dataIndex: 'quantity',
	      key: 'quantity',
	    },{
	      title:'最小单位',
	      dataIndex:'minUbit',
	      key:'minUbit',
	      width:'15%'
	    },{
    	    title: '操作',
			dataIndex: 'action',
			key: 'action',
			width: '15%',
			render: (text, record) => {
				if(type==='edit'){
					return(
						<span>
			              <a href="javascript:;" onClick={() => { this.handleModify(record) }} style={{color:'#2ebc2e'}}>修改</a>
			              <Divider type="vertical" />
			              <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record)}>
			                <a href="javascript:;" style={{color:'#2ebc2e'}}>删除</a>
			              </Popconfirm>
			            </span>
					)
				}
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
        title="药品出库"
        okText='提交'
        width="60%"
        visible={true}
        onOk={this.handleSubmit}
        onCancel={this.handleCancel}
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
                   <ElderlySelect listStatus="3" onChange={this.elderlyChange}/>
                )}
              </Form.Item>
              <Form.Item
                label='出库单号'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('docNo', {
                  rules: [{ required: false, message: '请输出单号'}],
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
                  initialValue:receiptType
                })(
                  <RadioGroup buttonStyle="solid" disabled={type==="audit"}>
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
                   <DatePicker showTime disabled={type==="audit"}/>
                )}
              </Form.Item>
              {type==='audit'?
	            <Fragment>
	              	<Form.Item
	                label='审核人'
	                {...formItemLayout}
	                style={{marginBottom:'4px'}}
	              >
	                {getFieldDecorator('auditor', {
	                  rules: [{ required: true, message: '请输出审核人'}],
	                })(
	                    <Input placeholder="审核人" />
	                )}
	              </Form.Item>
	              	<Form.Item
	                label='审核日期'
	                {...formItemLayout}
	                style={{marginBottom:'4px'}}
	              >
	                {getFieldDecorator('auditTime', {
	                  rules: [{ required: true, message: '请选择审核时间'}],
	                  initialValue:moment()
	                })(
	                   <DatePicker showTime />
	                )}
	              </Form.Item>
	            </Fragment>:null
              }
          </Form>
          <Table 
	           columns={columns} 
	           dataSource={drugs} 
	           rowKey={record => record.drugCode}
	       />
	       { type==="audit"?null:
	         <span>
		       	 <Button icon="plus" onClick={this.handleAddDrug}></Button>
		         <Button type="primary" onClick={this.bringDrugUse}>导入</Button>
	         </span>
	       }
	       
	       {
	       	 drugFlag?<DrugForm handleDrug={this.handleDrug} elderlyId={elderlyId}  units={units} cancel={this.cancel} drugInfo={this.state.drugInfo}/>:null
	       }
      </Modal>
    )
  }
}

export default Form.create()(editForm)