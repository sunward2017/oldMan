import React from 'react';
import { Slider, InputNumber, Row, Col, Table, Select, Divider, Popconfirm } from 'antd';
const Option = Select.Option;

export default class PriceTable extends React.Component{
    feeChangeHandler = (record) => {
        return (res) => {
            this.props.onDataChange({...record, price:res});
        }
    }
    saveModifyHandler = (r) => {
        this.props.onRowSave(r);
    }
    rowDeleteHandler = (r) => {
        this.props.onRowDelete(r);
    }
    nameChangeHandler = (record, e) => {
        this.props.onDataChange({...record,name:e.target.value});
    }
    daysChangeHandler = (record, e) => {
        this.props.onDataChange({...record,days:e.target.value});
    }
    render() {
        const columns = [{
            title: '收费项目',
            dataIndex: 'name',
            render: (text, record) => <input className="sliderNameIpt" value={text} onChange={(e) => this.nameChangeHandler(record, e)} />
        }, {
            title: '收费价格',
            dataIndex: 'price',
            render: (text,record )=> <PriceSlider value={record.price} onValueChange={this.feeChangeHandler(record)} />,
            width: '50%'
        }, {
            title:'收费周期',
            dataIndex: 'period',
            width: '10%',
            render: (text, record) =>  <Select defaultValue={record.unit} style={{ width: 80 }}>
                <Option value={1}>次</Option>
                <Option value={2}>天</Option>
                <Option value={3}>周</Option>
                <Option value={4}>月</Option>
                <Option value={5}>年</Option>
                <Option value={6}>度</Option>
            </Select>
        },{
            title: '退费起始天数',
            dataIndex: 'days',
            render: (text, record) => <input  value={text} onChange={(e) => this.daysChangeHandler(record, e)} />
        }, {
            title: '',
            dataIndex: 'action',
            width: '15%',
            render: (text, record) => {
                return (
                    <React.Fragment>
                        <Button onClick={() => { this.saveModifyHandler(record) }}>保存</Button>
                        <Divider type="vertical" />
                        <Button onClick={() => { this.saveModifyHandler(record) }}>修改</Button> 
                    </React.Fragment>
                );
            }
        }];
        const { data } = this.props;
        return (
            <Table columns={columns} dataSource={data} pagination={{ pageSize: 50 }} scroll={{ y: 500 }} rowKey={record => record.id} />
        );
    }
}

class PriceSlider extends React.Component{
    onChange = (value) => {
        this.props.onValueChange(value);
    }
    render() {
        const { value } = this.props;
        return (
            <Row>
                <Col span={18}>
                    <Slider
                        included={false}
                        min={0}
                        max={9999}
                        marks={{0:'￥0', 9999:'￥9999'}}
                        onChange={this.onChange}
                        value={typeof value === 'number' ? value : 0}
                    />
                </Col>
                <Col span={6}>
                    <InputNumber
                        min={0}
                        max={9999}
                        style={{ marginLeft: 16 }}
                        value={value}
                        onChange={this.onChange}
                    />
                </Col>
            </Row>
        );
    }
}