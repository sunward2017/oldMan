import React,{Component,Fragment} from 'react';
import {Card,Table,Input,Select,Popconfirm,Button,notification,Tag,Divider,Icon} from 'antd';
import httpServer from '../../../axios';
const Option = Select.Option;
class FamilyMember extends Component{
  constructor(props){
    super(props);
    this.state = {
      memberList:[],
      edit:true,
      addFlag:true,
      count:"a",
      editFlag:props.editFlag,
      id:'',
    }
    this.handleAddMember = this.handleAddMember.bind(this);
  }

  componentDidMount(){
    this.getFamilyMember();
  }
  getFamilyMember(){
    const {elderlyId} = this.props;
    httpServer.listFamilyMember({elderlyId}).then((res)=>{
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
  handleAddMember(){ //新增家庭成员
    const {addFlag,count} = this.state;
    if(addFlag){
      const memberList = this.state.memberList;
      memberList.push({count});
      this.setState({memberList,addFlag:false});
    }else{
      const args = {
        message: '友情提示',
        description: "请先保存 ",
        duration: 2,
      };
      notification.info(args);
    }
  }

  changeHandler(record,param,e){ //表格字段值发生变化
    const obj ={};
    obj[param] = e.target.value;
    const recordNow ={...record,...obj};
    const memberList_copy = this.state.memberList;
    memberList_copy.pop();
    memberList_copy.push(recordNow);
    this.setState({memberList:memberList_copy});
  }
  sexChangeHandler(record,value,e){//表格性别字段值发生变化
    const recordNow ={...record,"sex":value};
    const memberList_copy = this.state.memberList;
    memberList_copy.pop();
    memberList_copy.push(recordNow);
    this.setState({memberList:memberList_copy});
  }

  handleSave(record){//保存新增的家庭成员
    const {name,relation,phone,address} = record;
    if(!(name&&relation&&phone&&address)){
      const args = {
        message: '友情提示',
        description: "还有数据未填，请仔细检查",
        duration: 2,
      };
      notification.info(args);
      return false;
    }
    if(!(/^[1][3,4,5,7,8][0-9]{9}$/.test(phone))) {
      const args = {
        message: '错误提示',
        description: "手机号码格式不正确",
        duration: 2,
      };
      notification.error(args);
      return false;
    }
    const values = record;
    delete values.count;
    values.elderlyId=this.props.elderlyId;
    httpServer.saveFamilyMember(values).then((res)=>{
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        this.setState({addFlag:true,memberList:[]},()=>{this.getFamilyMember();});
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

  handleClickCancle(){//取消
    const memberList = this.state.memberList;
    memberList.pop();
    this.setState({memberList,addFlag:true});
  }
  handleRowDelete(record){ //删除家庭成员
    const {elderlyId} = this.props;
    httpServer.delFamilyMember({id:record.id,elderlyId}).then((res)=>{
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        this.getFamilyMember();
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

  handleSetDefault(){
    const {elderlyId} = this.props;
    const {id} = this.state;
    if(!id){
      const args = {
        message: '友情提示',
        description: "请先单击选中需要设为默认联系人的家庭成员",
        duration: 2,
      };
      notification.info(args);
      return false;
    }
    httpServer.GetFamilyMemberRecvSms({id,elderlyId}).then((res)=>{
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        this.setState({addFlag:true});
        this.getFamilyMember();
      } else {
        if(res.message ==='Request failed with status code 500'){
            console.log(res.message);
         }else{
             const args = {
            message: '通信失败',
            description: res.msg,
            duration: 4,
          };
          notification.error(args);
         }
      }
    }).catch((error)=>{
      console.log(error);
    });
  }

  handleSetDefaultPayment(){
    const {elderlyId} = this.props;
    const {id} = this.state;
    if(!id){
      const args = {
        message: '友情提示',
        description: "请先单击选中需要设为默认交款人的家庭成员",
        duration: 4,
      };
      notification.info(args);
      return false;
    }
    httpServer.GetFamilyMemberPayFee({id,elderlyId}).then((res)=>{
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        this.setState({addFlag:true});
        this.getFamilyMember();
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
  hangdleCheck(record){//点击行
    const {id} = record;
    if(id){
      this.setState({id});
    }
  }
  render(){
    const {memberList,edit,editFlag} = this.state;
    const columns = [{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      key:'serialNumber',
      dataIndex: 'serialNumber',
      width:'5%'
    },{
      title: '家属姓名',
      dataIndex: 'name',
      key: 'name',
      render:(text,record)=>{
        return(
          edit && !record.id?
          <Input 
            value={record.name} 
            onChange={(e) => this.changeHandler(record,"name", e)}
          />:record.name
        ) 
      },
      width:'10%'
    },{
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render:(text,record)=>{
        return (
          edit && !record.id ?
          <Select value={record.sex} onChange={(value,e) => this.sexChangeHandler(record,value,e)} placeholder="请选择" style={{width:"100%"}}>
            <Option value={1}>男</Option>
            <Option value={0}>女</Option>
          </Select>:record.sex===1?<Tag color="green">男</Tag>:<Tag color="red">女</Tag>
          )
      },
      width:'10%'
    },{
      title:'与老人关系',
      dataIndex: 'relation',
      key: 'relation',
      render:(text,record)=>{
        return(
          edit && !record.id ?
          <Input 
            value={record.relation} 
            onChange={(e) => this.changeHandler(record,"relation", e)}
          />:record.relation
        ) 
      },
      width:'15%',
    },{
      title:'联系电话',
      dataIndex: 'phone',
      key: 'phone',
      render:(text,record)=>{
        return(
          edit && !record.id ?
          <Input 
            value={record.phone} 
            onChange={(e) => this.changeHandler(record,"phone", e)}
          />:record.phone
        ) 
      },
      width:'15%',
    },{
      title:'联系地址',
      dataIndex: 'address',
      key: 'address',
      render:(text,record)=>{
        return(
          edit && !record.id ?
          <Input 
            value={record.address} 
            onChange={(e) => this.changeHandler(record,"address", e)}
          />:record.address
        ) 
      },
      width:'10%',
    },{
      title:'默认联系人',
      dataIndex: 'flag',
      key: 'flag',
      render:(text,record)=>{
        return(
          record.flag===1 ?<Icon type="smile" theme="twoTone" style={{fontSize:20}} />:null
        ) 
      },
      width:'10%',
    },{
      title:'默认交款人',
      dataIndex: 'flag1',
      key: 'flag1',
      render:(text,record)=>{
        return(
          record.flag1===1 ? <Icon type="smile" theme="twoTone" twoToneColor="#52c41a" style={{fontSize:20}} />:null
        ) 
      },
      width:'10%',
    },{
      title:'操作',
      dataIndex: 'action',
      key: 'action',
      render:(text,record)=>{
        return(
          edit && !record.id ?
            <span>
              <a href="javascript:;" onClick={() => { this.handleSave(record) }} style={{color:'#2ebc2e'}}>保存</a>
              <Divider type="vertical" />
              <a href="javascript:;" onClick={() => { this.handleClickCancle() }} style={{color:'#2ebc2e'}}>取消</a>
            </span>:
              <span>
                <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record)}>
                  <a href="javascript:;" style={{color:'#2ebc2e'}} disabled={editFlag}>删除</a>
                </Popconfirm>
              </span>
        )
      },
      width:'15%',
    }];
    return(
      <Fragment>
        <Card
          title="家庭成员信息"
          style={{ width:"100%"}}
          extra={
            <span>
              <Button type="primary" onClick={() => { this.handleSetDefault() }}>设置默认联系人</Button>
              <Divider type="vertical" />
              <Button type="primary" onClick={() => { this.handleSetDefaultPayment() }}>设置默认交款人</Button>
            </span>
          }
        >
          <Table 
            dataSource={memberList} 
            columns={columns} 
            pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50']}}
            rowKey={record => {
              if(record.id){
                return record.id
              }else{
                return record.count
              }
            }}
            onRow={(record) => {
              return {
                onClick: () => {this.hangdleCheck(record);},       // 点击行
              };
            }}
          />
          <Button type="primary"  icon="plus" onClick={this.handleAddMember} disabled={editFlag}></Button>
        </Card>
      </Fragment>
    )
  }
}

export default FamilyMember;