import React from 'react';
import { Card, notification, Collapse, Radio, Tag, Divider, Table } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import httpServer from '../../axios/index';
import moment from 'moment';
const RadioGroup = Radio.Group;
const Panel = Collapse.Panel;

export default class WaterKwhAlarm extends React.Component {
    state = {
        list: [],
        value:1,
    };
    componentDidMount() {
        this.fetchList(1);
    }
    fetchList(flag){
        //flag 1水表 2 电表
        const { customerId } = this.props.auth;
        httpServer.listWaterKwhAbnormal({customerId, flag}).then(res => {
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
    onRadioChange = (e) => {
        this.setState({
            value: e.target.value,
        });
        this.fetchList(e.target.value)
    };
    onCollapseChangeHandler = (key) => {
        this.setState({activeKey: key});
    };
    render() {
        const { list, value, activeKey } = this.state;
        const columns = [{
            title: '抄表日期',
            dataIndex: 'regDate',
            render: (text) => moment(text).format('YYYY-MM-DD')
        }, {
            title: '抄表人',
            dataIndex: 'optName',
        }, {
            title: '记录值',
            dataIndex: value===1 ? 'water' : 'kwh',
        }];
        return (
            <div>
                <BreadcrumbCustom first="告警信息" second="水电表异常情况" />
                <Card>
                    <RadioGroup onChange={this.onRadioChange} value={value}>
                        <Radio value={1}>水</Radio>
                        <Radio value={2}>电</Radio>
                    </RadioGroup>
                    <Divider dashed="true" />
                    {
                        list.length>0 ?
                            <Collapse bordered={false} accordion activeKey={activeKey} onChange={this.onCollapseChangeHandler}>
                                {
                                    list.map(item => (
                                        <Panel
                                            header={<div><Tag color="#108ee9">{item.roomName}</Tag>房间</div>}
                                            key={item.id}
                                        >
                                            <p>记录明细：</p>
                                            <Table columns={columns} dataSource={item.tbRoomWaterKwhInfo} size="small" rowKey={record => record.id} />
                                        </Panel>
                                    ))
                                }
                            </Collapse> : '无异常数据'
                    }
                </Card>
            </div>
        )
    }
}
