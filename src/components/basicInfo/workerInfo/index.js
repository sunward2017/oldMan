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
      title: '工号',
      dataIndex: 'jobNumber',
      key: 'jobNumber',
      width:'5%',
      align:'center',
    },{
      title: '姓名',
      dataIndex: 'workerName',
      key: 'workerName',
      width:'10%',
      align:'center'
    },{
      title:'联系电话',
      dataIndex: 'phone',
      key: 'phone',
      width:'10%'
    },{
      title: '性别',
      dataIndex: 'sex',
      align:'center',
      key: 'sex',
      render:(text,record)=>{
        return record.sex === 1?<Tag color="green">男</Tag>:<Tag color="red">女</Tag>
      },
      width:'8%'
    },{
      title: '入职日期',
      dataIndex: 'entryTime',
      key: 'entryTime',
      align:'center',
      render:(text,record)=>{
        return record.entryTime && record.entryTime.substr(0,10)
      },
    },{
      title: '离职日期',
      dataIndex: 'quitTime',
      key: 'quitTime',
      align:'center',
      width:'10%',
      render:(text,record)=>{
        return record.quitTime && record.quitTime.substr(0,10)
      },
    },{
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align:'center',
      render:(text,record)=>{
        return record.status === 1 ? < Tag color = "green" >在职< /Tag>:<Tag color="red">离职</Tag >
      },
      width:'10%'
    },{
      title:'操作',
      dataIndex:'action',
      align:'center',
      key:'action',
      fixed: 'right',
      width: 200,
      render:(text,record)=>{
        return(
          <span>
	            <Button size="small" icon="read" title="详情" type="primary" onClick={() => { this.handleRead(record) }}></Button>
	            <Divider type="vertical" />
              <Button size="small" icon="edit" title="编辑" type="primary" onClick={() => { this.handleModify(record) }}></Button>
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
                 <Button size="small" icon="delete" title="删除" type="primary" ></Button>
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
          size="middle"
          scroll={{x:1300}}
          dataSource={dataSource} 
          columns={columns} 
          pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50']}}
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
