import React , {Component,Fragment} from 'react';
import {Button,Table,Divider,Popconfirm,Modal,Form,Input,Select,notification,InputNumber,TreeSelect,Card,Tag} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios';

const Option = Select.Option;
const SHOW_PARENT = TreeSelect.SHOW_PARENT;
const TreeNode = TreeSelect.TreeNode;
let areaTree ={}
class ReductionMonth extends Component{
  constructor(props){
    super(props);
    this.state = {
      dataSource:[],
      modalFlag:false,
      data:{},
      action:'',
      flag:false,
      treeData:[],
    }
    this.handleAdd = this.handleAdd.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount(){
    this.fetchElderlyRoomTree()
  }

  getDiscountMonthList(){
    const {customerId} = JSON.parse(sessionStorage.getItem('auth'));
    httpServer.listDiscountMonth({customerId}).then((res)=>{
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
    }).catch((error)=>{
      console.log(error);
    });
  }

  //Form表单发生变化
  handleIptText(target,e) {
    let data = Object.assign({},this.state.data);
    data[target] = e.target ? e.target.value : e;
    this.setState({data});
  }

  //关闭modal
  handleCancel(){
    this.setState({modalFlag:false});
  }

  //添加
  handleAdd(){
    this.setState({modalFlag:true,action:'',data:{},flag:false,});
  }

  //修改
  handleModify(record){
    this.setState({modalFlag:true,action:'',data:record,flag:false,});
  }

  //查看
  handleRead(record){
    this.setState({modalFlag:true,action:'read',data:record,flag:true,});
  }

  //删除
  handleRowDelete(id){
    httpServer.deleteDiscountMonth({id},{headers: {'Content-Type': 'application/x-www-form-urlencoded'}}).then((res)=>{
           if (res.code === 200) {
              const args = {
                message: '通信成功',
                description: res.msg,
                duration: 2,
              };
              notification.success(args);
              this.getDiscountMonthList();
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

  //提交表单
  handleSubmit(){
    const {action} = this.state;
    if(action !== 'read'){
      this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
        if(!err){
	       	 const {id }= this.state.data;
	       	 let values = {...fieldsValue,areaIds:fieldsValue['areaIds'].join(',')};
	       	 let url = 'saveDiscountMonth';
	       	 if(id){
	       	 	 values.id = id;
	       	 	 url = 'updateDiscountMonth';
	       	 }
	       	 httpServer[url](values).then((res)=>{
	           if (res.code === 200) {
	              const args = {
	                message: '通信成功',
	                description: res.msg,
	                duration: 2,
	              };
	              notification.success(args);
	              this.getDiscountMonthList();
	              this.handleCancel();
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
      })
    }else{
      this.handleCancel();
    }

  }
  fetchElderlyRoomTree(){
        httpServer.listAreaInfo({customerId:this.customerId}).then(res => {
            const data= res.data?[res.data]:[]
            this.setState({treeData:data},function(){
             	 this.getArea(data)
             	 this.getDiscountMonthList();
            })
        })
  }
  
   getArea = data => data.map(item => {
        if (item.children) {
        	 areaTree[item.areaCode] = item.areaName
           this.getArea(item.children)
        }else{
        	  areaTree[item.areaCode] = item.areaName;
        }
  });
  renderTreeNodes = data => data.map(item => {
  	    
        if (item.children) {
        	 areaTree[item.areaCode] = item.areaName
            return (
                <TreeNode title={item.areaName} key={item.id} value={item.areaCode}>
                    {this.renderTreeNodes(item.children)}
                </TreeNode>
            );
        }
        areaTree[item.areaCode] = item.areaName;
        return <TreeNode title={item.areaName} key={item.id} value={item.areaCode} />;
    });
  render(){
    const {dataSource,modalFlag,flag,treeData} = this.state;
    const { year, month,areaIds } = this.state.data;
    const months = [{value:1},{value:2},{value:3},{value:4},{value:5},{value:6},{value:7},{value:8},{value:9},{value:10},{value:11},{value:12}];
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 5 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 19 },
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
    const {  getFieldDecorator } = this.props.form;
    const columns = [{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      key:'serialNumber',
      width:'5%'
    },{
    	title:'区域',
    	dataIndex: 'areaIds',
      key: 'areaIds',
      render:(t,r)=>{
      	   
      	  return t&&t.split(',').map(i=>(<Tag key={i} color="magenta">{areaTree[i]}</Tag>))
      }
    },{
      title: '年份',
      dataIndex: 'year',
      key: 'year',
      width:'10%'
    },{
      title:'月份',
      dataIndex: 'month',
      key: 'month',
      width:'10%'
    },{
      title:'创建日期',
      dataIndex: 'addtime',
      key: 'addtime',
      width:'20%'
    },{
      title:'操作',
      dataIndex:'action',
      key:'action',
      width:'16%',
      align:'center',
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
      <Fragment>
        <BreadcrumbCustom first="基础信息" second="水费减免月" />
        <Card 
          title="水费减免月"
          bordered={false} 
          extra={<Button type="primary" onClick={this.handleAdd}>新增</Button>}
        >
	        <Table
	          dataSource={dataSource} 
	          columns={columns} 
	          pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50']}}
	          rowKey={record => record.id}
	        />
        </Card>
        {
          modalFlag?<Modal
                      title="水费减免月信息"
                      visible={true}
                      onCancel={this.handleCancel}
                      maskClosable = {false}//点击遮罩层不允许关闭
                      footer = {null}
                    >
                      <Form hideRequiredMark >
                       <Form.Item
                          label='区域'
                          {...formItemLayout}
                          style={{marginBottom:'4px'}}
                        >
                        {getFieldDecorator("areaIds", {
				                  rules: [{ required: true, message: "请选择区域"}],
				                  
				                })(
                           <TreeSelect className="w-full"
                                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                                treeDefaultExpandedKeys={['1']}
                                treeCheckable="true"
                                showCheckedStrategy={SHOW_PARENT}
                                searchPlaceholder="选择楼层房间" >
                                {this.renderTreeNodes(treeData)}
                            </TreeSelect>
                          ) 
                        }  
                        </Form.Item>
                        <Form.Item
                          label='年份'
                          {...formItemLayout}
                          style={{marginBottom:'4px'}}
                        >
                        {getFieldDecorator("year", {
				                  rules: [{ required: true, message: "请输入年份"}],
				                  initialValue:year
				                })(
                          <InputNumber   disabled={flag} style={{width:"100%"}} />
                         ) 
                        }
                        </Form.Item>
                        <Form.Item
                          label='月份'
                          {...formItemLayout}
                          style={{marginBottom:'4px'}}
                        >
                        {getFieldDecorator("month", {
				                  rules: [{ required: true, message: "请输入月份"}],
				                  initialValue:month
				                })(
                          <Select disabled={flag} >
                            {
                              months.map((item)=>{
                                return <Option key={item.value} >{item.value}</Option>
                              })
                            }
                          </Select>
                        )
				                }
                        </Form.Item>
                        
                        <Form.Item {...tailFormItemLayout}>
                          <Button type="primary" onClick={this.handleSubmit}>确认</Button>
                        </Form.Item>
                      </Form>
                    </Modal>:null 
        }
      </Fragment>
    )
  }
}

export default Form.create()(ReductionMonth);