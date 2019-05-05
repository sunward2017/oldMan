import React , { Component , Fragment } from 'react';
import { notification, Button, Row, Col, Tag, Card,Form,List,Input,Avatar,InputNumber,Radio} from 'antd'
import httpServer from '../../../axios/index';
import BreadcrumbCustom from '../../BreadcrumbCustom';

const { TextArea } = Input;
class SysGlobalVariable extends Component{
  constructor(props){
    super(props);
    this.state = {
      customerName:'',
      id:'',
      record:{},
    };
    this.handleClickSubmit = this.handleClickSubmit.bind(this);
    this.handleClickCancle = this.handleClickCancle.bind(this);
  }
  componentDidMount(){
    const {customerName} = this.props.auth.tbCustomerInfo;
    this.setState({customerName});
    this.getSysGlobalVariables();
  }

  getSysGlobalVariables(){
    const {customerId} = this.props.auth;
    httpServer.getSysGlobalVariables({customerId}).then((res)=>{
      if(res.code === 200){
        res.data?this.setState({id:res.data.id,record:res.data}):this.setState({id:'',record:{}});
      }else{
        const args = {
          message: '通信失败',
          description: res.msg,
          duration: 2,
        };
        notification.error(args);
      }
    }).catch((error)=>{
      console.log(error);
    });
  }

  handleInputNumberChange(value,info){
    const reg = /^[1-9]\d*$/;
    if(value && reg.test(value)){
      const record = Object.assign({},this.state.record);
      record[info] = value;
      this.setState({record});
    }else{
      if(!value){
        const record = Object.assign({},this.state.record);
        record[info] = null;
        this.setState({record});
      }else{
        const args = {
          message: '友情提示',
          description: '请输入正整数',
          duration: 2,
        };
        notification.info(args);
      }  
    }
  }

  handleInputChange(info,e){
    const record = Object.assign({},this.state.record);
    record[info] = e.target ? e.target.value : e;
    this.setState({record});
  }
  handleClickSubmit(){
    const { id ,record} =this.state
    const {customerId} = this.props.auth;
    httpServer.updateSysGlobalVariables({customerId,id,v1:500,...record}).then((res)=>{
      if(res.code === 200){
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
      }else{
        const args = {
          message: '通信失败',
          description: res.msg,
          duration: 2,
        };
        notification.error(args);
      }
    }).catch((error)=>{
      console.log(error);
    });
  }

  handleClickCancle(){
    this.getSysGlobalVariables();
  }
  render(){
    const {customerName} = this.state;
    const {v1,v2,v3,v4,v5,v6,v7} = this.state.record;
    return(
      <Fragment>
        <BreadcrumbCustom first="系统设置" second="系统全局变量" />
        <Row style={{marginBottom:20}}>
          <Col style={{backgroundColor:"#fff",fontSize:"16px",padding:"20px"}}>
            当前客户名称：<Tag color="green">{customerName}</Tag>
          </Col>
        </Row>
        <Row>
          <Card 
            title="系统全局变量配置"
          >
            <List
              itemLayout="horizontal"
            >
              <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon="star" />}
                    title={<span>药品库存小于多少进行告警</span>}
                    description={<InputNumber min={0} style={{width:"100%"}} value={v1} onChange={(value)=>{this.handleInputNumberChange(value,'v1')}}/>}
                  />
              </List.Item>
              <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon="star" />}
                    title={<span>老人预交金额不足 多少 时提醒 </span>}
                    description={<InputNumber min={0} style={{width:"100%"}}  value={v7} onChange={(value)=>{this.handleInputNumberChange(value,'v7')}}/>}
                  />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon="star" />}
                  title={<span>水表读数异常 </span>}
                  description={<InputNumber style={{width:"100%"}} value={v3} onChange={(value)=>{this.handleInputNumberChange(value,'v3')}}/>}
                />
              </List.Item>
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon="star" />}
                  title={<span>电表读数异常 </span>}
                  description={<InputNumber style={{width:"100%"}} value={v4} onChange={(value)=>{this.handleInputNumberChange(value,'v4')}}/>}
                />
              </List.Item>
              <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon="star" />}
                    title={<span>请假到期未归提醒短信发送到护理人员(可以多个手机号，手机号直接用英文类型的逗号‘,’隔开) </span>}
                    description={<TextArea  rows={4}  value={v6} onChange={(e)=>{this.handleInputChange('v6',e)}}/>}
                  />
              </List.Item>
              <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon="star" />}
                    title={<span>请假到期未归是否提醒 </span>}
                    description={<Radio.Group  buttonStyle="solid"  value={v5} onChange={(e)=>{this.handleInputChange('v5',e)}}>
                                    <Radio.Button value="1">是</Radio.Button>
                                    <Radio.Button value="0">否</Radio.Button>
                                  </Radio.Group>}
                  />
              </List.Item>
              <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon="star" />}
                    title={<span>缺药是否发送短信告警 </span>}
                    description={ <Radio.Group  buttonStyle="solid"  value={v2} onChange={(e)=>{this.handleInputChange('v2',e)}}>
                                    <Radio.Button value="1">是</Radio.Button>
                                    <Radio.Button value="0">否</Radio.Button>
                                  </Radio.Group>}
                  />
              </List.Item>
              <List.Item>
                  <span style={{position:'relative',left:'50%'}}>
                    <Button type="primary" onClick={this.handleClickSubmit} style={{marginRight:20}}>提交</Button>
                    <Button type="primary" onClick={this.handleClickCancle} >取消</Button>
                  </span>
              </List.Item>
            </List>
          </Card>
        </Row>
        
      </Fragment>
    )
  }
}

export default SysGlobalVariable;