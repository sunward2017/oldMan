import React , {Component , Fragment } from 'react';
import {Card,Input,Row,Col,Form,Button,notification} from 'antd';
import httpServer from '../../../axios';
const { TextArea } = Input;
class PersonInfo1 extends Component{
  constructor(props){
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);//提交健康和疾病情况评估数据
  }

  //提交健康和疾病情况评估数据
  handleSubmit = (e) => {
    e.preventDefault();
    let _this = this;
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
      if(!err) {
      	 let values ={...fieldsValue}
      	 const {id} = this.props.tbScheduledOne;
      	 if(id){
      	 	  values.id = id;
      	 }
         this.props.saveCasePlan('info',values)
      }
    });
  }
  render(){
    const {height1 , weight1 , medicalHistory } = this.props.tbScheduledOne;
    const {getFieldDecorator} = this.props.form;
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
    return(
      <Fragment>
        <Card title="健康和疾病情况评估" style={{ width: "100%" }}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item
              label='身高'
              {...formItemLayout}
              style={{marginBottom:'4px'}}
            >
              {getFieldDecorator('height1', {
                rules: [{ required: true, message: '请输入身高!' }],
                initialValue:height1,
              })(
                <Input/>
              )}
            </Form.Item>
            <Form.Item
              label='体重'
              {...formItemLayout}
              style={{marginBottom:'4px'}}
            >
              {getFieldDecorator('weight1', {
                rules: [{ required: false, message: '请输入体重'}],
                initialValue:weight1
              })(
                <Input />
              )}
            </Form.Item>
            <Form.Item
              label='病历'
              {...formItemLayout}
              style={{marginBottom:'4px'}}
            >
              {getFieldDecorator('medicalHistory', {
                rules: [{ required: false, message: '请输入病历'}],
                initialValue:medicalHistory
              })(
                <TextArea rows={4}/>
              )}
            </Form.Item>
            <Form.Item  wrapperCol={{ span: 16, offset: 8 }}>
              <Button type="primary" htmlType="submit">确认提交
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </Fragment>
    )
  }
}

const PersonInfo = Form.create()(PersonInfo1);
export default PersonInfo;