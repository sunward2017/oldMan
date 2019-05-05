import React, {
	Component,
} from "react";
import { Table, Card,Tag, Divider, Popconfirm, Button, Modal, Form, Input, Radio, notification,InputNumber} from "antd";
import BreadcrumbCustom from "../BreadcrumbCustom";
 
import httpServer from "@/axios/index";

const RadioGroup = Radio.Group;

const formItemLayout = {
			labelCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 6
				},
			},
			wrapperCol: {
				xs: {
					span: 24
				},
				sm: {
					span: 18
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
		
class Grade extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			modalFlag: false,
			record: "",
			iconLoading:false,
			customerId:"",
			 
		}
	}
	
	componentDidMount() {
		const {customerId} = this.props.auth;
		 this.setState({customerId},()=>{
		 	this.List()
		 })
	}
	 
	componentWillUnmount(){
		this.setState = (state,callback)=>{
          return;
       }
	}
	List() {
		const customerId = this.state.customerId;
		httpServer.listEstimateGrade({customerId}).then(res => {
			if(res.code===200&&res.data) {
				this.setState({
					dataSource: res.data
				})
			}else{
			    this.setState({
					dataSource:[]
				})
			}
		})
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
	    httpServer.deleteEstimateGrade({id}).then(res => {
	      if (res.code === 200) {
	        const args = {
	          message: "删除成功",
	          description: res.msg,
	          duration: 2,
	        };
	        notification.success(args);
	        _this.List();
	      } else {
	        console.log(res.message);
	      }
	      this.setState({modalFlag:false,record:""});
	    }).catch(
	      err => { console.log(err) }
	    )
	}
	/*添加按钮*/
	handleAdd() {
		this.setState({
			modalFlag: true,
			record: ""
		});
	}

	/*关闭弹框*/
	handleCancel() {
		this.setState({
			modalFlag: false,
			record: ""
		});
	}
	
	/*提交完成添加客户信息*/
	handleSubmit = (e) => {
		e.preventDefault();
		let _this = this;
		this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
		    this.setState({ iconLoading: true });
			if(!err) {
				const values = {
					...fieldsValue,
					"customerId": this.state.customerId
				};
			  const { id }= this.state.record;
              if(id){
              	    values.id = id;
					httpServer.updateEstimateGrade(values).then((res)=>{
			   	    	 
			   	    	const args = {
							message: "通信成功",
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: false,
							record: "",
							iconLoading:false,
						});
						_this.List()
			   	    })
			   }else{
			   	   httpServer.saveEstimateGrade(values).then((res) => {
						const args = {
							message: "通信成功",
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: false,
							record: "",
							iconLoading:false,
						});
						_this.List()
					})
			   	    
			   }

			}else{
				this.setState({ iconLoading: false });
			}
		});
	}

	 

	render() {
		const {
			getFieldDecorator
		} = this.props.form;
		const {
			dataSource,
			modalFlag
		} = this.state;
		const {
			estimateGradeName,
			lowScore,
			highScore,
			status,
		} = this.state.record;
		

		const columns = [{
			title: "序号",
			render: (text, record, index) => `${index+1}`,
			width: "5%",
			key:"index"
		}, {
			title: "评估等级名称",
			dataIndex: "estimateGradeName",
			key: "estimateGradeName",
			 
		},{
			title: "评估分值（低）",
			dataIndex: "lowScore",
			key: "lowScore",
			width: "20%"
		}, {
			title: "评估分值（高）",
			dataIndex: "highScore",
			key: "highScore",
			width: "20%"
		},{
			title: "状态",
			dataIndex: "status",
			key: "status",
			render: (text, record) =>{
				return record.status === 1 ? <Tag color = "green">使用</Tag>:<Tag color="red">禁用</Tag >
			},
			width: "10%"
		}, {
			title: "操作",
			dataIndex: "action",
			key: "action",
			width: "10%",
			render: (text, record) => {
				return(
			<span>
              <a href="javascript:;" onClick={() => { this.handleModify(record) }} style={{color:"#2ebc2e"}} >修改</a>
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
                <a href="javascript:;" style={{color:"#2ebc2e"}}>删除</a>
              </Popconfirm>
          </span>
				)
			},
		}];
		return(
		<div>
            <BreadcrumbCustom first="基础信息" second="评估等级" />
	        <Card 
		        title="评估等级"
		        bordered={false} 
		        extra={<Button type="primary" onClick={()=>{this.handleAdd()}}>新增</Button>}
		    >
		        <Table 
		            bordered
		            rowKey="id" 
		            dataSource={dataSource} 
		            columns={columns} 
		            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:["10","20","30","40","50","100","200"]}}
		        />
	        </Card>
        {
          modalFlag?
          <Modal 
            title="信息输入"
            // width="60%"
            okText="提交"
            visible={modalFlag}
            onCancel={()=>{this.handleCancel()}}
            maskClosable={false}
            footer={null}
          >
            <Form hideRequiredMark onSubmit={this.handleSubmit}>
              <Form.Item
                label="评估等级名称"
                {...formItemLayout}
                style={{marginBottom:"4px"}}
              >
                {getFieldDecorator("EstimateGradeName", {
                  rules: [{ required: true, message: "请输入评估等级名称"}],
                  initialValue:estimateGradeName
                })(
                  <Input />
                )}
              </Form.Item>
               
              <Form.Item
                label="分值范围(低)"
                {...formItemLayout}
                style={{marginBottom:"4px"}}
              >
                {getFieldDecorator("lowScore", {
                  rules: [{ required: true, message: "请输入分值低范围" }],
                  initialValue:lowScore,
                })(
                  <InputNumber min={1} />
                )}
              </Form.Item>
              <Form.Item
                label="分值范围(高)"
                {...formItemLayout}
                style={{marginBottom:"4px"}}
              >
                {getFieldDecorator("highScore", {
                  rules: [{ required: false, message: "请输入分值高范围" }],
                  initialValue:highScore,
                })(
                  <InputNumber min={1} />
                )}
              </Form.Item> 
              <Form.Item
                label="状态"
                {...formItemLayout}
                style={{marginBottom:"4px"}}
              >
                {getFieldDecorator("status", {
                  rules: [{ required: true, message: "请选择状态!" }],
                  initialValue:status,
                })(
                  <RadioGroup>
                    <Radio value={1}>使用</Radio>
                    <Radio value={0}>禁用</Radio>
                  </RadioGroup>
                )}
              </Form.Item>
              <Form.Item {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit" loading={this.state.iconLoading} >确认提交</Button>
              </Form.Item>
            </Form>
          </Modal>:null
        }
      </div>
		)
	}
}
const Nurse = Form.create()(Grade);
export default Nurse;