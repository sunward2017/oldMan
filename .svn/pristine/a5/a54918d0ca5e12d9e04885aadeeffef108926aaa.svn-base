import React from 'react';
import { Icon, Button, Card, notification, List, Popover } from 'antd';
import BreadcrumbCustom from '../BreadcrumbCustom';
import httpServer from '../../axios/index';

export default class ArrearageAlarm extends React.Component {
    state = {
        list: []
    };
    componentDidMount() {
        this.typeObj={1:'预约押金', 2:'住院定金', 3:'入院押金', 4:'水电预交', 5:'住院预交', 6:'药费预交', 7:'餐费预交'};
        this.fetchList();
    }
    fetchList(){
        const { customerId } = this.props.auth;
        httpServer.listDefaultingFee({customerId}).then(res => {
            // console.log('res list: ',res);
            res.code === 200 ? this.setState({list: res.data || []}) : this.notice('error', res.msg);
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
    render() {
        const { list } = this.state;
        return (
            <div>
                <BreadcrumbCustom first="告警信息" second="余额不足提醒" />
                <Card>
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        dataSource={list}
                        renderItem={item => {
                            let moneyItems = item.tbMoneyLibrary;
                            return (
                                <List.Item actions={[<Popover placement="left" content={<PopoverContent data={moneyItems} />} title={`${item.name}费用详情`}>
                                    <Button type="primary" size="small">
                                        <Icon type="search" />
                                    </Button ></Popover>]}>
                                    <List.Item.Meta
                                        title={`${item.name} -- ${item.age}岁 -- ${item.roomName}房间`}
                                        description={``}
                                    />
                                    <div style={{width:'250px'}}>
                                        {
                                            Object.keys(this.typeObj).map((key,idx) => {
                                                if(idx<3) return <p key={key} className="lineH">{this.typeObj[key]}: <span className="mr-s">{moneyItems[`je${key}`]}</span> </p>;
                                                if(idx === 3) return <p key={key} className="lineH">...</p>;
                                                return null;
                                            })
                                        }
                                    </div>
                                </List.Item>
                            )
                        }}
                    />
                </Card>
            </div>
        )
    }
}

const PopoverContent = ({data}) => {
    const typeObj={1:'预约押金', 2:'住院定金', 3:'入院押金', 4:'水电预交', 5:'住院预交', 6:'药费预交', 7:'餐费预交'};
    return (
        <React.Fragment>
            {
                Object.keys(typeObj).map((key,idx) => <p key={key} className="lineH">{typeObj[key]}: <span className="mr-s">{data[`je${key}`]}</span> </p>)
            }
        </React.Fragment>
    )
}