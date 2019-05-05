import React,{Component} from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import {Tag,Table,Divider,Popconfirm,notification,Button,Card} from 'antd';
import httpServer from '../../../axios';
import ModalInfo from './ModalInfo';
class WorkerInfo extends Component{
  constructor(props){
    super(props);
    this.state = {
      modalFlag:false,//控制是否打开弹框，true则打开
      dataSource:[],
      record:{},
      action:'',
      disFlag:false,
    }
    this.handleAdd = this.handleAdd.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.getWorkerList = this.getWorkerList.bind(this);
  }

  componentDidMount(){
    this.getWorkerList();
  }

  //getWorkerList获取护工列表
  getWorkerList(){
    const {customerId} = this.props.auth;
    httpServer.listWorkerInfo({customerId}).then((res)=>{
       if (res.code === 200) {
          // const args = {
          //   message: '通信成功',
          //   description: res.msg,
          //   duration: 2,
          // };
          // notification.success(args);
          res.data?this.setState({dataSource:res.data}):this.setState({dataSource:[]});
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
  //关闭弹出框
  handleCancel(){
    this.setState({modalFlag:false});
  }

  //添加护工信息
  handleAdd(){
    // const record = this.state.record;
    // record.entryTime = new Date();
    this.setState({modalFlag:true,record:{entryTime:new Date(),},action:'',disFlag:false,});
  }

  //查看护工信息
  handleRead(record){
    this.setState({modalFlag:true,record,action:'read',disFlag:true, });
  }

  handleModify(record){
    this.setState({modalFlag:true,record,action:'',disFlag:false, });
  }

  handleRowDelete(id,record){
    const _this = this;
    httpServer.deleteWorkerInfo({id},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        _this.getWorkerList();
      } else {
        console.log(res.message);
      }
    }).catch(
      err => { console.log(err) }
    )
  }  

  render(){
    const {dataSource,modalFlag,record,disFlag,action} = this.state;
    const columns = [{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      key:'serialNumber',
      width:'5%'
    },{
      title: '姓名',
      dataIndex: 'workerName',
      key: 'workerName',
      width:'8%'
    },{
      title:'电话',
      dataIndex: 'phone',
      key: 'phone',
      width:'10%'
    },{
      title: '性别',
      dataIndex: 'sex',
      key: 'sex',
      render:(text,record)=>{
        return record.sex === 1?<Tag color="green">男</Tag>:<Tag color="red">女</Tag>
      },
      width:'8%'
    },{
      title: '工号',
      dataIndex: 'jobNumber',
      key: 'jobNumber',
      width:'10%'
    },{
      title: '添加日期',
      dataIndex: 'addtime',
      key: 'addtime',
      render:(text,record)=>{
        return record.addtime && record.addtime.substr(0,10)
      },
      width:'13%'
    },{
      title: '入职日期',
      dataIndex: 'entryTime',
      key: 'entryTime',
      render:(text,record)=>{
        return record.entryTime && record.entryTime.substr(0,10)
      },
      width:'13%'
    },{
      title: '离职日期',
      dataIndex: 'quitTime',
      key: 'quitTime',
      render:(text,record)=>{
        return record.quitTime && record.quitTime.substr(0,10)
      },
      width:'13%'
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render:(text,record)=>{
        return record.status === 1?<Tag color="green">在职</Tag>:<Tag color="red">离职</Tag>
      },
      width:'5%'
    },{
      title:'操作',
      dataIndex:'action',
      key:'action',
      render:(text,record)=>{
        return(
          <span>
            <a href="javascript:;" onClick={() => { this.handleRead(record) }} style={{color:'#2ebc2e'}}>查看</a>
            <Divider type="vertical" />
            <a href="javascript:;" onClick={() => { this.handleModify(record) }} style={{color:'#2ebc2e'}}>修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
                <a href="javascript:;" style={{color:'#2ebc2e'}}>删除</a>
              </Popconfirm>
          </span>
        )
      },
    }];
    return(
      <div>
        <BreadcrumbCustom first="基础信息" second="护工信息" />
        <Card 
	          title="护工"
	          bordered={false} 
	          extra={<Button type="primary" onClick={()=>{this.handleAdd()}} >新增</Button>}
	        >
        <Table 
          bordered
          dataSource={dataSource} 
          columns={columns} 
          pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50','100']}}
          rowKey={record => record.id}
        />
        </Card>
        {
          modalFlag?<ModalInfo 
            handleCancel={this.handleCancel} 
            record={record}
            disFlag={disFlag}
            action={action}
            getWorkerList = {this.getWorkerList}
            customerId={this.props.auth.customerId}
            />:null
        }
      </div>
    )
  }
}

export default WorkerInfo;
