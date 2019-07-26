 import React, {Component,Fragment} from 'react';
import {Form, Input,Button,notification,} from 'antd';
import httpServer from '@/axios/index';
import {host} from '@/axios/config';

const { TextArea } = Input;

class CMT extends Component {
	constructor(props) {
		super(props);
	}
	
	componentDidMount() {
		 
	}
	
	/*提交完成添加客户信息*/
	handleSubmit = (e) => {
		e.preventDefault();
		let _this = this;
		this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
			if(!err) {
			   this.props.saveEvaluate(fieldsValue) 
			}
		});
	}

	render() {
		const { getFieldDecorator } = this.props.form; 
		const formItemLayout = {
		  labelCol: {
		    xs: { span: 24 },
		    sm: { span: 2 },
		  },
		  wrapperCol: {
		    xs: { span: 24 },
		    sm: { span: 20 },
		  },
		};
		const {elderlyMz} = this.props.tbScheduledOne;
		const {a,a1,b,b1,c,c1,d,d1,e,e1,f,f1,g,g1,h,h1,i,i1,j,j1,k,k1,l,l1,m,m1,n,n1,o,o1,p,p1,q,q1,r,r1,s} = elderlyMz?JSON.parse(elderlyMz):{};
		return(
		 
			<Form hideRequiredMark >
			    <Form.Item
			      label="进食"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('a', {
		                rules: [{ required: false, message: '请输入进食能力评估' }],
		                initialValue:a
		            })(
		                <Input placeholder="进食能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('a1', {
		                rules: [{ required: false, message: '请输入进食评估说明' }],
		                initialValue:a1
		            })(
		                <Input placeholder="进食能力评估说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>
			    <Form.Item
			      label="梳洗"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('b', {
		                rules: [{ required: false, message: '请输入梳洗能力评估' }],
		                initialValue:b
		            })(
		                <Input placeholder="梳洗能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('b1', {
		                rules: [{ required: false, message: '请输入梳洗能力评估说明' }],
		                initialValue:b1
		            })(
		                <Input placeholder="梳洗能力评估说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="洗澡"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('c', {
		                rules: [{ required: false, message: '请输入洗澡能力评估' }],
		                initialValue:c
		            })(
		                <Input placeholder="洗澡能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('c1', {
		                rules: [{ required: false, message: '请输入洗澡能力评估说明' }],
		                initialValue:c1
		            })(
		                <Input placeholder="洗澡能力评估说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="洗脚"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('d', {
		                rules: [{ required: false, message: '请输入洗脚能力评估' }],
		                initialValue:d,
		            })(
		                <Input placeholder="洗脚能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('d1', {
		                rules: [{ required: false, message: '请输入洗脚能力评估说明' }],
		                initialValue:d1
		            })(
		                <Input placeholder="洗脚能力评估说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="剪脚趾甲"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('e', {
		                rules: [{ required: false, message: '请输入剪脚趾甲能力评估' }],
		                initialValue:e
		            })(
		                <Input placeholder="剪脚趾甲能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('e1', {
		                rules: [{ required: false, message: '请输入剪脚趾甲能力说明' }],
		                initialValue:e1
		            })(
		                <Input placeholder="剪脚趾甲能力说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="求助"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('f', {
		                rules: [{ required: false, message: '求助能力评估' }],
		                initialValue:f
		            })(
		                <Input placeholder="求助能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('f1', {
		                rules: [{ required: false, message: '请输入求助能力说明' }],
		                initialValue:f1
		            })(
		                <Input placeholder="求助能力说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="穿衣"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('g', {
		                rules: [{ required: false, message: '请输入穿衣能力评估' }],
		                initialValue:g
		            })(
		                <Input placeholder="穿衣能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('g1', {
		                rules: [{ required: false, message: '请输入穿衣能力说明' }],
		                initialValue:g1
		            })(
		                <Input placeholder="穿衣能力说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="如厕"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('h', {
		                rules: [{ required: false, message: '请输入如厕能力评估' }],
		                initialValue:h
		            })(
		                <Input placeholder="如厕能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('h1', {
		                rules: [{ required: false, message: '请输入如厕能力说明' }],
		                initialValue:h1
		            })(
		                <Input placeholder="如厕能力说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="排泄"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('i', {
		                rules: [{ required: false, message: '请输入排泄能力评估' }],
		                initialValue:i
		            })(
		                <Input placeholder="排泄能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('i1', {
		                rules: [{ required: false, message: '请输入排泄能力说明' }],
		                initialValue:i1
		            })(
		                <Input placeholder="排泄能力说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="移动"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('j', {
		                rules: [{ required: false, message: '请输入移动能力评估' }],
		                initialValue:j
		            })(
		                <Input placeholder="移动能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('j1', {
		                rules: [{ required: false, message: '请输入移动能力说明' }],
		                initialValue:j1
		            })(
		                <Input placeholder="移动能力说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="皮肤"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('k', {
		                rules: [{ required: false, message: '请输入皮肤能力评估' }],
		                initialValue:k
		            })(
		                <Input placeholder="皮肤能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('k1', {
		                rules: [{ required: false, message: '请输入皮肤能力说明' }],
		                initialValue:k1
		            })(
		                <Input placeholder="皮肤能力说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item> 
			    <Form.Item
			      label="视觉"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('l', {
		                rules: [{ required: false, message: '请输入视觉能力评估' }],
		                initialValue:l
		            })(
		                <Input placeholder="视觉能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('l1', {
		                rules: [{ required: false, message: '请输入视觉能力评估说明' }],
		                initialValue:l1
		            })(
		                <Input placeholder="视觉能力评估说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="听觉"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('m', {
		                rules: [{ required: false, message: '请输入听觉能力评估' }],
		                initialValue:m
		            })(
		                <Input placeholder="听觉能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('m1', {
		                rules: [{ required: false, message: '请输入听觉能力评估说明' }],
		                initialValue:m1
		            })(
		                <Input placeholder="听觉能力评估说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="记忆"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('n', {
		                rules: [{ required: false, message: '请输入记忆能力评估' }],
		                initialValue:n
		            })(
		                <Input placeholder="记忆能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('n1', {
		                rules: [{ required: false, message: '请输入记忆能力说明' }],
		                initialValue:n1
		            })(
		                <Input placeholder="记忆能力说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="定向"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('o', {
		                rules: [{ required: false, message: '请输入定向能力评估' }],
		                initialValue:o
		            })(
		                <Input placeholder="定向能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('o1', {
		                rules: [{ required: false, message: '请输入定向能力说明' }],
		                initialValue:o1
		            })(
		                <Input placeholder="定向能力说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="理解"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('p', {
		                rules: [{ required: false, message: '请输入理解能力评估' }],
		                initialValue:p
		            })(
		                <Input placeholder="理解能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('p1', {
		                rules: [{ required: false, message: '请输入理解能力说明!' }],
		                initialValue:p1
		            })(
		                <Input placeholder="理解能力说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="表达"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('q', {
		                rules: [{ required: false, message: '请输入表达能力评估' }],
		                initialValue:q
		            })(
		                <Input placeholder="表达能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('q1', {
		                rules: [{ required: false, message: '请输入表达能力说明' }],
		                initialValue:q1
		            })(
		                <Input placeholder="表达能力说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="行为"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(30% - 12px)' }}
			      >
			        { getFieldDecorator('r', {
		                rules: [{ required: false, message: '请输入行为能力评估' }],
		                initialValue:r
		            })(
		                <Input placeholder="行为能力评估"/>
		            )}   
			      </Form.Item>
			      <span style={{ display: 'inline-block', width: '24px', textAlign: 'center' }}>
			      </span>
			      <Form.Item
			        style={{ display: 'inline-block', width: 'calc(70% - 12px)' }}
			      >
			        { getFieldDecorator('r1', {
		                rules: [{ required: false, message: '请输入行为能力说明' }],
		                initialValue:r1
		            })(
		                <Input placeholder="行为能力说明"/>
		            )}  
			      </Form.Item>
			    </Form.Item>    
			    <Form.Item
			      label="备注"
			      {...formItemLayout}
			      style={{ marginBottom: 0 }}
			    >
			        { getFieldDecorator('s', {
		                rules: [{ required: false, message: '请输入备注' }],
		                initialValue:s
		            })(
		               <TextArea rows={2}/>  
		            )}
			    </Form.Item> 
			    <Form.Item
		          wrapperCol={{
		            xs: { span: 24, offset: 0 },
		            sm: { span: 8, offset: 16 },
		          }}
		        >
		          <Button onClick={this.handleSubmit} type="primary">提交保存</Button>
		        </Form.Item>
			</Form>
		 	
		)
	}
}
const Nurse = Form.create()(CMT);
export default Nurse;