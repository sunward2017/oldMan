import React from 'react';
import { Row, Col, Card, notification, Tag, Button, Steps, Collapse,Spin,Tooltip } from 'antd';
// import moment from 'moment';
import httpServer from '../../../axios/index';
import BreadcrumbCustom from '../../BreadcrumbCustom';
const Panel = Collapse.Panel;
const Step = Steps.Step;

export default class LeaveAudit extends React.Component {
    state = {
        list: [],
        audits:[],
        elderlyInfo:{},
        flag:false,
    };
    componentDidMount(){
        this.fetchElderlyList();
    }
    
    fetchElderlyList(){
        httpServer.listElderlyInfo({launchFlag:1, listStatus:"3"}).then(res => {
            const list = res.data || [];
            this.setState({list, activeKey:list[0] && list[0].id.toString() });
            list.length>0 && this.fetchOneAudit(list[0]);
        })
    }
    
    fetchOneAudit(record){
    	this.setState({flag:true})
    	const {customerId,id} = record
        httpServer.outHomeAuditList({customerId,elderlyId:id}).then(res => {
        	this.setState({flag:false})
            if(res.code===200){
                this.setState({audits:res.data?res.data.map(item=>({...item,memo:item.memo.split(',')})):[]})
            } else {
            	this.setState({audits:[]})
                this.notice('error', res.msg);
            }
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
        if(key){
           const elderlyByAudit = this.state.list.find(item=>(item.id==key));
           this.fetchOneAudit(elderlyByAudit);	
        }
    };
    //审核
    onCheckOutHandler = (r,s) => {
        const { name,id} = this.props.auth;
        httpServer.outHomeAudit({ optId:id,optName:name,id:s.id,elderlyId:r.id}).then(res => {
            if(res.code===200){
            	this.notice('info','审核完成');
            	this.fetchOneAudit(r);
            }else{
            	this.notice('info',res.msg);
            }
        })
    };
    render() {
        const { list, activeKey, audits,elderlyInfo,flag} = this.state;
        const { auth } = this.props;
        return (
            <div>
                <BreadcrumbCustom first="审核管理" second="出院审核" />
                {flag? <div> <Spin size="small" /><Spin /><Spin size="large" /></div>:<Card title="待审核老人:">
                    {
                        list.length > 0 ?
                        <Collapse bordered={false} accordion activeKey={activeKey} onChange={this.onCollapseChangeHandler}>
                            {
                                list.map(item => (
                                    <Panel
                                        header={<div>
                                            <Tag color="#108ee9">{item.name}</Tag> -- {item.age}岁 -- {item.roomName}房间-- 
                                            <Tooltip placement="right" title={item.reason}>
										        <Tag color="geekblue">出院原因</Tag>
										    </Tooltip>
                                            <span className="pull-right">出院申请日期:&nbsp;{item.requestTime.substr(0,10)}</span>
                                        </div>}
                                        key={item.id}
                                    >
                                        <p>审核流程进度：</p>
                                        <Steps  size="small">
                                            {
                                               audits.map(s =>
                                                    <Step key={s.id}
                                                        description={s.status?<span>审核人:&nbsp;<Tag color="cyan">{s.optName}</Tag></span>
                                                             : (s.memo.includes(auth.id.toString())?
                                                                <Button
                                                                    type="primary"
                                                                    icon="audit"
                                                                    onClick={() => this.onCheckOutHandler(item,s)}
                                                                >审核确认</Button>: "待审核")}
                                                         status={s.status ? "finish" : "wait"}
                                                         title={s.deptName}
                                                    />)
                                            }
                                        </Steps>
                                    </Panel>
                                ))
                            }
                        </Collapse> : '无审核数据'
                    }
                </Card>}
            </div>
        )
    }
}