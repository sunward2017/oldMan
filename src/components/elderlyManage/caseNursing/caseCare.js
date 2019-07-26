import React,{Component,Fragment} from 'react';
//import Ueditor from '../../../common/ueditor';
import ReactQuill from 'react-quill';
import {Button,notification,Form,Input,Row,Col,DatePicker,Popconfirm} from 'antd';
import httpServer from '../../../axios';
import moment from 'moment';
import 'react-quill/dist/quill.snow.css'; // ES6

class CaseCare extends Component{
  constructor(props){
    super(props);
  }
 
  handleSubmit=(e)=>{//审核
  	e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
    	if(!err){
    		 let values = {...fieldsValue,
    		 	               optDate:fieldsValue['optDate']?fieldsValue['optDate'].format('YYYY-MM-DD HH:mm:ss'):'',
    		 	               optDate2:fieldsValue['optDate2']?fieldsValue['optDate2'].format('YYYY-MM-DD HH:mm:ss'):''
    		                };
    		  const { id }= this.props.work              
    		  if(id){
    		  	values.id =id;
    		  }
    		  this.props.saveCasePlan('work',values)             
    	}
    }) 
  }
  render(){
    const {content,nursingDept,optDate,officeDept,optDate2,familyConfirm} = this.props.work;
    
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
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
    return(
      <Fragment>     
        <Form hideRequiredMark >
          <Row gutter={16}>
            <Col md={16}>
               <Form.Item label="个案工作计划(跟进目标及方法)">
				          {getFieldDecorator('content', { rules: [{required: false, message: '请输入工作内容',}],initialValue:content||'' })
				           ( <ReactQuill  style={{minHeight:'70vh'}}/>)
				           }
				       </Form.Item>
	          </Col>
	          <Col md={8}>
	              <Form.Item
	                label='护理部主任签名'
	                {...formItemLayout}
	                style={{marginBottom:'10px'}}
	              > 
	               {getFieldDecorator('nursingDept', { rules: [{required: false, message: '',}],initialValue:nursingDept })
	                (<Input/>)
	               } 
	              </Form.Item>
	              <Form.Item
	                label='完成日期'
	                {...formItemLayout}
	                style={{marginBottom:'10px'}}
	              >
	              {getFieldDecorator('optDate', { rules: [{required: false, message: '',}],initialValue:optDate?moment(optDate):moment() })
	                ( <DatePicker format='YYYY-MM-DD HH:mm:ss'/>)
	              }   
	              </Form.Item>
	              <Form.Item
	                label='评估小组负责人'
	                {...formItemLayout}
	                style={{marginBottom:'10px'}}
	              >
	               {getFieldDecorator('officeDept', { rules: [{required: false, message: '',}],initialValue:officeDept})
	                (<Input/>)
	               }   
	              </Form.Item>
	              <Form.Item
	                label='日期'
	                {...formItemLayout}
	                style={{marginBottom:'10px'}}
	              >
		              {getFieldDecorator('optDate2', { rules: [{required: false, message: '',}],initialValue:optDate2?moment(optDate2):moment()})
		                ( <DatePicker format='YYYY-MM-DD HH:mm:ss'/>)
		              } 
		            </Form.Item>  
	              <Form.Item
	                label='家属确认'
	                {...formItemLayout}
	                style={{marginBottom:'10px'}}
	              >
	                {getFieldDecorator('familyConfirm', { rules: [{required: false, message: '',}],initialValue:familyConfirm })
	                  (<Input/>)
	                }   
	              </Form.Item>
	              <Form.Item {...tailFormItemLayout}>
	                <Button type="primary" onClick={this.handleSubmit}   style={{marginTop:15}}>提交保存</Button>
	              </Form.Item>
              </Col>
            </Row>
          </Form>
      </Fragment>
    )
  }
}

export default Form.create()(CaseCare);