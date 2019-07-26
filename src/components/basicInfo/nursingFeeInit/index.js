 import React,{Fragment,Component} from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios';
import moment from 'moment';
import {notification,Card,Table,Divider,Popconfirm,DatePicker,Input,Button} from 'antd';

class NursingInit extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource:[],
      edit:false,
      id:'',
      searchText:''
    }
  }
  componentDidMount(){
    this.getNursingInitList();
  }
  getNursingInitList(){
    const {customerId} = this.props.auth;
    httpServer.listOldManNursingIni({customerId}).then((res)=>{
       if (res.code === 200) {
           this.setState({dataSource:res.data||[],data:res.data||[]})
        }else{
          const args = {
            message: '通信失败',
            description: res.msg,
            duration: 2,
          }
          notification.error(args);
        }
    }).catch((err)=>{
      console.log(err);
    });
  }

  changeHandler(record,e){ //表格字段值发生变化
    const id = record.id;
    const dataSource = this.state.dataSource;
    const newDataSource = dataSource && dataSource.map((item,index)=>{
      if(item.id === id){
        item["endTime"] = e.target ? e.target.value : e;
      }
      return item;
    });
    this.setState({dataSource:newDataSource});
  }

  handleModify(r){ //编辑
    const {id} = r;
    this.setState({edit:true,id,});
  }

  handleSave(r){
    const {customerId} = this.props.auth;
    const {endTime,tbNursingItemRecoder} = r;
    if(!endTime){
      const args = {
        message: '通信失败',
        description: '上次结算日期不能为空',
        duration: 2,
      }
      notification.error(args);
      return false;
    }
    const data={};
    if(tbNursingItemRecoder){
      const {id} = tbNursingItemRecoder;
      data.id = id;
    }
    data.elderlyId = r.id;
    data.customerId = customerId;
    if(endTime){
      data.endTime = moment(endTime).format('YYYY-MM-DD HH:mm:ss');
    }
    httpServer.setOldManNursingIni(data).then((res)=>{
      if(res.code === 200){
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        }
        notification.success(args);
        this.setState({edit:false,id:''});
        this.getNursingInitList();
      }else{
        const args = {
          message: '通信失败',
          description: res.msg,
          duration: 2,
        }
        notification.error(args);
      }
    }).catch((error)=>{
      console.log(error);
    });
  }
  handleCancle(){//取消编辑
    this.setState({edit:false,id:''},()=>{
      this.getNursingInitList();
    });
  }
  handleInputChange=(e) =>{ //老人姓名搜索框发生变化
	    this.setState({ searchText: e.target.value });
	}
  handleSearchElderly=()=>{
    const { searchText,dataSource } = this.state;
	    if(searchText){
	      const reg = new RegExp(searchText, 'gi');
	      const data = this.state.dataSource.filter((record) =>record.name && record.name.match(reg));
	      this.setState({
	        data,
	      });
	    }else{
	       this.setState({data:dataSource})
	    }
  }
  render(){
    const {data,edit,id} = this.state;
    const columns = [{
      title: '序号',
      render: (text, record, index) => `${index+1}`,
      width: '5%',
      key:'index'
    }, {
      title: '老人姓名',
      dataIndex: 'name',
      key: 'name',
      width: '10%'
    },{
      title: '房间名称',
      dataIndex: 'roomName',
      key: 'roomName',
      width: '10%'
    },{
      title: '入院日期',
      dataIndex: 'checkInDate',
      key: 'checkInDate',
      render:(text,record)=>{
        return record.checkInDate && record.checkInDate.substr(0,10)
      },
      width: '10%'
    },{
      title: '上次结算日期',
      dataIndex:'endTime',
      key:'endTime',
      render:(text,record)=>{
      	const endTime = record.tbNursingItemRecoder&&record.tbNursingItemRecoder.endTime||'';
        return (
          edit && (record.id === id)?
          <DatePicker 
            allowClear={false}
            format="YYYY-MM-DD"
            onChange={(e) => this.changeHandler(record,e)}
          />:endTime?moment(endTime).format('YYYY-MM-DD'):'' 
        ) 
      },
      width:'10%'
    },{
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: '8%',
      render: (text, record) => {
        return(
          edit && (record.id === id)?
                <span>
                  <Button onClick={()=>{this.handleSave(record)}} icon="save" title="保存" size="small" type="primary"></Button>
                  <Divider type="vertical" />
                  <Button icon="poweroff" title="取消" size="small" type="primary" onClick={() => { this.handleCancle() }} ></Button>
                </span>
                :<Button icon="edit" title="编辑" size="small" type="primary"  onClick={() => { this.handleModify(record) }}></Button>
        )
      },
    }];
    return(
      <Fragment>
        <BreadcrumbCustom first="基础信息" second="护理费初始化" />
        <Card 
          title="护理费初始化列表" 
          bordered={false} 
           extra={
          	<Input.Group compact>
		            <Input 
		              placeholder="老人名字" style={{ width: 200 }}
		              value={this.state.searchText}
                  onChange={this.handleInputChange}
                  onPressEnter={this.handleSearchElderly}
		            />
		            <Button type="primary" style={{ width: '10%' }} icon="search" onClick={this.handleSearchElderly}></Button>
		        </Input.Group>
          }
        >
            <Table 
              rowKey='id' 
              dataSource={data} 
              columns={columns}
              pagination={{ defaultPageSize:10,showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50']}}
            />
          </Card>
      </Fragment>
    )   
  }
}

export default NursingInit;