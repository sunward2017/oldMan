 import React, {
	Component,
	Fragment
} from 'react';
import { Table, Card,Tag, Divider, Popconfirm, Button, Modal, Form, Input, DatePicker, Radio, Select,notification,Upload,message,Icon} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import moment from 'moment';
import httpServer from '@/axios/index';
import reqwest from 'reqwest'
import {host} from '@/axios/config'

const RadioGroup = Radio.Group;
const Dragger = Upload.Dragger;

class CMT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			dataSource: [],
			modalFlag: false,
			record:{},
			iconLoading:false,
			fileList:[],
			fileName:'',
			elderlyId:'',
			elderlyName:'',
		}
	}
	
	componentDidMount() { 
	   console.log(this.props)
	   const {id,name} = this.props.match.params;
	   this.setState({elderlyId:id,elderlyName:name},()=>{
	   	   this.List();
	   })
	}
	
	List() {
	    const {elderlyId} = this.state;
		httpServer.listHealthInfo({elderlyId}).then(res => {
			if(res.code===200) {
				const data=res.data||[]
				this.setState({
					dataSource:data
				})
			}
		})
	}
	 
	/*修改操作*/
	handleModify(record) {
		const fileList = record.dataUrl?record.dataUrl.split(',').map((i,k)=>({uid:k,name:i.split('^')[1],url:i.split('^')[0]})):[];
		this.setState({
			modalFlag: true,
			record,
			fileList,
		});
	}
	/*删除操作*/
	handleRowDelete(id, record) {
        const _this = this;
	    httpServer.deleteHealthInfo({id}).then(res => {
	      if (res.code === 200) {
	        const args = {
	          message: '通信成功',
	          description: res.msg,
	          duration: 2,
	        };
	        notification.success(args);
	        _this.List();
	      } else {
	        console.log(res.message);
	      }
	      this.setState({modalFlag:false,record:''});
	    }).catch(
	      err => { console.log(err) }
	    )
	}
	/*添加按钮*/
	handleAdd() {
		this.setState({
			modalFlag: true,
			fileList:[],
			record:{}
		});
	}

	/*关闭弹框*/
	handleCancel() {
		this.setState({
			modalFlag: false, 
		});
	}
	/*提交完成添加客户信息*/
	handleSubmit = (e) => {
		e.preventDefault();
		let _this = this;
		this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
			if(!err) {
				this.setState({ iconLoading: true });
				const {elderlyId} = this.state;
				const optId = this.props.auth.id;
				const values = {
					...fieldsValue,
					elderlyId,
					optId,
					'dataUrl':this.state.fileList.map(i=>(i.url+'^'+i.name)).join(',')
				};
			  const { id }= this.state.record;
              if(id){
              	    values.id = id;
					httpServer.updateHealthInfo(values).then((res)=>{
			   	    	const args = {
							message: '通信成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: false,
							record: '',
							iconLoading:false,
						});
						_this.List()
			   	    })
			   }else{
			   	   httpServer.saveHealthInfo(values).then((res) => {
						const args = {
							message: '通信成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: false,
							record: '',
							iconLoading:false,
						});
						_this.List()
					})
			   	    
			   }

			}
		});
	}
    normFile = (e) => {
       const names = e.fileList.map(i=>(i.name));
	   return  names.join(',');
	}
   handleUpload=(info)=>{
   	 if(info.file.status==='removed'){
   	 	 this.setState((state) => {
          const index = state.fileList.indexOf(info.file);
          const newFileList = state.fileList.slice();
          newFileList.splice(index, 1);
          return {
            fileList: newFileList,
          };
        });
        return;
   	 }
     const formData = new FormData();
     formData.append('file', info.file);
     reqwest({
          url: host.api+'/uploadFile',
	      method: 'post',
	      processData: false,
	      data: formData,
	      success: (res) => {
	        message.success('文件上传成功');
	        const data = res.data.split('.');
	        const obj = {
	          uid:data[0],
	          name:info.file.name,
	          url:host.api+'/upload/'+res.data,
	        }
	        const fileList = this.state.fileList;
	        fileList.push(obj);
	        this.setState({fileList})
	      },
	      error: () => {
	        message.error('文件上传失败');
	      },
	    });
    }
	render() {
		const {
			dataSource,
			modalFlag,
			record,
			fileList,
			elderlyName,
		} = this.state;
	    const props = {
			  onChange:this.handleUpload,
			  beforeUpload: (file) => {return false},
              fileList,			  
			};
		const {
			getFieldDecorator
		} = this.props.form;
		
		const {
			dataUrl,
			dataName
		} = this.state.record;
		const optName = this.props.auth.name;
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

		const columns = [{
			title: '序号',
			render: (text, record, index) => `${index+1}`,
			width: '5%',
			key:'index'
		}, {
			title: '老人',
			dataIndex: 'elderlyName',
			key: 'elderlyName',
			width: '10%',
			render:(t,r)=>{
				return this.state.elderlyName
			}
		},{
			title: '档案名称',
			dataIndex:'dataName',
			key:'dataName',
			width:'8%'
		},{
			title:'建档日期',
			dataIndex:'addtime',
			key:'addtime',
			width:'15%',
			render:(t,r)=>{
				return moment(t).format('YYYY-MM-DD HH:mm');
			}
		},{
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
            <BreadcrumbCustom first="医护管理" second='健康档案' />
            <Card 
		        title="历史档案" 
		        bordered={false} 
		        extra={<Button type="primary" onClick={()=>{this.handleAdd()}} >新建档案</Button>}
		    >
	          <Table 
	            bordered
	            rowKey='id' 
	            dataSource={dataSource} 
	            columns={columns} 
	            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50','100','200']}}
	          />
          </Card>
        {
          modalFlag?
          <Modal 
            title="健康档案存档"
            okText='提交'
            visible={modalFlag}
            onCancel={()=>{this.handleCancel()}}
            maskClosable={false}
            footer={null}
          >
            <Form hideRequiredMark onSubmit={this.handleSubmit}>
              <Form.Item
                label='老人姓名'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('elderlyId', {
                  rules: [{ required: true, message: '请输入甲方!' }],
                  initialValue:elderlyName,
                })(
                  <Input disabled/>
                )}
              </Form.Item>
              <Form.Item
                label='建档人'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('optId', {
                  rules: [{ required: true, message: '请输入乙方'}],
                  initialValue:optName
                })(
                  <Input disabled/>
                )}
              </Form.Item>
              <Form.Item
                label='档案名称'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('dataName', {
                  rules: [{ required: true, message: '请输入资料名称' }],
                  initialValue:dataName,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label='档案资料'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
	            {getFieldDecorator('dataUrl', {
	              rules: [{ required:false, message: '请上传文件资料' }],
	              getValueFromEvent: this.normFile,
	              initialValue:fileList.map(i=>(i.name)).join(',')
	            })(<Dragger {...props}>
				    <p className="ant-upload-drag-icon">
				      <Icon type="inbox" />
				    </p>
				    <p className="ant-upload-text">点击或拖入上传文件</p>
				    <p className="ant-upload-hint">可上传多个文件,可点击文件名下载查看 </p>
				  </Dragger>)
	            }
              </Form.Item>
              <Form.Item  wrapperCol={{ span: 2, offset: 20 }}>
                <Button type="primary" htmlType="submit"  loading={this.state.iconLoading}>提交</Button>
              </Form.Item>
            </Form>
          </Modal>:null
        }
      </div>
		)
	}
}
const EntryContract = Form.create()(CMT);
export default EntryContract;