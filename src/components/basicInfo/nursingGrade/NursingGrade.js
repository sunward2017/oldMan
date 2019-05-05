import React,{Component} from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import {Tag,Table,Divider,Popconfirm,notification,Button} from 'antd';
import httpServer from '../../../axios';
import ModalInfo from './ModalInfo';
class NursingGrade extends Component{
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
    this.getNursingGradeList = this.getNursingGradeList.bind(this);
  }

  componentDidMount(){
    this.getNursingGradeList();
  }

  //getWorkerList获取护工列表
  getNursingGradeList(){
    const {customerId} = JSON.parse(sessionStorage.getItem('auth'));
    httpServer.listNursingGrade({customerId}).then((res)=>{
       if (res.code === 200) {
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
    const {account} = JSON.parse(sessionStorage.getItem('auth'));
    this.setState({modalFlag:true,record:{operaterName:account,},action:'',disFlag:false,});
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
    httpServer.deleteNursingGrade({id},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        _this.getNursingGradeList();
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
      width:'10%'
    },{
      title: '级别编号',
      dataIndex: 'nursingGradeCode',
      key: 'nursingGradeCode',
      width:'10%'
    },{
      title:'等级名称',
      dataIndex: 'nursingGradeName',
      key: 'nursingGradeName',
      width:'10%'
    },{
      title:'费用',
      dataIndex: 'money',
      key: 'money',
      width:'10%'
    },{
      title: '状态',
      dataIndex: 'state',
      key: 'state',
      render:(text,record)=>{
        return record.state === 1?<Tag color="green">正常</Tag>:<Tag color="red">无效</Tag>
      },
      width:'10%'
    },{
      title: '添加日期',
      dataIndex: 'addtime',
      key: 'addtime',
      width:'15%'
    },{
      title: '操作员',
      dataIndex: 'operaterName',
      key: 'operaterName',
      width:'10%'
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
        <BreadcrumbCustom first="基础信息" second="护理等级" />
        <Button onClick={this.handleAdd} style={{marginBottom:'20px'}}>新增</Button>
        <Table 
          bordered
          dataSource={dataSource} 
          columns={columns} 
          pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50','100']}}
          rowKey={record => record.id}
        />
        {
          modalFlag?<ModalInfo 
            handleCancel={this.handleCancel} 
            record={record}
            disFlag={disFlag}
            action={action}
            getNursingGradeList = {this.getNursingGradeList}
            />:null
        }
      </div>
    )
  }
}

export default NursingGrade;
