import React, {
	Component,
	Fragment
} from 'react';
import { Table, Card,Tag, Divider, Popconfirm, Button, Modal, Form, Input, DatePicker, Radio, Select,notification,Upload,message,Icon} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import moment from 'moment';
import httpServer from '@/axios/index';
import ElderlySelect from '@/common/elderlySelect';
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
			record: '',
			iconLoading:false,
			customerId:'',
			fileList:[],
			fileName:'',
		}
	}
	
	componentDidMount() {
		const auth = this.props.auth;
		this.setState({customerId:auth.customerId},function(){
			this.List()
		})
	}
	
	List() {
		const customerId = this.state.customerId;
		httpServer.listContractInfo({customerId}).then(res => {
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
	    httpServer.deleteContractInfo({id}).then(res => {
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
		const  acceptor = this.props.auth.tbCustomerInfo.customerName
		this.setState({
			modalFlag: true,
			record:{acceptor},
			fileList:[],
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
				const values = {
					...fieldsValue,
					'contractDate': fieldsValue['contractDate'].format('YYYY-MM-DD HH:mm:ss'),
					'customerId': this.state.customerId,
					'dataUrl':this.state.fileList.map(i=>(i.url+'^'+i.name)).join(',')
				};
			  const { id }= this.state.record;
              if(id){
              	    values.id = id;
					httpServer.updateContractInfo(values).then((res)=>{
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
			   	   httpServer.saveContractInfo(values).then((res) => {
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

	/*自定义手机号校验*/
	validatePhoneNumber(rule, value, callback) {
		if(value && !(/^[1][3,4,5,7,8][0-9]{9}$/.test(value))) {
			callback('手机号码格式不正确');
		} else {
			callback();
		}
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
			acceptor,
			consignor,
			contractAddr,
			contractDate,
			address,
			elderlyId,
			dataUrl,
			dataName
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

		const columns = [{
			title: '序号',
			render: (text, record, index) => `${index+1}`,
			width: '5%',
			key:'index',
			align:'center'
		}, {
			title: '甲方',
			dataIndex: 'acceptor',
			key: 'acceptor',
			width: '8%'
		},{
			title: '乙方',
			dataIndex: 'consignor',
			key: 'consignor',
			width: '8%'
		},{
			title: '地址',
			dataIndex: 'address',
			key: 'address',
			width: '15%'
		},{
			title:'签订日期',
			dataIndex:'contractDate',
			width:'12%',
			align:'center',
			render:(t,r)=>{
				return t&&t.substr(0,10);
				
			},
			defaultSortOrder: 'ascend',
			sorter: (a, b) =>{return moment(a.contractDate).isBefore(b.contractDate)?1:-1},
		},{
			title: '文件名',
			dataIndex:'dataName',
			key:'dataName',
			width:'12%'
		},{
			title: '操作',
			dataIndex: 'action',
			key: 'action',
			width: '8%',
			align:'center',
			render: (text, record) => {
				return(
					<span>
		              <Button onClick={() => { this.handleModify(record) }} icon="edit" type="primary"  title="修改" size="small"></Button> 
		              <Divider type="vertical" />
		              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record.id,record)}>
		                <Button icon="delete" type="primary" title="删除" size="small"></Button>
		              </Popconfirm>
                    </span>
				)
			},
		}];
		return(
			<div>
            <BreadcrumbCustom first="入院管理" second='入院合同' />
            <Card 
		        title="入院合同" 
		        bordered={false} 
		        extra={<Button type="primary" onClick={()=>{this.handleAdd()}} icon="plus" title="新增"></Button>}
		    >
	          <Table 
	            size="middle"
	            rowKey='id' 
	            dataSource={dataSource} 
	            columns={columns} 
	            pagination={{ showSizeChanger:true ,showQuickJumper:true,pageSizeOptions:['10','20','30','40','50']}}
	          />
          </Card>
        {
          modalFlag?
          <Modal 
            title="合同信息输入"
            okText='提交'
            visible={modalFlag}
            onCancel={()=>{this.handleCancel()}}
            maskClosable={false}
            footer={<Button type="primary"  onClick={this.handleSubmit}  loading={this.state.iconLoading}>提交</Button>}
          >
            <Form>
              <Form.Item
                label='甲方'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('acceptor', {
                  rules: [{ required: true, message: '请输入甲方!' }],
                  initialValue:acceptor,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label='乙方'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('consignor', {
                  rules: [{ required: true, message: '请输入乙方'}],
                  initialValue:consignor
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label='签订地址'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('contractAddr', {
                  rules: [{ required: true, message: '请输入签订地址!' }],
                  initialValue:contractAddr,
                })(
                  <Input />
                )}
              </Form.Item>
              <Form.Item
                label='签订日期'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('contractDate', {
                  rules: [{ required: true, message: '请选择日期!' }],
                  initialValue:contractDate?moment(contractDate,'YYYY-MM-DD') : moment(),
                })(
                  <DatePicker format='YYYY-MM-DD' />
                )}
              </Form.Item>
              <Form.Item
                label='乙方联系地址'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('address', {
                  rules: [{ required: true, message: '请输入地址' }],
                  initialValue:address,
                })(
                  <Input/>
                )}
              </Form.Item>
              <Form.Item
                label='被看护人'
                {...formItemLayout}
                style={{marginBottom:'4px'}}
              >
                {getFieldDecorator('elderlyId', {
                  rules: [{ required: true, message: '请选择老人' }],
                  initialValue:elderlyId,
                })(
                   <ElderlySelect listStatus='0,1,2,3,4'/>
                )}
              </Form.Item>
              <Form.Item
                label='资料名称'
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
                label='资料'
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
               
              
               
            </Form>
          </Modal>:null
        }
      </div>
		)
	}
}
const EntryContract = Form.create()(CMT);
export default EntryContract;