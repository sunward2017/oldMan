import React,{Fragment,Component} from 'react';
import { Modal, Button,Divider,Form,notification,Row,Col,InputNumber,Input,Icon} from 'antd';
import httpServer from '@/axios';
import moment from 'moment';

const confirm = Modal.confirm;
class editForm extends Component {
  constructor(props) {
	 super(props);
	 this.state = {
	 	record:{},
	 	visible:false,
	 	bedInfo:[]
	 }
  }	
  handleCancel=()=>{
  	  this.props.close()
  }
  componentDidMount(){
  	this.fetchBedByRoom();
  	 
  }
  fetchBedByRoom=()=>{
  	const {roomUuid} = this.props.room;
		httpServer.listBedInfoAll({roomUuid}).then((res)=>{
		   if(res.code!==200){
		   	 const args = {
  			    message: '通信失败',
			    description: res.msg,
				duration: 2,
			};
		    notification.error(args);
		    return;
		   }
           if(res.data&&res.data.length>0){
           	 this.setState({bedInfo:res.data})
           }else{
           	 this.setState({bedInfo:[]})
           }
		})
  }
  add=()=>{
  	this.setState({record:{},visible:true})
  }
  editBed=(r)=>{
  	 this.setState({record:r,visible:true})
  }
  remove=(e,v)=>{
  	e.stopPropagation();
  	let _this = this;
  	confirm({
    title:"警告!",
    content:'你确定要删除床位号'+v.bedCode,
    onOk() {
      httpServer.deleteBedInfo({id:v.id}).then((res)=>{
           if(res.code===200){
		     	const args = {
			        message: '成功',
			        description: res.msg,
			        duration: 2,
			    };
			    notification.success(args);
		    }else{
	     	  	const args = {
			        message: '失败',
			        description: res.msg,
			        duration: 2,
			    };
			    notification.error(args);
	     	}
	     	_this.fetchBedByRoom()   
      }) 
    },
    onCancel() {
       _this.setState({visible:false}) 	
    },
    }); 
  }
  handleSubmit=()=>{
  	const {roomUuid,customerId} = this.props.room;
  	const {id}=this.state.record;
    this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
    	if(!err){
    	  let values = {...fieldsValue,roomUuid,customerId}	
    	  const url = id?'updateBedInfo':'saveBedInfo';	
    	  if(id){
    	  	values.id = id;
    	  }
    	  httpServer[url](values).then(res=>{	
    	  	        if(res.code===200){
						const args = {
							message: '通信成功',
							description: res.msg,
							duration: 2,
						};
						notification.success(args);
						this.setState({
							modalFlag: '',
							record: ''
						});
						
					}else{
						const args = {
							message: '通信失败',
							description: res.msg,
							duration: 2,
						};
						notification.error(args);
					}
					this.setState({visible:false})
					this.fetchBedByRoom()
    	  })
    	}
    })
  	
  }
  render() {
    const {editFlag}= this.props;
    const { getFieldDecorator } = this.props.form;
    const {bedInfo}  = this.state;
    const { bedCode,bedName,money } = this.state.record;
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
    return(
    	<Fragment>
        <Modal
          title="床位"
          visible={editFlag}
          okText="完成"
          onOk={this.handleCancel}
          onCancel={this.handleCancel}
        >  
        <Row gutter={16}>
          { bedInfo.map(i=>(<Col key={i.id} span={6}><div onClick={()=>{this.editBed(i)}} className="bed"><p>{"名称: "+i.bedName}</p><p>{"价格: "+i.money+'元'}</p><p>(点击修改)</p><div onClick={(e)=>{this.remove(e,i)}} className="remove"><Icon type="close"/></div></div></Col>)) }
          
          	<Col span={6}>
             <div className="bed" onClick={this.add}><span style={{fontSize:'70px',fontWeight:'bold'}}>+</span></div>
            </Col>:null
          }
        </Row>
        <style>
           {`
        	.bed{
        		background: #6a8abe;
        		border:6px solid #4a6a9e; 
            color:#fff;
            border-radius:4px;
            text-align:center;
            padding:30px 0;
            position:relative;
            margin-bottom:15px;
        	}
        	.bed:hover{
        		background:#4a6a9e;
        		cursor:pointer;
        	}
        	.remove{
        	  position:absolute;
        	  top:1px;
        	  right:1px;
        	  color:red;
        	  display:none;
        	}
        	.bed:hover>.remove{
        		display:block;
        	}
           `}
        </style>
      </Modal>
      <Modal
          title="床位编辑"
          visible={this.state.visible}
          onOk={this.handleSubmit}
          onCancel={()=>{this.setState({visible:false})}}
          key={this.state.visible}
       >
            <Form hideRequiredMark>
		        <Form.Item
		            label='床位号'
		            {...formItemLayout}
		            style={{marginBottom:'4px'}}
		        >
		            {getFieldDecorator('bedCode', {
		              rules: [{ required: true, message: '请输入床位号' }],
		              initialValue:bedCode
		             })(
		                <Input/>
		             )}
		        </Form.Item>
		         <Form.Item
		            label='床位名称'
		            {...formItemLayout}
		            style={{marginBottom:'4px'}}
		        >
		            {getFieldDecorator('bedName', {
		              rules: [{ required: true, message: '请输入床位名称' }],
		              initialValue:bedName
		             })(
		                <Input/>
		             )}
		        </Form.Item>
		         <Form.Item
		            label='床位价格'
		            {...formItemLayout}
		            style={{marginBottom:'4px'}}
		        >
		            {getFieldDecorator('money', {
		              rules: [{ required: true, message: '请输入价格' }],
		              initialValue:money
		             })(
		                <InputNumber/>
		             )}元
		        </Form.Item>
         </Form>
      </Modal>
      </Fragment>
    )
  }
}  

export default  Form.create()(editForm);
