import React , { Component , Fragment } from 'react';
import httpServer from '../../../axios';
import {Button,Input,DatePicker,Form,Modal,Tree,Icon,notification,Select,Row,Col} from 'antd';
import moment from 'moment';

const Option = Select.Option;
const { TreeNode } = Tree;
class Search extends Component{
  constructor(props){
    super(props);
    this.state = {
      modalFlag1:false,
      rq1: moment().subtract('days',60),
      rq2: moment(),
      listAreaInfo:props.listAreaInfo,
      optionsList:[],
      selectValue:null,
    }
    this.handleModalVisiable = this.handleModalVisiable.bind(this);//单击使modal可见
    this.handleModalAreaCancel = this.handleModalAreaCancel.bind(this);//使区域选择弹框不可见
    this.handleModalCancel = this.handleModalCancel.bind(this);//使查询界面弹出框不可见
    this.onSelect = this.onSelect.bind(this);//单击选中树节点中的楼层
    this.handleSelectChange = this.handleSelectChange.bind(this);//房间名称发生变化
    this.handleChangeRq1 = this.handleChangeRq1.bind(this);
    this.handleChangeRq2 = this.handleChangeRq2.bind(this);
    this.handleStart = this.handleStart.bind(this);//开始查询
  }

  handleModalVisiable(){//单击使modal可见
    this.setState({modalFlag1:true});
  }
  handleModalAreaCancel(){//使区域选择弹框不可见
    this.setState({modalFlag1:false});
  }
  handleModalCancel(){//使查询界面弹出框不可见
    this.props.handleClickInquireCancle();
  }
  handleSelectChange(value){
    this.setState({selectValue:value});
  }

  handleChangeRq1(date,dateString){//查询起始时间发生变化
   this.setState({rq1:date});
  }
  handleChangeRq2(date,dateString){//查询结束时间发生变化
   this.setState({rq2:date});
  }

  handleStart(){
    const {selectValue,rq1,rq2} = this.state;
    if(!(rq1 && rq2)){
      notification.warning({
        message: '提示：',
        description: '请查看起始时间、结束时间是否填写',
      });
      return false
    }
    const params = {};
    params.rq1 = moment(rq1).format('YYYY-MM-DD');
    params.rq2 = moment(rq2).format('YYYY-MM-DD');
    if(selectValue !== null){
      params.roomCode = selectValue;
    }
    this.props.getListRegWaterKwh(params);
    this.props.handleClickInquireCancle();
  }

  renderTreeNodes = data => data.map((item) => { //区域数渲染
    if (item.children && item.children.length>0) {
      return (
        <TreeNode title={item.areaName} key={item.areaCode} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode title={item.areaName} key={item.areaCode} dataRef={item} icon={<Icon type="check-circle" theme="twoTone" twoToneColor="#52c41a"/>}/>;
  })

  onSelect(selectedKeys,info){ //单击树节点
    const {customerId} = this.props;
    if(info.selectedNodes&&info.selectedNodes.length>0){
    	const areaId = info.selectedNodes[0].props.dataRef.id;
	    httpServer.listRoomInfo({customerId,areaId}).then((res)=>{
	      if (res.code === 200) {
	        res.data?this.setState({optionsList:res.data,modalFlag1:false,selectValue:null}):this.setState({optionsList:[],modalFlag:false,selectValue:null});
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
    }else{
    	      const args = {
	            message: '区域错误',
	            description:'请选择一个区域',
	            duration: 2,
	          };
	          notification.error(args);
    }
    
  }
  render(){
    const {rq1,rq2,modalFlag1,listAreaInfo,optionsList,selectValue} = this.state;
    return(
      <Modal 
        title="查询界面"
        visible={true}
        onCancel={this.handleModalCancel}
        footer={null}
        width="600px"
      >  
      <Row gutter={16}>
        <Col span={10}>
            <Tree 
                defaultExpandAll
                onSelect={this.onSelect}
                showIcon={false}
            >
                {this.renderTreeNodes(listAreaInfo)}
            </Tree>
        </Col>
        <Col span={14}>
	        <Form>
	          <Form.Item
	            label='选择房间'
	            style={{marginBottom:'10px'}}
	          >
	            <Select   placeholder="选择房间" value={selectValue} onChange={this.handleSelectChange}>
	              {optionsList&&optionsList.map(item => <Option key={item.roomUuid}>{item.roomName}</Option>)}
	            </Select>
	          </Form.Item>
	          <Form.Item
	            label='抄表起始日期'
	            style={{marginBottom:'10px'}}
	            required
	          >
	            <DatePicker format='YYYY-MM-DD' value={rq1?moment(rq1,'YYYY-MM-DD'):null}  onChange={this.handleChangeRq1} allowClear={false} style={{width:'100%'}} />
	          </Form.Item>
	          <Form.Item
	            label='抄表结束日期'
	            style={{marginBottom:'10px'}}
	            required
	          >
	            <DatePicker format='YYYY-MM-DD' value={rq2?moment(rq2,'YYYY-MM-DD'):null} onChange={this.handleChangeRq2} allowClear={false} style={{width:'100%'}} />
	          </Form.Item>
	          <Form.Item >
	            <Button type="primary" onClick={this.handleStart}>查询</Button>
	            <Button type="primary" onClick={this.handleModalCancel}>取消</Button>
	          </Form.Item>
	        </Form>
        </Col>
        </Row>
      </Modal>
    )
  }
}

export default Search;


