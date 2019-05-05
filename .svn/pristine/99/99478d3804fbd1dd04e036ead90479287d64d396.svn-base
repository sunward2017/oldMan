import React from 'react';
import { Divider, Popconfirm, Table } from 'antd';
import moment from 'moment';

export default class EditContent extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            itemList: props.editMemoItem.tbCheckRecordList
        }
    }
    valueChangeHandler = (r, key, e) => {
        this.setState({itemList:this.state.itemList.map(i => i.id === r.id ? {...r,[key]:e.target.value} : i)})
    };
    render(){
        const { saveModify, itemDelete, editMemoItem } = this.props;
        const { itemList } = this.state;
        const columns = saveModify ? [{
            title: '项目',
            dataIndex: 'itemName',
        },{
            title:'值1',
            dataIndex: 'value1',
            width:'20%',
            render: (text, record) => <input className="tb-line-input" value={text} onChange={(e) => this.valueChangeHandler(record, 'value1', e)} />
        },{
            title:'值2',
            dataIndex: 'value2',
            width:'20%',
            render: (text, record) => <input className="tb-line-input" value={text} onChange={(e) => this.valueChangeHandler(record, 'value2', e)} />
        },{
            title: '',
            dataIndex: 'action',
            width: '25%',
            render: (text, record) => {
                return (
                    <React.Fragment>
                        <a href="javascript:;" onClick={() => { saveModify(record) }}>保存</a>
                        <Divider type="vertical" />
                        <Popconfirm title="确定删除?" onConfirm={() => itemDelete(record)}>
                            <a href="javascript:;">删除</a>
                        </Popconfirm>
                    </React.Fragment>
                );
            }
        }] : [{
            title: '项目',
            dataIndex: 'itemName',
        },{
            title:'值1',
            dataIndex: 'value1',
            width:'30%',
        },{
            title:'值2',
            dataIndex: 'value2',
            width:'30%',
        }];
        return (
            <div>
                <h4>{moment(editMemoItem.checkDate).format('YYYY-MM-DD')} 检查单 :</h4>
                <Table columns={columns} dataSource={itemList} pagination={{ pageSize: 50 }} scroll={{ y: 500 }} rowKey={record => record.id} />
            </div>
        )
    }
}