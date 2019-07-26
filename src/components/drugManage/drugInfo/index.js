import React , { Component } from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios';
import {Tag,Table,Divider,Popconfirm,notification,Button,Card,Input,Tooltip} from 'antd';
import ModalInfo from './DrugInfoModal';
class DrugInfo1 extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource:[],
      modalFlag:false,
      action:'',
      unitList:[],
      record:{},
      flag:false,
      searchText:'',
      data:[]
    }
    this.handleAdd = this.handleAdd.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
  }

  componentDidMount(){
    this.getDrugList();
    //this.getUnitList();
  }

  //获取药品列表
  getDrugList(){
    httpServer.listDrugInfoInfo({}).then(res => {
      if (res.code === 200) {
        this.setState({ dataSource: res.data||[],data:res.data||[] })  ;
      } else {
        const args = {
          message: '通信失败',
          description: res.message,
          duration: 2,
        };
        notification.error(args);
      }
    }).catch(
      err => { console.log(err) }
    )
  }

  //获取单位列表
  getUnitList(){
    httpServer.listParam({type:1}).then((res)=>{
      if (res.code === 200) {
        res.data?this.setState({unitList:res.data},()=>{console.log(res.data);}):this.setState({unitList:[]});
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
  

  //查看详细药品信息
  handleRead(record){
    this.setState({modalFlag:true,action:'read',record,flag:true,});
  }
  // 添加药品
  handleAdd(){
    this.setState({modalFlag:true,record:{},flag:false,action:''});
  }

  //修改药品信息
  handleModify(record){
    this.setState({modalFlag:true,action:'',record,flag:false,});
  }

  //删除药品信息
  handleRowDelete(id,record){
    const _this = this;
    httpServer.deleteDrugInfo({id},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        _this.getDrugList();
      } else {
        console.log(res.message);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  //关闭modal
  handleCancel(){
    this.setState({modalFlag:false});
  }
  handleInputChange=(e) =>{ //老人姓名搜索框发生变化
	  this.setState({ searchText: e.target.value });
	}
  
  handleReset = ()=>{
    this.getDrugList()
  }
  handleSearch=()=>{
    const { searchText } = this.state;
	    if(searchText){
	      const reg = new RegExp(searchText, 'gi');
	      const data = this.state.dataSource.filter((record) =>record.name && record.name.match(reg));
	      this.setState({
	        data,
	      });
	    }else{
	    	const {dataSource} = this.state;
	      this.setState({data:dataSource})
	    }
  }
  render(){
    const { data ,modalFlag,unitList,record,flag,action} = this.state;
    const columns = [{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      width:'3%',
      key:'index'
    },{
      title: '药品名称',
      dataIndex: 'name',
      key: 'name',
      width:'10%'
    },{
      title:'条形码',
      dataIndex: 'barcode',
      key: 'barcode',
      width:'5%'
    },{
      title: '是否处方',
      dataIndex: 'prescription',
      key: 'prescription',
      align:'center',
      render:(text,record)=>{
        return record.prescription==0?<Tag color="red">否</Tag>:<Tag color="green">是</Tag>
        
      },
      width:'7%'
    },{
      title: '是否医保',
      dataIndex: 'insurance',
      key: 'insurance',
      align:'center',
      render:(text,record)=>{
        return record.insurance == 0?<Tag color="red">否</Tag>:<Tag color="green">是</Tag>
      },
      width:'7%'
    },{
      title: '功能主治',
      dataIndex: 'indicationsFunction',
      key: 'indicationsFunction',
      width:"10%",
      onCell: () => {
        return {
          style: {
            maxWidth: 150,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },{
      title: '用法用量',
      dataIndex: 'usage1',
      key: 'usage1',
      width:"10%",
      onCell: () => {
        return {
          style: {
            maxWidth: 150,
            overflow: 'hidden',
            whiteSpace: 'nowrap',
            textOverflow:'ellipsis',
            cursor:'pointer'
          }
        }
      },
      render: (text) => <Tooltip placement="topLeft" title={text}>{text}</Tooltip>
    },{
    	title: '规格',
      dataIndex: 'specification',
      key: 'specification',
      width:'10%'
    },{
    	title:'单位',
    	dataIndex:'minUnit',
    	align:'center',
    	width:'5%'
    },{
    	title: '状态',
      dataIndex: 'status',
      key: 'status',
      render:(text,record)=>{
        return record.status === 0?<Tag color="red">禁用</Tag>:<Tag color="green">启用</Tag>
      },
      width:'5%'
    },{
      title:'操作',
      dataIndex:'action',
      key:'action',
      width:'10%',
      align:'center',
      render:(text,record)=>{
        return(
          <span>
              <Button title="修改" type="primary" size="small" icon="edit" onClick={() => { this.handleModify(record) }}></Button>
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
                 <Button type="primary" title="删除" size="small" icon="delete"></Button>
              </Popconfirm>
          </span>
        )
      },
    }];
    return(
      <div>
        <BreadcrumbCustom first="药品管理" second="药品信息" />
        <Card 
          title="药品信息"
          bordered={false} 
          extra={
          	<span>
          	    <Input 
                  placeholder="按药品名称搜索" 
                  style={{width:'40%',marginRight:'10px'}}
                  value={this.state.searchText}
                  onChange={this.handleInputChange}
                  onPressEnter={this.handleSearch}
                />
                <Button type="primary" onClick={this.handleSearch}>搜索</Button>
                <Button type="primary" onClick={this.handleReset}>刷新</Button>
          	    <Button type="primary" onClick={this.handleAdd}>新增</Button>
          	</span>
          	}
        >
        <Table
          size="middle"
          dataSource={data} 
          columns={columns} 
          pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50']}}
          rowKey={record => record.id}
        />
        </Card>
        {
          modalFlag?<ModalInfo customerId={this.props.auth.customerId} cancleClick={this.handleCancel} unitList={unitList} record={record} flag={flag} action={action} getDrugList={()=>{this.getDrugList()}} /> :null
        }
      </div>
    )
  }
}

export default DrugInfo1;
/*{
      title: '审计日期',
      dataIndex: 'auditOn',
      key: 'auditOn',
      width:'12%'
    }*/