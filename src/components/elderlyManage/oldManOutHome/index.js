import React, {Component,Fragment} from 'react';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios';
import {Row,Popconfirm,notification,Col,Input,Button,Table,Divider,Card,Tooltip} from 'antd';
import { Link } from 'react-router-dom';
import FeeList from './feeList';
import moment from 'moment'
import ElderlyInfo from '@/common/elderlyInfo'

const Search = Input.Search;
class OldManOutHome extends Component{
  constructor(props){
    super(props);
    this.state = {
      pageFlag:true,
      customerId:'',
      oldManList:[],//老人列表数据
      oldManList_copy:[],//老人列表数据拷贝
      searchText:'',
      f1:0,//检查护理费：
      f2:0,//餐费
      f3:0,//水电费
      f4:0,//住宿费
      f5:0,//药费
      feeList1:[],
      feeList2:[],
      feeList3:[],
      feeList4:[],
      feeList5:[],
      feeData:{},
      record:'',
      modalFlag:false,
      elderly:{},
      gradeObj:{},
      meelObj:{},
    }
    this.handleInputChange = this.handleInputChange.bind(this);//老人信息搜索框发生变化
    this.handleSearchElderly = this.handleSearchElderly.bind(this);//搜索老人信息
    this.handleClickReset = this.handleClickReset.bind(this);//清楚搜索条件
    this.handleGoback = this.handleGoback.bind(this);//返回
  }
  componentDidMount(){
    //获取入院老人信息列表
    this.getListElderlyInfo();
    this.getNursingGrade();
    this.getPayItemChild()
  }
  getPayItemChild(){
    httpServer.selectPayItemChild().then((res)=>{
      if (res.code === 200) {
         if(res.data&&res.data){
         	let obj = {};
         	res.data.forEach(k=>{
         		obj[k.itemCode]=k.name;
         	})
        	this.setState({
        		meelObj:obj
        	})
        }
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
  getNursingGrade(){
    httpServer.listNursingGrade().then((res) => {
      if (res.code === 200) {
        if(res.data){
        	let obj = {};
         	res.data.forEach(k=>{
         		obj[k.nursingGradeCode]=k.nursingGradeName
         	})
        	this.setState({
        		gradeObj:obj
        	})
        }
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
    }).catch((error) => {
      console.log(error);
    });
  }
  //获取入院老人信息列表
  getListElderlyInfo(){
    const {customerId} = this.props.auth;
    this.setState({customerId});
    httpServer.listElderlyInfo({listStatus:"3",customerId,launchFlag:1}).then((res) => {
      if (res.code === 200) {
        res.data?this.setState({oldManList:res.data,oldManList_copy:res.data}):this.setState({oldManList:[],oldManList_copy:[]});
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
    }).catch((error) => {
      console.log(error);
    });
  }

  handleOutHomeCancel(record){//取消出院申请
    const {id} = record;
    httpServer.cancelOutHomeInfo({id}).then((res) => {
      if (res.code === 200) {
        const args = {
            message: '通信成功',
            description: res.msg,
            duration: 2,
          };
          notification.success(args);
          this.getListElderlyInfo();
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
    }).catch((error) => {
      console.log(error);
    });
  }
  //搜索老人信息相关操作
  handleInputChange(e){ //搜索框数据发生变化
    this.setState({searchText:e.target.value});
  }
  handleSearchElderly(){//搜索老人信息
    const { searchText } = this.state;
    if(searchText){
      const reg = new RegExp(searchText, 'gi');
      this.setState({
        oldManList_copy: this.state.oldManList.map((record) => {
          const match = record.name && record.name.match(reg);
          if (!match) {
            return null;
          }
          return record;
        }).filter(record => !!record),
      });
    }else{
    	const {oldManList} = this.state;
      this.setState({oldManList_copy:oldManList})
    }
  }
  handleClickReset(){//清楚搜索条件
    this.setState({
      oldManList_copy:this.state.oldManList,
      searchText:'',
    });
  }

  //返回
  handleGoback(){
    this.setState({pageFlag:true});
  }

  //获取检查护理费
  getListNursingAndCheckItem(elderlyId){
    const {customerId} = this.state;
    httpServer.listNursingAndCheckItem({customerId,elderlyId}).then((res)=>{
      if(res.code === 200){
        res.data?this.setState({f1:res.data.money,feeList1:res.data.data}):this.setState({f1:0,feeList1:[]});
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
  //获取餐费
  getListMealFeeList(elderlyId){
    const {customerId} = this.state;
    httpServer.listMealFeeList({customerId,elderlyId}).then((res)=>{
      if(res.code === 200){
        res.data?this.setState({f2:res.data.money,feeList2:res.data.data}):this.setState({f2:0,feeList2:[]});
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
  //水电费
  getListWaterRecoder(elderlyId){
    const {customerId} = this.state;
    httpServer.listWaterRecoder({customerId,elderlyId}).then((res)=>{
      if(res.code === 200){
        res.data?this.setState({f3:res.data.money,feeList3:res.data.data}):this.setState({f3:0,feeList3:[]});
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
  //住宿费
  getListRoomFeeList(elderlyId){
    const {customerId} = this.state;
    httpServer.listRoomFeeList({customerId,elderlyId}).then((res)=>{
      if(res.code === 200){
        res.data?this.setState({f4:res.data.money,feeList4:res.data.data}):this.setState({f4:0,feeList4:[]});
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
  //药费
  getListDrugFeeList(elderlyId){
    const {customerId} = this.state;
    httpServer.listDrugFeeList({customerId,elderlyId}).then((res)=>{
      if(res.code === 200){
        res.data?this.setState({f5:res.data.money,feeList5:res.data.data}):this.setState({f5:0,feeList5:[]});
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
  //查看、取消出院申请相关操作
  handleClickRead(record){
    this.setState({record});
    const {id} = record;
    this.getListNursingAndCheckItem(id);
    this.getListMealFeeList(id);
    this.getListWaterRecoder(id);
    this.getListRoomFeeList(id);
    // this.getListDrugFeeList(id);
    this.fetchElderlyBalance(id);
    this.setState({pageFlag:false});
  }
  fetchElderlyBalance(id){
        httpServer.getMoneyInfo({elderlyId:id}).then(res => {
            if(res.code === 200){
            	this.setState({feeData:res.data || {}})
            }else{
            	const args = {
			          message: '失败',
			          description: res.msg,
			          duration: 2,
			        };
			        notification.error(args); 
            }
        })
  }
  lookAt=(r)=>{
    	this.setState({modalFlag:true,elderly:r})
  }
  render(){
    const {feeData,pageFlag,oldManList_copy,customerId,f1,f2,f3,f4,f5,feeList1,feeList2,feeList3,feeList4,feeList5,record,modalFlag,elderly,gradeObj,meelObj} = this.state;
    const columns = [{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      key:'serialNumber',
      width:'8%'
    },{
      title:'入院编号',
      dataIndex: 'elderlyNo',
      key: 'elderlyNo',
      width:'10%'
    },{
      title: '老人姓名',
      dataIndex: 'name',
      key: 'name',
      width:'12%'
    },{
      title: '房号',
      dataIndex: 'roomName',
      key: 'roomName',
      width:'12%'
    },{
      title:'出院原因',
      dataIndex: 'reason',
      key: 'reason',
      width:'20%',
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
      title:'出院日期',
      dataIndex: 'outDay',
      render:(text,record)=>{
        return moment(text).format('YYYY-MM-DD')
      },
      width:'20%'
    },{
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      align:'center',
      render:(text,record)=>{
        return(
          <span>
            <Button type="primary" size="small" icon="read" title="基本信息" onClick={() => { this.lookAt(record)}}></Button>
            <Divider type='vertical' />
            <Button type="primary" size="small" icon="dollar" title="费用明细"  onClick={() => { this.handleClickRead(record) }}></Button>
            <Divider type="vertical" />
            <Popconfirm title="是否取消" onConfirm={() => this.handleOutHomeCancel(record)}>
                <Button type="primary" size="small" icon="stop" title="取消出院"></Button>
            </Popconfirm>
            <Divider type="vertical" />
            <Link to={{ pathname:"/app/pension-agency/processAudit/leaveAudit"}}><Button type="primary" size="small" icon="highlight" title="签字审核" ></Button></Link>
          </span>
        )
      }
    }];
    return(
      <Fragment>
        <BreadcrumbCustom first="老人管理" second="出院管理" />
        {
          pageFlag?
          <Row>
              <Card bordered={false} title="老人列表" extra={<Search
							      placeholder="请输入关键字"
							      onChange={this.handleInputChange}
							      value={this.state.searchText}
							      onSearch={this.handleSearchElderly}
							      style={{ width: 200 }}
							      enterButton
							    />}>
                <Table 
                  size="middle"
                  dataSource={oldManList_copy} 
                  columns={columns} 
                  pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50']}}
                  rowKey={record => record.id}
                />
              </Card>
          </Row>:
          <FeeList 
            f1={f1}
            f2={f2}
            f3={f3}
            f4={f4}
            f5={f5}
            feeList1={feeList1}
            feeList2={feeList2}
            feeList3={feeList3}
            feeList4={feeList4}
            feeList5={feeList5}
            handleGoback={this.handleGoback}
            feeData={feeData}
            record={record}
          />
          
        }
         <ElderlyInfo visible={modalFlag} data={elderly} close={()=>{this.setState({modalFlag:false})}} gradeObj={gradeObj} meelObj={meelObj}/>
      </Fragment>
    )
  }
}

export default OldManOutHome;