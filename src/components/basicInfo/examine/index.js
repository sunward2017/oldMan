import React, {
	Component,
} from 'react';
import { Table, Card,Tag, Divider, Popconfirm, Button, Modal, Form, Input, Radio, Select,notification,Row,Col, Icon,InputNumber,Tree } from 'antd';
import BreadcrumbCustom from '@/components/BreadcrumbCustom';
import moment from 'moment';
import httpServer from '@/axios';


const DirectoryTree = Tree.DirectoryTree;
const TreeNode = Tree.TreeNode;
const RadioGroup = Radio.Group;
const { Option } = Select;
const { TextArea } = Input;

class examineConfig extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			modalFlag: false,
			record: '',
			pid:'',
			units:[],
			treeData:[],
		}
	}

	componentDidMount() {
		this.getDeptTree();
		this.getListParam();
	}
	componentWillUnmount(){
		this.setState = (state,callback)=>{
          return;
       }
	}
	List() {
		const {pid} = this.state;
		httpServer.listCheckItemChild({pid}).then(res => {
			if(res.data) {
				this.setState({
					dataSource: res.data
				})
			}else{
				this.setState({
					dataSource: []
				})
			}
		})
	}
	getListParam=()=>{
	     httpServer.listParam({type:'1'}).then((res)=>{
	      if (res.code === 200) {
	         res.data ? this.setState({ units: res.data }) : this.setState({ units: [], });
	      } else {
	        const args = {
	          message: '单位获取失败',
	          description: res.msg,
	          duration: 2,
	        };
	        notification.error(args);
	      }
	    }).catch((err)=>{
	      console.log(err);
	    });
	}
	 

	/*修改操作*/
	handleModify(record) {
		this.setState({
			modalFlag: true,
			record
		});
	}
	/*删除操作*/
	handleRowDelete(id, record) {
        const _this = this;
	    httpServer.deleteCheckItemChild({id}).then(res => {
	      if (res.code === 200) {
	        const args = {
	          message: '通信成功',
	          description: res.msg,
	          duration: 2,
	        };
	        notification.success(args);
	        _this.List();
	      }  
	      this.setState({modalFlag:false,record:''});
	    }).catch(
	      err => { console.log(err) }
	    )
	}
	/*添加按钮*/
	handleAdd() {
		if(!this.state.pid){
		   const args = {
			      message: '提示',
				  description:'请选择类别!',
				  duration: 2,
				};
		        notification.info(args);				
		}else{
			this.setState({
				modalFlag: true,
				record: ''
			});
		}
		
	}

	/*关闭弹框*/
	handleCancel() {
		this.setState({
			modalFlag: false,
			record: ''
		});
	}
	/*提交完成添加客户信息*/
	handleSubmit = (e) => {
		e.preventDefault();
		let _this = this;
		this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
			
			if(!err) {
				const values = {
					...fieldsValue,
					'pid':this.state.pid,
					'customerId': this.props.auth.customerId
				};
			  const { id }= this.state.record;
			  
              if(id){
              	    values.id = id;
					httpServer.updateCheckItemChild(values).then((res)=>{
			   	    	 
			   	    	const args = {
							message: '通信成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: false,
							record: ''
						});
						_this.List()
			   	    })
			   }else{
			   	   httpServer.saveCheckItemChild(values).then((res) => {
						const args = {
							message: '通信成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: false,
							record: ''
						});
						_this.List()
					})
			   	    
			   }

			}
		});
	}
    
	onSelect=(id)=>{
		this.setState({pid:id[0]},()=>{
			this.List()
		})
	}
    getDeptTree = () => {
	    httpServer.getDeptInfoTree().then(res => {
	      if(res.code === 200){
	       
	        res.data?this.setState({treeData:[res.data]}):this.setState({treeData:[]});
	      } else {
	        notification.error({
	          message: '通信失败',
	          description: res.msg,
	          duration: 2,
	        });
	        this.setState({treeData:[]});
	      }
	    }).catch(
	      err => { console.log(err) }
	    )
	  }
    renderTreeNodes = (data) => {
        
	    return data.map((item) => {
	      if (item.children) {
	        return (
	          <TreeNode title={item.departmentName} key={item.departmentId}  >
	            {this.renderTreeNodes(item.children)}
	          </TreeNode>
	        );
	      }
	      return <TreeNode title={item.departmentName} key={item.departmentId} />;
	    });
	}
	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		const {
			dataSource,
			modalFlag,
			customers,
			treeData,
			units,
		} = this.state;
		const {customerId} =this.props.auth;
		const {
			pid,
			itemCode,
			name,
			unit,
			price,
			memo,
		} = this.state.record;
		const formItemLayout = {
			labelCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 4
				},
			},
			wrapperCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 20
				},
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

		const columns = [{
			title: '序号',
			render: (text, record, index) => `${index+1}`,
			width: '5%',
			key:'index'
		},  {
			title: '编号',
			dataIndex: 'itemCode',
			key: 'itemCode',
			width: '5%'
		}, {
			dataIndex: 'name',
			title: '名称',
			key: 'name',
			width: '10%'
		}, {
			title: '单位',
			dataIndex: 'unit',
			key: 'unit',
			width: '5%',
			render:(t,r)=>{
			   const {units} = this.state;
			   const u= units.find(i=>(i.id==t));
			   return u?u.value:'次'
			}
			 
		},{
			title:'描述',
			dataIndex:'memo',
			key:'memo',
			width:'10%'
		},  {
			title:'价格',
			dataIndex:'price',
			key:'price',
			width:'10%'
		}, {
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			width: '8%',
			render: (text, record) => {
				return(
					<span>
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
		        <BreadcrumbCustom first="基础信息" second='收费护理项' />
        		<Card 
		          title="检查项信息"
		          bordered={false} 
		          extra={<Button type="primary" onClick={()=>{this.handleAdd()}} >新增</Button>}
		        >
	        	<Row>
           			<Col span={4}>
	                     <DirectoryTree
					        defaultExpandAll
					        onSelect={this.onSelect}
					      >
	                        { treeData&&this.renderTreeNodes(treeData) }
	                    </DirectoryTree>
					</Col>
		           <Col span={20} style={{padding:'0 0 0 20px'}}>
		                <Table 
				            bordered
				            rowKey='id' 
				            dataSource={dataSource} 
				            columns={columns} 
				            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50','100','200']}}
				          />
		           </Col>
                </Row>
                </Card>
       
		        {
		          modalFlag?
		          <Modal 
		            title="检查信息输入"
		            // width='60%'
		            okText='提交'
		            visible={modalFlag}
		           
		            onCancel={()=>{this.handleCancel()}}
		            maskClosable={false}
		            footer={null}
		          >
		            <Form hideRequiredMark onSubmit={this.handleSubmit}>
		              <Form.Item
		                label='编号'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('itemCode', {
		                  rules: [{ required: true, message: '请输入编号!' }],
		                  initialValue:itemCode
		                })(
		                  <Input/>
		                )}
		              </Form.Item>
		              <Form.Item
		                label='名称'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('name', {
		                  rules: [{ required: true, message: '请输入名称!' }],
		                  initialValue:name,
		                })(
		                  <Input />
		                )}
		              </Form.Item>
		              <Form.Item
		                label='单位'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('unit', {
		                  rules: [{ required: true, message: '请选择单位!' }],
		                  initialValue:unit,
		                })(<Select>
						        {
						           units.length>0&&units.map((item,index)=>(<Option key={item.id} value={item.id}>{item.value}</Option>))
						        }
						    </Select>
		                )}
		              </Form.Item>
		              <Form.Item
		                label='描述'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('memo', {
		                  rules: [{ required: true, message: '请输入描述!' }],
		                  initialValue:memo,
		                })(
		                   <TextArea rows={4} />
		                )}
		              </Form.Item>
		              <Form.Item
		                label='价格'
		                {...formItemLayout}
		                style={{marginBottom:'4px'}}
		              >
		                {getFieldDecorator('price', {
		                  rules: [{ required: true, message: '请输入价格!' }],
		                  initialValue:price||0,
		                })(
		                   <InputNumber style={{width:'50%'}}/>
		                )}&emsp;元 
		              </Form.Item>
		              
		              <Form.Item {...tailFormItemLayout}>
		                <Button type="primary" htmlType="submit">确认提交</Button>
		              </Form.Item>
		            </Form>
		          </Modal>:null
		        }
            </div>
		)
	}
}
const ExamineConfig = Form.create()(examineConfig);
export default ExamineConfig;