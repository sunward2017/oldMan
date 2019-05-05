import React from 'react';
import {Input, Select, Button, Form } from 'antd';
const Option = Select.Option;

let NewContent = ({name, checkItems, onSave, form}) => {
    const { getFieldDecorator } = form;
    const formItemLayout = {
        labelCol:{ span: 5 },
        wrapperCol:{ span: 12 }
    };
    let onSaveHandler = (e) => {
        e.preventDefault();
        form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                onSave(values);
            }
        });
    };
    return (
        <Form onSubmit={onSaveHandler}>
            <Form.Item
                label="老人"
                {...formItemLayout}
            >
                {getFieldDecorator('name', {initialValue: name})(
                    <Input disabled />
                )}
            </Form.Item>
            <Form.Item
                label="检查类目"
                {...formItemLayout}
            >
                {getFieldDecorator('item', {rules: [{ required: true, message: '选择一个类目!' }],})(
                    <Select labelInValue>
                        { checkItems.map(i => <Option key={i.id} value={i.id} >{i.name}</Option>) }
                    </Select>
                )}
            </Form.Item>
            <Form.Item
                label="指标数值1"
                {...formItemLayout}
            >
                {getFieldDecorator('value1', {rules: [{ required: true, message: '请输入指标值!' }]})(
                    <Input />
                )}
            </Form.Item>
            <Form.Item
                label="指标数值2"
                {...formItemLayout}
            >
                {getFieldDecorator('value2')(
                    <Input />
                )}
            </Form.Item>
            <Form.Item wrapperCol={{span: 14, offset: 6 }}>
                <Button type="primary" htmlType="submit">提交</Button>
            </Form.Item>
        </Form>
    )
};
export default Form.create()(NewContent)