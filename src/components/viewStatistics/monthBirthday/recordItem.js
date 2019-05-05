import React ,{Fragment}from 'react';
import httpServer from '../../../axios';
import { Card, Icon, Avatar, Popconfirm,Tag,Button,Modal,Tabs,Form,Input,Radio,InputNumber,DatePicker,Select,notification,Table} from 'antd';
import moment from 'moment';
import img from '@/style/imgs/smile.jpg'

const {
  Meta
} = Card;
const TabPane = Tabs.TabPane;
const Option = Select.Option;
const { TextArea } = Input;
class RecordItem1 extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modalFlag:false,
      dataSource:{},
      memberList:[],
      chargeItemList:props.chargeItemList,
    }
    this.handleCancel = this.handleCancel.bind(this);
  }
  componentDidMount() {
    // this.getPayItemChild();
   // console.log('item record:',this.props);
  }

  

  handleCancel(){
    this.setState({modalFlag:false});
  }
  recordDeleteHandler = () => {
    this.props.onDel();
  };
  actionRender=(data,baseUrl)=>{
    return [<Button onClick={()=>{this.handleBtnClick(data)}}>查看</Button>] 
  }
  handleBtnClick = (data) =>{
    this.setState({modalFlag:true,dataSource:data});
    httpServer.listFamilyMember({elderlyId:data.id}).then((res)=>{
      if (res.code === 200) {
        res.data?this.setState({memberList:res.data}):this.setState({memberList:[],});
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
    }).catch((error)=>{
      console.log(error);
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      name,    //老人姓名
      age,//年龄
      idNumber,//老人身份证号 需要正则判断
      socialSecurityNumber,//社保卡号
      sex,//老人性别 int
      birthday,//老人生日 datetime
      checkInDate,//入院日期
      maritalStatus,//老人婚姻状况 int
      address,//老人住址
      politicalFace,//老人政治面貌 int
      livingCondition,//老人居住状况 int
      economicSituation,//老人经济状况 int
      hobby,//爱好特长
      //opetator,//操作员
      roomName,//房间名称
      roomCode,//房间uuid
      bedNumber,//床位号
      itemCodeWater,//水费对应项
      itemCodeKwh,//电费对应项
      itemCodeMeal,//餐费对应项
      shareProportionWater,//水费承担比例
      shareProportionPower,//电费承担比例
      memo,//备注
    } = this.state.dataSource;
    const columns = [{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      key:'serialNumber',
      dataIndex: 'serialNumber',
      width:'10%'
    },{
      title: '家属姓名',
      dataIndex: 'name',
      key: 'name',
      width:'20%'
    },{
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render:(text,record)=>{
        return (
          record.sex===1?<Tag color="green">男</Tag>:<Tag color="red">女</Tag>
          )
      },
      width:'10%'
    },{
      title:'与老人关系',
      dataIndex: 'relation',
      key: 'relation',
      width:'15%',
    },{
      title:'联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width:'15%',
    },{
      title:'联系地址',
      dataIndex: 'address',
      key: 'address',
    }];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
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
    const {
      data,
      baseUrl
    } = this.props;
    const date = moment(data.birthday).format('YYYY-MM-DD');
    const {modalFlag,chargeItemList,memberList} = this.state;
    return(
      <Fragment>
        <Card
        style={{ width: 250, marginTop: 16 }}
        actions={this.actionRender(data,baseUrl)}
        >
          <Meta
            avatar={<Avatar src={img} />}
            title={data.name}
            description={<span>性别:&emsp;<Tag color="#108ee9" style={{marginBottom:10}}>{data.sex===1?'男':'女'}</Tag><br/>年龄:&emsp;<Tag color="orange" style={{marginBottom:10}}>{data.age}</Tag>岁<br/>生日:&emsp;{date}</span>}
          />
        </Card>
        {
          modalFlag?
            <Modal
              title="老人信息"
              visible={true}
              footer = {null}
              onCancel={this.handleCancel}
              width="800px"
            >
               <Tabs>
                <TabPane tab="老人信息" key="1"> 
                  <Form onSubmit={this.handleSubmit} hideRequiredMark>
                    <Form.Item
                      {...formItemLayout}
                      label="老人姓名"
                    >
                      {getFieldDecorator('name', {
                        rules: [{required: true, message: '请输入老人姓名',}],
                        initialValue:name
                      })(
                        <Input disabled/>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="老人年龄"
                    >
                      {getFieldDecorator('age', {
                        rules: [{required: true, message: '请输入老人年龄',},{
                           validator: this.handleConfirmAge
                        }],
                        initialValue:age
                      })(
                        <InputNumber min={1} disabled/>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="身份证号"
                    >
                      {getFieldDecorator('idNumber', {
                        rules: [{required: true, message: '请输入老人身份证号',},{
                           validator: this.handleConfirmIdNumber
                        }],
                        initialValue:idNumber
                      })(
                        <Input disabled/>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="社保卡号"
                    >
                      {getFieldDecorator('socialSecurityNumber', {
                        rules: [{required: true, message: '请输入社保卡号',}],
                        initialValue:socialSecurityNumber
                      })(
                        <Input disabled/>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="性别"
                    >
                      {getFieldDecorator('sex', {
                        rules: [{required: true, message: '请选择老人性别',}],
                        initialValue:sex
                      })(
                        <Radio.Group  buttonStyle="solid" disabled>
                          <Radio.Button value={1}>男</Radio.Button>
                          <Radio.Button value={0}>女</Radio.Button>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="出生日期"
                    >
                      {getFieldDecorator('birthday', {
                        rules: [{required: true, message: '请选择出生日期',}],
                        initialValue:birthday?moment(birthday,'YYYY-MM-DD') : null
                      })(
                        <DatePicker format="YYYY-MM-DD" disabled />
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="入院日期"
                    >
                      {getFieldDecorator('checkInDate', {
                        rules: [{required: true, message: '请选择出生日期',}],
                        initialValue:checkInDate?moment(checkInDate,'YYYY-MM-DD') : null
                      })(
                        <DatePicker format="YYYY-MM-DD" disabled />
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="婚姻状况"
                    >
                      {getFieldDecorator('maritalStatus', {
                        rules: [{required: true, message: '请选择婚姻状况',}],
                        initialValue:maritalStatus
                      })(
                        <Radio.Group buttonStyle="solid" disabled>
                          <Radio.Button value={1}>未婚</Radio.Button>
                          <Radio.Button value={2}>已婚</Radio.Button>
                          <Radio.Button value={3}>丧偶</Radio.Button>
                          <Radio.Button value={4}>离异</Radio.Button>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="家庭住址"
                    >
                      {getFieldDecorator('address', {
                        rules: [{required: true, message: '请输入老人家庭住址',}],
                        initialValue:address
                      })(
                        <Input disabled/>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="政治面貌"
                    >
                      {getFieldDecorator('politicalFace', {
                        rules: [{required: true, message: '请选择老人政治面貌',}],
                        initialValue:politicalFace
                      })(
                        <Radio.Group  buttonStyle="solid" disabled>
                          <Radio.Button value={1}>群众</Radio.Button>
                          <Radio.Button value={2}>党员</Radio.Button>
                          <Radio.Button value={3}>其他党派</Radio.Button>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="居住状况"
                    >
                      {getFieldDecorator('livingCondition', {
                        rules: [{required: true, message: '请选择老人居住状况',}],
                        initialValue:livingCondition
                      })(
                        <Radio.Group  buttonStyle="solid" disabled>
                          <Radio.Button value={1}>独居</Radio.Button>
                          <Radio.Button value={2}>与家庭成员同住</Radio.Button>
                          <Radio.Button value={3}>其他</Radio.Button>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="经济状况"
                    >
                      {getFieldDecorator('economicSituation', {
                        rules: [{required: true, message: '请选择老人经济状况',}],
                        initialValue:economicSituation
                      })(
                        <Radio.Group  buttonStyle="solid" disabled>
                          <Radio.Button value={1}>离休</Radio.Button>
                          <Radio.Button value={2}>退休金</Radio.Button>
                          <Radio.Button value={3}>子女供给</Radio.Button>
                          <Radio.Button value={4}>社会保险与救济</Radio.Button>
                          <Radio.Button value={5}>其他</Radio.Button>
                        </Radio.Group>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="爱好特长"
                    >
                      {getFieldDecorator('hobby', {
                        rules: [{required: true, message: '请输入老人的爱好特长',}],
                        initialValue:hobby
                      })(
                        <Input disabled/>
                      )}
                    </Form.Item>
                     
                    <Form.Item
                      {...formItemLayout}
                      label="房间名称"
                    >
                      {getFieldDecorator('roomCode', {
                        rules: [{required: true, message: '请选择房间名称',}],
                        initialValue:roomName
                      })(  
                        <Input disabled/>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="床位名称"
                    >
                      {getFieldDecorator('bedNumber', {
                        rules: [{required: true, message: '请选择房间名称',}],
                        initialValue:bedNumber
                      })(  
                        <Input disabled/>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="水费对应项"
                    >
                      {getFieldDecorator('itemCodeWater', {
                        rules: [{required: true, message: '请选择水费对应项',}],
                        initialValue:itemCodeWater
                      })(
                        <Select showArrow={false}  disabled onSelect={(value)=>{this.handleWaterSelect(value)}}>
                          {chargeItemList.map(item => <Option key={item.itemCode}>{item.name}</Option>)}
                        </Select>

                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="电费对应项"
                    >
                      {getFieldDecorator('itemCodeKwh', {
                        rules: [{required: true, message: '请选择电费对应项',}],
                        initialValue:itemCodeKwh
                      })(
                         <Select showArrow={false} disabled onSelect={(value)=>{this.handleKwhSelect(value)}}>
                          {chargeItemList.map(item => <Option key={item.itemCode}>{item.name}</Option>)}
                        </Select>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="餐费对应项"
                    >
                      {getFieldDecorator('itemCodeMeal', {
                        rules: [{required: true, message: '请选择餐费对应项',}],
                        initialValue:itemCodeMeal
                      })(
                        <Select showArrow={false} disabled onSelect={(value)=>{this.handleMealSelect(value)}}>
                          {chargeItemList.map(item => <Option key={item.itemCode}>{item.name}</Option>)}
                        </Select>
                      )}
                    </Form.Item>
                     <Form.Item
                      {...formItemLayout}
                      label="水费承担比例(%)"
                    >
                      {getFieldDecorator('shareProportionWater', {
                        rules: [{required: true, message: '请输入水费承担比例(0-100的正整数)',},{
                           validator: this.handleConfirmShareProportionWater
                        }],
                        initialValue:shareProportionWater
                      })(
                        <InputNumber min={0} max={100} disabled/>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="电费承担比例(%)"
                    >
                      {getFieldDecorator('shareProportionPower', {
                        rules: [{required: true, message: '请输入电费承担比例(0-100的正整数)',},{
                           validator: this.handleConfirmShareProportionPower
                        }],
                        initialValue:shareProportionPower
                      })(
                        <InputNumber min={0} max={100} disabled/>
                      )}
                    </Form.Item>
                    <Form.Item
                      {...formItemLayout}
                      label="备注信息"
                    >
                      {getFieldDecorator('memo', {
                        rules: [{required: false, message: '请输入备注',}],
                        initialValue:memo
                      })(
                        <TextArea disabled/>
                      )}
                    </Form.Item>
                  </Form>
                </TabPane>
                <TabPane tab="家庭成员" key="2">
                  <Table 
                    bordered
                    dataSource={memberList} 
                    columns={columns} 
                    pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50','100']}}
                    rowKey={record => {
                      if(record.id){
                        return record.id
                      }else{
                        return record.count
                      }
                    }}
                  />
                </TabPane>
              </Tabs>
            </Modal>:null
        }
      </Fragment>
    )
  }
}
const RecordItem =  Form.create()(RecordItem1);
export default RecordItem;
/*
<Form.Item
                      {...formItemLayout}
                      label="操作员"
                    >
                      {getFieldDecorator('opetator', {
                        rules: [{required: true, message: '请输入操作员',}],
                        initialValue:opetator
                      })(
                        <Input disabled/>
                      )}
                    </Form.Item>
 */