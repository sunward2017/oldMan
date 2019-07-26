import React from 'react';
import { Row, Col, Card, notification, Tag, Button, Steps, Collapse,Spin,Switch} from 'antd';
// import moment from 'moment';
import httpServer from '../../../axios/index';
import BreadcrumbCustom from '../../BreadcrumbCustom';
const Panel = Collapse.Panel;
const Step = Steps.Step;

export default class LeaveAudit extends React.Component {
    state = {
        list: [],
        audits:[],
        nursingGrade:{},
        elderlyInfo:{},
        flag:false,
        type:true,
    };
    componentDidMount(){
        this.fetchElderlyList();
        this.fetchNursingGrade();
    }
    
    fetchElderlyList(){
		httpServer.listElderlyInfo({
			listStatus:'3',
			launchFlag:0,
		}).then(res => {
			if(res.code === 200) {
				const elderlys ={};
				res.data&&res.data.forEach(item=>{
					elderlys[item.id]= {name:item.name,age:item.age,roomName:item.roomName};
				})
				this.setState({elderlyInfo:elderlys},()=>{
					this.fetchChangeNursingGrade()
				})
			}else{
				this.setState({elderlyInfo:{}})
			}
		})
    }
    fetchNursingGrade(){
	    httpServer.listNursingGrade().then((res)=>{
	       if (res.code === 200) {
	           let nursingGrade = {};
	           res.data&&res.data.forEach(t=>{
	           	  nursingGrade[t.nursingGradeCode]= t.nursingGradeName;
	           })
	           this.setState({nursingGrade});
	        } else {
	           this.setState({nursingGrade:{}})
	        }
	    }).catch((err)=>{
	      console.log(err);
	    });
    }
    fetchChangeNursingGrade(){
        const { elderlyInfo,type} = this.state;
        httpServer.listChangeNursingGrade().then(res => {
        	const flag =type?0:1;
            const list = res.data?res.data.filter(i=>(i.flag===flag)).map(item=>({...item,...elderlyInfo[item.elderlyId]})):[];
            this.setState({list, activeKey:list[0] && list[0].id.toString() });
            list.length>0 && this.fetchOneAudit(list[0]);
        })
    }
    fetchOneAudit(record){
    	const {id,elderlyId} = record
    	this.setState({flag:true})
        httpServer.listChangeNursingGradeAudit({changeId:id,elderlyId}).then(res => {
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
        const { name,id } = this.props.auth;
        httpServer.saveNursingGradeAudit({ optId:id,optName:name,id:s.id,changeId:s.changeId,elderlyId:r.elderlyId}).then(res => {
            if(res.code===200){
            	this.notice('info','审核完成');
            	this.fetchOneAudit(r);
            }else{
            	this.notice('info',res.msg);
            }
        })
    };
    changeType=(v)=>{
    	this.setState({type:v},()=>{
    	   this.fetchChangeNursingGrade();
    	})
    }
    render() {
        const { list, activeKey, audits,elderlyInfo,nursingGrade,flag,type} = this.state;
        const { auth } = this.props;
        return (
            <div>
                <BreadcrumbCustom first="审核管理" second="护理等级变更" />
                   {flag? <div> <Spin size="small" /><Spin /><Spin size="large" /></div>:
                   <Card title="待审核老人:" extra={<Switch checkedChildren="审核中" unCheckedChildren="审核完毕" checked={type} onChange={this.changeType}/>}>
                    {
                        list.length > 0 ?
                        <Collapse bordered={false} accordion activeKey={activeKey} onChange={this.onCollapseChangeHandler}>
                            {
                                list.map(item => (
                                    <Panel
                                        header={<div>
                                            <Tag color="geekblue">{item.name}</Tag> -- {item.age}岁 -- {item.roomName}房间
                                            <span className="pull-right">
                                               变更记录:&emsp;<Tag color="geekblue">{nursingGrade[item.oldNursingGradeCode]}</Tag>&nbsp;=&gt;&nbsp;<Tag color="purple">{nursingGrade[item.newNursingGradeCode]}</Tag>
                                               护理费:&emsp;<span className="blue">{item.oldNursingFee}元</span>&nbsp;=&gt;&nbsp;<span className="blue">{item.newNursingFee}元</span>&emsp;生效日期:&emsp;<span className="blue">{item.changeNursingFeeDate.substr(0,10)}</span>
                                               </span>
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
                                                                    size="small"
                                                                    onClick={() => this.onCheckOutHandler(item,s)}
                                                                >审核确认</Button>: "待审核")}
                                                         status={s.status ? "finish" :"process"}
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