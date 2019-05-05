import React from 'react';
import { Form, Input, Button ,Modal} from 'antd';

const FormItem = Form.Item;

class editRoleForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
    }
  }
  
  componentDidMount() {
    // console.log('mount....data:',this.props.data);
  }
  
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      // console.log('submit values:',values);
      values = {...values,
        roleName:values.roleName.trim(),
      };
      if (!err) {
        this.props.modify({...this.props.data,...values});
      }
    });
  }
  
  render() {
    const { getFieldDecorator } = this.props.form;
    const { roleName, roleDescription } = this.state.data;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 },
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
    return (
        <Modal footer={null} visible={true}  title="新增角色" onCancel={this.props.onClose} width='40%' maskClosable={false}>
            <Form onSubmit={this.handleSubmit}>
              <FormItem
                {...formItemLayout}
                label="角色名称"
              >
                {getFieldDecorator('roleName', {
                  rules: [{ required: true, message: '请输入角色名称', whitespace: true }],
                  initialValue:roleName,
                })(
                  <Input placeholder="admin" />
                )}
              </FormItem>
              <FormItem
                {...formItemLayout}
                label="描述"
              >
                {getFieldDecorator('roleDescription', {
                  rules: [{ required: false }],
                  initialValue:roleDescription,
                })(
                  <Input />
                )}
              </FormItem>
              <FormItem {...tailFormItemLayout}>
                <Button type="primary" htmlType="submit">确认提交</Button>
              </FormItem>
            </Form>
        </Modal>
    );
  }
}

export default Form.create()(editRoleForm);


