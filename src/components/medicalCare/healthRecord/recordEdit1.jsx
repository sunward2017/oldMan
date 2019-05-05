import React,{ Fragment } from 'react';
import { Card, Input, Col, Row, Tabs, Button, Form, Avatar, notification, Divider, Tag, Checkbox,InputNumber,Radio} from 'antd';
import httpServer from '../../../axios/index';
import moment from 'moment';
import BreadcrumbCustom from '../../BreadcrumbCustom'; 
 
const { Meta } = Card;
const CheckboxGroup = Checkbox.Group;
const RadioGroup = Radio.Group;

class RecordEdit extends React.Component {
    state={
        elderlyInfo:{},
        content:'',
    };
    
    componentDidMount(){
       const {state} = this.props.location
       console.log(state);
       
       if(state){
       	   this.setState({elderlyInfo:state})
       }else{
       	   const { history } = this.props;
       	   history.replace('/app/pension-agency/medicalCare/healthRecord')
       }
    }
    
    saveRecord(data){
        const { location, match, history } = this.props;
        const { elderlyInfo } = this.state;
        const url = elderlyInfo.tbHealthRecords ? 'updateHealthInfo' : 'saveHealthInfo';
        httpServer[url]({...data, customerId:location.state, elderlyId:match.params.userId, id:elderlyInfo.tbHealthRecords ? elderlyInfo.tbHealthRecords.id :undefined}).then(res => {
            if(res.code ===200) {
                history.goBack();
                this.notice('success',res.msg)
            } else {
                this.notice('error',res.msg)
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
    
    handleIptText = (target,e) => {
        let content = Object.assign({},this.state.content);
        content[target] = e.target ? e.target.value : e;
        this.setState({content});
    }
    
    render() {
       const elderlyInfo = this.state.elderlyInfo;
       const  plainOptions = [
	       {value:1,label:'无症状'},{value:2,label:'头痛'},{value:3,label:'头晕'},{value:4,label:'心悸'},{value:5,label:'胸闷'},{value:6,label:'胸痛'},{value:7,label:'慢性咳嗽'},{value:8,label:'咳痰'},{value:9,label:'呼吸困难'},{value:10,label:'多饮'},
	       {value:11,label:'多尿'},{value:12,label:'体重下降'},{value:13,label:'乏力'}, {value:14,label:'关节肿痛'},{value:15,label:'视力模糊'},{value:16,label:'手脚麻木'},{value:17,label:'尿急'},{value:18,label:'尿痛'}, {value:19,label:'便秘'},
	       {value:20,label:'腹泻'},{value:21,label:'恶心·呕吐'},{value:22,label:'眼花'},{value:23,label:'耳鸣' },{value:24,label:'乳房胀痛'},{value:25,label:'其他'}
	    ];
       
        return (
            <Fragment>	
	          <BreadcrumbCustom first="老人管理" second="水电记录" />
	          <Row gutter={16}>
	            <Col xs={24} sm={6}>
	               <Card title="基础信息">
					    <Meta
					        avatar={<Avatar src="http://imgsrc.baidu.com/imgad/pic/item/09fa513d269759ee03b7bedab8fb43166d22df38.jpg" />}
					        title={elderlyInfo.name}
					        description={<span>性别:&emsp;<Tag color="#108ee9">{elderlyInfo.sex===1?'男':'女'}</Tag>&emsp;年龄:&emsp;<Tag color="orange">{elderlyInfo.age}岁</Tag>&emsp;&emsp;房间:&emsp;{elderlyInfo.roomName}</span>}
					    />
					</Card>
	            </Col>
	            <Col xs={24} sm={18}  >
	                <table border='1' cellSpacing="0" className="heath_table">
                        <thead>
                            <tr>
                                <th width='10%'>内容</th>
                                <th colSpan="4" width='90%'>检查项目</th>
                            </tr>                        
                        </thead>
                        <tbody>
	                        <tr>
		                     <td>症状</td>
		                     <td style={{textAlign:'left'}} colSpan="4">
		                        <CheckboxGroup options={plainOptions}    onChange={(e) => this.handleIptText('a1',e)} />
		                     </td>
		                    </tr>
		                    <tr>
		                     <td rowSpan="6">一般状况</td>
		                     <td>体温</td>
		                     <td><InputNumber formatter={value =>`${value}℃`} parser={value => value.replace('℃', '')} onChange={(e) => this.handleIptText('a2',e)} /></td>
		                     <td>脉率</td>
		                     <td><InputNumber formatter={value =>`${value}次/分钟`} parser={value => value.replace('次/分钟', '')} onChange={(e) => this.handleIptText('a3',e)} /></td>
		                    </tr>
		                    <tr>
		                      <td>呼吸频率</td>
		                     <td><InputNumber formatter={value =>`${value}次/分钟`} parser={value => value.replace('次/分钟', '')}  onChange={(e) => this.handleIptText('a4',e)}/></td>
		                     <td>血压</td>
		                     <td>左:<Input style={{width:'30%'}} onChange={(e) => this.handleIptText('a5',e)}/>mmHg<br/>右:<Input style={{width:'30%'}} onChange={(e) => this.handleIptText('a6',e)}/>mmHg</td> 
		                    </tr>
		                    <tr>
		                      <td>身高</td>
		                     <td><InputNumber formatter={value =>`${value}cm`} parser={value => value.replace('cm', '')} onChange={(e) => this.handleIptText('a2',e)} /></td>
		                     <td>体重</td>
		                     <td><InputNumber formatter={value =>`${value}kg`} parser={value => value.replace('kg', '')} onChange={(e) => this.handleIptText('a2',e)} /></td> 
		                    </tr>
		                    <tr>
		                      <td>腰围</td>
		                      <td><InputNumber formatter={value =>`${value}cm`} parser={value => value.replace('cm', '')} onChange={(e) => this.handleIptText('a2',e)} /></td>
		                      <td>体重指数</td>
		                      <td><InputNumber formatter={value =>`${value}kg/m2`} parser={value => value.replace('kg/m2', '')} onChange={(e) => this.handleIptText('a2',e)} /></td> 
		                    </tr>
		                    <tr>
		                        <td>健康自我评估</td>
			                    <td colSpan={3}>
			                        <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
								        <Radio value={1}>满意</Radio>
								        <Radio value={2}>基本满意</Radio>
								        <Radio value={3}>说不清楚</Radio>
								        <Radio value={4}>不太满意</Radio>
								        <Radio value={5}>不满意</Radio>
								     </RadioGroup>
			                    </td>
		                    </tr>
		                    <tr>
		                        <td>自理自我评估</td>
			                    <td colSpan={3}>
			                        <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
								        <Radio value={1}>可自理</Radio>
								        <Radio value={2}>轻度依赖</Radio>
								        <Radio value={3}>中度依赖</Radio>
								        <Radio value={4}>不能自理</Radio>
								     </RadioGroup>
			                    </td>  
		                    </tr>
                            <tr>
                              <td rowSpan={13}>生活方式</td>
                              <td rowSpan={3}>体育锻炼</td>
                              <td>锻炼频率</td>
                              <td colSpan={2}>
                                <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
								    <Radio value={1}>每天</Radio>
								    <Radio value={2}>每周一次以上</Radio>
								    <Radio value={3}>偶尔</Radio>
								    <Radio value={4}>从不锻炼</Radio>
								</RadioGroup>
                              </td>
                            </tr>
                            <tr>
                              <td>
                                锻炼时间
                              </td>
                              <td>
                                每次锻炼时间                               
                               <InputNumber formatter={value =>`${value}分钟`} parser={value => value.replace('分钟', '')} onChange={(e) => this.handleIptText('a2',e)} />
                              </td>
                              <td>
                               坚持锻炼时间
                               <InputNumber formatter={value =>`${value}年`} parser={value => value.replace('年', '')} onChange={(e) => this.handleIptText('a2',e)} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                锻炼方式
                              </td>
                              <td colSpan={2}>
                                 <Input  onChange={(e) => this.handleIptText('a5',e)}/>
                              </td>
                            </tr>
                            <tr>
                              <td>饮食情况</td>
                              <td colSpan={2}>
                                <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
								    <Radio value={1}>荤素均衡</Radio>
								    <Radio value={2}>荤食为主</Radio>
								    <Radio value={3}>素食为主</Radio>
								    <Radio value={4}>嗜盐</Radio>
								    <Radio value={4}>嗜油</Radio>
								    <Radio value={4}>嗜塘</Radio>
								</RadioGroup>
                              </td>
                            </tr>
                            
                            <tr>
                              <td rowSpan={3}>吸烟情况</td>
                              <td>吸烟状况</td>
                              <td colSpan={2}>
                                <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
								    <Radio value={1}>从不吸烟</Radio>
								    <Radio value={2}>已戒烟</Radio>
								    <Radio value={3}>吸烟</Radio>
								</RadioGroup>
                              </td>
                            </tr>
                            <tr>
                               <td>
                                  日吸烟量
                               </td>
                               <td> 
                                 平均
                                 <InputNumber formatter={value =>`${value}支`} parser={value => value.replace('支', '')} onChange={(e) => this.handleIptText('a2',e)} />
                               </td>
                            </tr>
                            <tr>
                              <td>
                                吸烟史
                              </td>
                              <td>
                                开始吸烟年龄                             
                               <InputNumber formatter={value =>`${value}岁`} parser={value => value.replace('岁', '')} onChange={(e) => this.handleIptText('a2',e)} />
                              </td>
                              <td>
                                戒烟年龄
                               <InputNumber formatter={value =>`${value}岁`} parser={value => value.replace('岁', '')} onChange={(e) => this.handleIptText('a2',e)} />
                              </td>
                            </tr>
                            
                            <tr>
                              <td rowSpan={5}>饮酒情况</td>
                              <td>饮酒频率</td>
                              <td colSpan={3}>
                                <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
								    <Radio value={1}>从不</Radio>
								    <Radio value={2}>偶尔</Radio>
								    <Radio value={3}>经常</Radio>
								    <Radio value={4}>每天</Radio>
								</RadioGroup>
                              </td>
                            </tr>
                            <tr>
                               <td>
                                  日饮酒量
                               </td>
                               <td> 
                                  平均
                                 <InputNumber formatter={value =>`${value}两`} parser={value => value.replace('两', '')} onChange={(e) => this.handleIptText('a2',e)} />
                               </td>
                            </tr>
                            <tr>
                              <td>是否戒酒</td>
                              <td colSpan="4">
                                 <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
								    <Radio value={1}>未戒酒</Radio>
								    <Radio value={2}>已戒酒</Radio>
								</RadioGroup>
								戒酒年龄:<InputNumber formatter={value =>`${value}岁`} parser={value => value.replace('岁', '')} onChange={(e) => this.handleIptText('a2',e)} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                吸烟史
                              </td>
                              <td>
                                开始饮酒年龄                             
                               <InputNumber formatter={value =>`${value}岁`} parser={value => value.replace('岁', '')} onChange={(e) => this.handleIptText('a2',e)} />
                              </td>
                              <td>
                                近一年是否醉酒
                                <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
								    <Radio value={1}>是</Radio>
								    <Radio value={2}>否</Radio>
								</RadioGroup>
                              </td>
                            </tr>
                            <tr>
                              <td>饮酒种类</td>
                              <td colSpan={3}>
                                <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
								    <Radio value={1}>白酒</Radio>
								    <Radio value={2}>啤酒</Radio>
								    <Radio value={3}>黄酒</Radio>
								    <Radio value={4}>红酒</Radio>
								    <Radio value={4}>其他</Radio>
								</RadioGroup>  
                              </td>
                            </tr>
                            <tr>
                              <td>职业病危害接触史</td>
                              <td colSpan={3}>
                                <div>
	                                <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
									    <Radio value={1}>无</Radio>
									    <Radio value={2}>有</Radio>
									</RadioGroup>
								    工种:<Input style={{width:100}}/> &emsp;时间:<InputNumber/>年
								</div>
								 
								    <p>
								    &emsp;&emsp;粉尘:<Input style={{width:100}}/>&emsp;
								        防护措施:
								     <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
									    <Radio value={1}>无</Radio>
									    <Radio value={2}>有</Radio>
									 </RadioGroup>
								    </p>
								    <p>
								     放射物质:<Input style={{width:100}}/>&emsp;
								        防护措施:
								     <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
									    <Radio value={1}>无</Radio>
									    <Radio value={2}>有</Radio>
									 </RadioGroup>
								    </p>
								    <p>
								     物理因数:<Input style={{width:100}}/>&emsp;
								        防护措施:
								     <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
									    <Radio value={1}>无</Radio>
									    <Radio value={2}>有</Radio>
									 </RadioGroup>
								    </p>
								    <p>
								     化学物质:<Input style={{width:100}}/>&emsp;
								        防护措施:
								     <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
									    <Radio value={1}>无</Radio>
									    <Radio value={2}>有</Radio>
									 </RadioGroup>
								    </p>
								    <p>
								    &emsp;&emsp;其他:<Input style={{width:100}}/>&emsp;
								        防护措施:
								     <RadioGroup onChange={(e) => this.handleIptText('a2',e)}>
									    <Radio value={1}>无</Radio>
									    <Radio value={2}>有</Radio>
									 </RadioGroup>
								    </p>
								    
								 
                              </td>
                            </tr>
		                </tbody>    
	               </table>
	            </Col>
	          </Row>
	          <style>
	          {`
	            .heath_table{
	               width:100%;
	               text-align:center;
	            }
	          `}
	          </style>
	        </Fragment>  
        )
    }
}
export default Form.create()(RecordEdit)