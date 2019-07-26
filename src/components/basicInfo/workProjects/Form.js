import React , {Component,Fragment} from 'react';
import {Form,Button,Input,Radio ,Select,notification} from 'antd';
import httpServer from '../../../axios';

const Option = Select.Option
class MineForm extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataList:props.record,
      itemNameList:[],
      status:props.record.status?JSON.parse(props.record.status):{},
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(){
    const {customerId,changeTabskeyToTab1,getNursingGradeWorks,action} = this.props;
    const data = this.state.dataList;
    const {status} = this.state;
    const {A01,A02,A03,A04} = this.state.status;
    const {itemType,itemName,timeLenght,repeatType} = this.state.dataList;
    data.customerId = customerId;
    const reg =/^[1-9]\d*$/;
    if(action === 'read'){
      changeTabskeyToTab1();
    }else{
       
      
      if(A01 || A02 || A03 || A04){
        data.status = JSON.stringify(status);
      }
      if(data.id){
        httpServer.updateWorkeItemSet(data,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
           if (res.code === 200) {
              const args = {
                message: '通信成功',
                description: res.msg,
                duration: 2,
              };
              notification.success(args);
              changeTabskeyToTab1();
              getNursingGradeWorks();
            } else {
              if(res.message ==='Request failed with status code 500'){
                  console.log(res.message);
               }else{
                   const args = {
                  message: '通信失败',
                  description: res.msg,
                  duration: 2,
                };
                notification.error(args);
               }
            }
        }).catch((err)=>{
          console.log(err);
        });
      }else{
        httpServer.saveWorkeItemSet(data,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
           if (res.code === 200) {
              const args = {
                message: '通信成功',
                description: res.msg,
                duration: 2,
              };
              notification.success(args);
              changeTabskeyToTab1();
              getNursingGradeWorks();
            } else {
              if(res.message ==='Request failed with status code 500'){
                  console.log(res.message);
               }else{
                   const args = {
                  message: '通信失败',
                  description: res.msg,
                  duration: 2,
                };
                notification.error(args);
               }
            }
        }).catch((err)=>{
          console.log(err);
        });
      }
    }
    
  }

  getItemNameList(){
    const {itemType} = this.state.dataList;
    const {customerId} = this.props;
    httpServer.listCheckItemChild({pid:itemType,customerId},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
      if (res.code === 200) {
        res.data?this.setState({itemNameList:res.data}):this.setState({itemNameList:[]});
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

  handleIptText(target,e) {
    let dataList = Object.assign({},this.state.dataList);
    dataList[target] = e.target ? e.target.value : e;
    if(target==="repeatType"){
      dataList["repeatDate"] ='';
      dataList["pointTime"] ='';
    }
    this.setState({dataList},()=>{
      if(target==='itemType'){
        delete dataList.itemName;
        this.setState({dataList},()=>{
          this.getItemNameList();
        });
      }
    });
  }

  handleIptText1(target,e) {
    let status = Object.assign({},this.state.status);
    status[target] = e.target ? e.target.value : e;
    this.setState({status});
  }
  render(){
    const {itemTypeList,edit,statusFlag} = this.props;
    const {itemNameList,status} = this.state;
    const {
      // nursingGradeCode,//护理等级代码
      nursingGradeName,//护理等级名称
      itemName,        //项目名称
      discription,     //描述
      timeLenght,      //时长
      itemType,        //项目类别
      repeatType,      //重复类型
      repeatDate,      //重复时间
      pointTime,       //时间点
      // templete,        //模版
      memo,            //备注
      //operaterName,    //操作员
    } = this.state.dataList;
    const {A01,A02,A03,A04} = this.state.status;
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
    return(
      <Fragment>
        <h3 style={{textAlign:'center',fontSize:'18px',fontWeight:'bold'}}>基本信息</h3>
        <Form hideRequiredMark onSubmit={this.handleSubmit}>
          <Form.Item
            label="护理等级名称"
            style={{marginBottom:'4px'}}
            {...formItemLayout}
          >
            <Input  value={nursingGradeName} onChange={(e) => this.handleIptText('nursingGradeName',e)} disabled />
          </Form.Item>
           
          <Form.Item
            label="项目名称"
            style={{marginBottom:'4px'}}
            {...formItemLayout}
          > 
            <Input onChange={(e) => this.handleIptText('itemName',e)} disabled ={edit} /> 
          </Form.Item>
          <Form.Item
            label="项目描述"
            style={{marginBottom:'4px'}}
            {...formItemLayout}
          >
            <Input  value={discription} onChange={(e) => this.handleIptText('discription',e)} disabled ={edit}/>
          </Form.Item>
           
          <Form.Item
            label="重复类型"
            style={{marginBottom:'4px'}}
            {...formItemLayout}
          >
            <Radio.Group 
              value={repeatType} 
              onChange={(e) => this.handleIptText('repeatType',e)} 
              buttonStyle="solid"
              disabled ={edit}
            >
              <Radio.Button value="1">按需</Radio.Button>
              <Radio.Button value="2">每日</Radio.Button>
              <Radio.Button value="3">每周</Radio.Button>
              <Radio.Button value="4">每月</Radio.Button>
              （必选项）
            </Radio.Group>
          </Form.Item>
          {
            (repeatType === "1" || repeatType === "2")? <Form.Item
                                label="时间点"
                                style={{marginBottom:'4px'}}
                                {...formItemLayout}
                              >
                                <Input placeholder='8:30,12:30' value={pointTime} onChange={(e) => this.handleIptText('pointTime',e)} disabled ={edit} />
                              </Form.Item>:null
          }
          {
            (repeatType === "3" || repeatType === "4")? <Fragment>
                                <Form.Item
                                  label="重复时间"
                                  style={{marginBottom:'4px'}}
                                  {...formItemLayout}
                                >
                                  <Input placeholder='重复类型是每周[1-7],每月[1-31],任意数字用逗号分割,如1,3' value={repeatDate} onChange={(e) => this.handleIptText('repeatDate',e)} disabled ={edit} />
                                </Form.Item>
                                <Form.Item
                                  label="时间点"
                                  style={{marginBottom:'4px'}}
                                  {...formItemLayout}
                                >
                                  <Input placeholder='8:30,12:30' value={pointTime} onChange={(e) => this.handleIptText('pointTime',e)} disabled ={edit} />
                                </Form.Item>
                              </Fragment>:null
          }
          <Form.Item
            label="描述"
            style={{marginBottom:'4px'}}
            {...formItemLayout}
          >
            <Input value={memo} onChange={(e) => this.handleIptText('memo',e)} disabled ={edit} />
          </Form.Item>
          {
            statusFlag?<Fragment>
              <Form.Item
                label="状态1"
                style={{marginBottom:'4px'}}
                {...formItemLayout}
              >
                <Input placeholder="必填项" value={A01} onChange={(e) => this.handleIptText1('A01',e)} disabled ={edit} />
              </Form.Item>
              <Form.Item
                label="状态2"
                style={{marginBottom:'4px'}}
                {...formItemLayout}
              >
                <Input placeholder="必填项" value={A02} onChange={(e) => this.handleIptText1('A02',e)} disabled ={edit} />
              </Form.Item>
              <Form.Item
                label="状态3"
                style={{marginBottom:'4px'}}
                {...formItemLayout}
              >
                <Input placeholder="必填项" value={A03} onChange={(e) => this.handleIptText1('A03',e)} disabled ={edit} />
              </Form.Item>
              <Form.Item
                label="状态4"
                style={{marginBottom:'4px'}}
                {...formItemLayout}
              >
                <Input placeholder="必填项" value={A04} onChange={(e) => this.handleIptText1('A04',e)} disabled ={edit} />
              </Form.Item>
            </Fragment>:null
          }
          <Form.Item style={{textAlign:'center'}}>
            <Button type="primary" htmlType="submit">确认</Button>
            <Button type="primary" onClick={()=>{this.props.changeTabskeyToTab1()}}>取消</Button>
          </Form.Item>
        </Form>
      </Fragment>
    )
  }
}

export default Form.create()(MineForm);
 