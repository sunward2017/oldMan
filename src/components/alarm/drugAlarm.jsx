import React from 'react';
import { Card, notification, Table, Collapse, Tag } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import httpServer from '../../axios/index';
import moment from 'moment';
const Panel = Collapse.Panel;

export default class DrugAlarm extends React.Component {
    state = {
        list: []
    };
    componentDidMount() {
        this.fetchList();
    }
    fetchList(){
        const { customerId } = this.props.auth;
        httpServer.listDrugShortage({customerId}).then(res => {
            // console.log('res list: ',res);
            const list = res.data || [];
            this.setState({list, activeKey:list[0] && list[0].id.toString()});
            res.code !== 200 && this.notice('error', res.msg);
        })
    }
    notice(status, msg) {
        let text = status==='success' ? '成功' : (status === 'error'? '失败' : '');
        notification[status]({
            message: `${text}提示:`,
            description:msg,
            duration:2
        })
    }
    onCollapseChangeHandler = (key) => {
        this.setState({activeKey: key});
    };
    render() {
        const { list, activeKey } = this.state;
        const columns = [{
            title: '药品名',
            dataIndex: 'tbDrugInfo.name',
        }, {
            title: '单位',
            dataIndex: 'tbDrugInfo.minUnit',
        }, {
            title: '剩余数量',
            dataIndex: 'quantity',
        }];
        return (
            <div>
                <BreadcrumbCustom first="告警信息" second="缺药告警" />
                <Card>
                    {
                        list.length>0 ?
                            <Collapse bordered={false} accordion activeKey={activeKey} onChange={this.onCollapseChangeHandler}>
                                {
                                    list.map(item => (
                                        <Panel
                                            header={<div><Tag color="#108ee9">{item.name}</Tag> -- {item.age}岁 -- {item.roomName}房间</div>}
                                            key={item.id}
                                        >
                                            <p>记录明细：</p>
                                            <Table columns={columns} dataSource={item.tbDrugStocks} size="small" rowKey={record => record.drugCode} />
                                        </Panel>
                                    ))
                                }
                            </Collapse> : '无缺药告警数据'
                    }
                </Card>
            </div>
        )
    }
}
