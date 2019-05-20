import React,{Component} from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import {Input, Select ,Button ,Table ,Popconfirm,notification,message,Card} from 'antd';
import httpServer from '../../../axios';
import EditableCell from './EditableCell'

const Option = Select.Option;
class SysParamsClient extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource:[],
      value:'',
      inputValue:'',
      btnFlag:true,
      action:'',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleAddClick = this.handleAddClick.bind(this);
    this.handleIptText = this.handleIptText.bind(this);
  }

  //改变select的选项获取对应的列表信息
  handleChange(value){
    this.getListParam(value);
    this.setState({value,btnFlag:false});
  }

  getListParam(value){
    const {customerId} = this.props.auth;
     httpServer.listParam({type:value,customerId},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
      if (res.code === 200) {
        res.data ? this.setState({ dataSource: res.data }) : this.setState({ dataSource: [], });
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
  //input输入框内容发生变化
  handleInputChange(e){
    this.setState({inputValue:e.target.value})
  }
  //新增子项
  handleAddClick(){
    const {inputValue,value} = this.state;
    const {customerId} = this.props.auth;
    if(inputValue.length === 0){
      message.info('请先输入需要添加的子项的名称');
    }else{
      httpServer.saveParam({type:value,value:inputValue,customerId},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
         this.getListParam(value);
         this.setState({inputValue:''});
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

  handleModify(data){
    const {customerId} = this.props.auth;
    const _this =this;
    const {value} = this.state;
    data.customerId = customerId;
    httpServer.updateParam(data,{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
         _this.getListParam(value);
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

  handleIptText = (key) => {
    return (data1) => {
      const { value } = this.state;
      let data = {
        id:key,
        value:data1,
        type:value,
      };
      this.handleModify(data);
    };
  }
  

  /*删除操作*/
  handleRowDelete(id,record){
    const _this = this;
    const {customerId} = this.props.auth;
    const {value} = this.state;
    httpServer.deleteParam({id,type:value,customerId},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then(res => {
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        _this.getListParam(value);
      } else {
        console.log(res.message);
      }
    }).catch(
      err => { console.log(err) }
    )
  }
  render(){
    const {dataSource,btnFlag,inputValue} = this.state;
    const columns = [{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      width:'20%',
      key:'index'
    }, {
      title: '名称',
      dataIndex: 'value',
      key: 'value',
      render:(text,record)=>(
          <EditableCell value={text} width="80%" onChange={this.handleIptText(record.id)} />
      ),
      width:'50%',

    },{
      title:'操作',
      dataIndex:'action',
      key:'action',
      render:(text,record)=>{
        return(
          <span>
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
                <span style={{color:'#2ebc2e'}}>删除</span>
              </Popconfirm>
          </span>
        )
      },
    }];
    return(
      <div>
        <BreadcrumbCustom first="基础信息" second="系统参数" />
        <Card 
            title="系统参数"
            bordered={false} 
        >
        <div style={{marginBottom:30}}>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="请选择"
            optionFilterProp="children"
            onChange={this.handleChange}
            // onFocus={this.handleFocus}
            // onBlur={this.handleBlur}
            filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
          >
            <Option value="1" >单位</Option>
            <Option value="2" >支付方式</Option>
            <Option value="3" >托管方式</Option>
            <Option value="4" >自理能力</Option>
            <Option value="5" >婚姻状况</Option>
            <Option value="6" >政治面貌</Option>
            <Option value="7" >生活方式</Option>
            <Option value="8" >供养方式</Option>
            <Option value="9" >籍贯</Option>
            <Option value="11">文化程度</Option>
            <Option value="12">收款账户</Option>
            <Option value="13">入库方式</Option>
            <Option value="14">出库方式</Option>
          </Select>
          <Input 
            style={{width:200,marginLeft:40}} 
            placeholder="请输入增加的子项名称"
            value={inputValue}
            onChange={this.handleInputChange}
            disabled={btnFlag}
          />
          <Button 
            type="primary"
            style={{marginLeft:40}} 
            disabled={btnFlag}
            onClick={this.handleAddClick}
          >
            新增子项
          </Button>
        </div>
        <Table bordered dataSource={dataSource} columns={columns} rowKey={record => record.id} pagination={{pageSize:20}} />
        </Card>
      </div>
    )
  }
}

export default SysParamsClient;