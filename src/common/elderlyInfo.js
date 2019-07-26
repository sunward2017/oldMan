import React ,{Fragment}from 'react';
import httpServer from '@/axios';
import { Card, Icon, Avatar,Tag,Button,Modal,Row,Col,notification} from 'antd';
import moment from 'moment';
import img from '@/style/imgs/smile.jpg'

const {Meta} = Card;
 

class ElderlyInfo extends React.Component {
  constructor(props){
    super(props);
    this.state = {
       modalFlag:false,
    }
  }
  componentDidMount() { 
  }
  
  handleCancel=()=>{
    this.props.close();
  }
  
  render() {
  	const {data,visible,meelObj,gradeObj} = this.props;
    const {
      name,    //老人姓名
      age,//年龄
      idNumber,//老人身份证号 需要正则判断
      socialSecurityNumber,//社保卡号
      phone,
      sex,//老人性别 int
      birthday,//老人生日 datetime
      checkInDate,//入院日期
      maritalStatus,//老人婚姻状况 int
      address,//老人住址
      politicalFace,//老人政治面貌 int
      livingCondition,//老人居住状况 int
      economicSituation,//老人经济状况 int
      estimateGradeCode,
      nursingGradeCode,
      nursingMoney,
      changeNursingFeeDate,
      roomName,//房间名称
      itemCodeWater,//水费对应项
      itemCodeKwh,//电费对应项
      itemCodeMeal,//餐费对应项
      shareProportionWater,//水费承担比例
      shareProportionPower,//电费承担比例
      memo,//备注
      noPayFee,
      waterKwhStatus,
      monthlyPayment,
      tbBedInfo
    } = data;
    
    const layout = {
      label: {
        xs: { span: 24 },
        sm: { span: 4 },
        md: {span:8}

      },
      content: {
        xs: { span: 24 },
        sm: { span: 20 },
        md: {span:16},
        style:{color:"#339"}
      },
    };
    const sexObj={'1':'男','0':'女'};
    const obj1={"1":"未婚","2":"已婚","3":"丧偶","4":"离异"};
    const obj2={'1':'群众','2':'党员','3':'其他'};
    const obj3={'1':'独居','2':'与家庭成员同住','3':'其他'};
    const obj4={'1':'离休','2':'退休金','3':'子女供给','4':'社会保险与救济','5':'其他'};
    return(
      <Fragment>
           <Modal
              title="老人信息"
              visible={visible}
              footer = {null}
              onCancel={this.handleCancel}
              width="1070px"
            >
	        <Card title="基础信息" bordered={false} headStyle={{fontWeight:'bold',color:'#62bbef'}}>
	           <Row gutter={16}>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>姓名:</Col>
	                 <Col {...layout.content}>{name}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>年龄:</Col>
	                 <Col {...layout.content}>{age}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>性别:</Col>
	                 <Col {...layout.content}>{sexObj[sex]}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>电话:</Col>
	                 <Col {...layout.content}>{phone}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>身份证号:</Col>
	                 <Col {...layout.content}>{idNumber}</Col>
	              </Col>
	               <Col md={8} sm={24}>
	                 <Col {...layout.label}>生日:</Col>
	                 <Col {...layout.content}>{birthday&&birthday.substr(0,10)}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>入院日期:</Col>
	                 <Col {...layout.content}>{checkInDate&&checkInDate.substr(0,10)}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>家庭住址:</Col>
	                 <Col {...layout.content}>{address}</Col>
	              </Col>
	           </Row>
	        </Card>
	        <Card title="信息完善" bordered={false} headStyle={{fontWeight:'bold',color:'#62bbef'}}>
	           <Row gutter={16}>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>社保卡号:</Col>
	                 <Col {...layout.content}>{socialSecurityNumber}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>婚姻状况:</Col>
	                 <Col {...layout.content}>{obj1[maritalStatus]}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>政治面貌:</Col>
	                 <Col {...layout.content}>{obj2[politicalFace]}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>居住情况:</Col>
	                 <Col {...layout.content}>{obj3[livingCondition]}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>经济来源:</Col>
	                 <Col {...layout.content}>{obj4[economicSituation]}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>备注:</Col>
	                 <Col {...layout.content}>{memo}</Col>
	              </Col>
	           </Row>
	        </Card>
	        <Card title="费用相关" bordered={false} headStyle={{fontWeight:'bold',color:'#62bbef'}}>
	            <Row gutter={16}>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>评估等级:</Col>
	                 <Col {...layout.content}>{estimateGradeCode}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>护理等级:</Col>
	                 <Col {...layout.content}>{gradeObj[nursingGradeCode]}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>房间号:</Col>
	                 <Col {...layout.content}>{roomName}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>护理费:</Col>
	                 <Col {...layout.content}>{nursingMoney}</Col>
	              </Col>
	              <Col md={8} sm={24}>
	                 <Col {...layout.label}>房费:</Col>
	                 <Col {...layout.content}>{tbBedInfo&&tbBedInfo.money||0}</Col>
	              </Col>
	              {
	                noPayFee===1?
	                <Col md={8} sm={24}>
	                  <Col {...layout.label}>收费类型</Col>
	                  <Col {...layout.content}>免费</Col>
	                </Col>:
	                <div>
	                  {
	                  	waterKwhStatus==1?
	                  	 <Col md={8} sm={24}>
			                 <Col {...layout.label}>水电包月费</Col>
			                 <Col {...layout.content}>{monthlyPayment}</Col>
			              </Col>
	                  	:
	                  	<Fragment>
	                  	   <Col md={8} sm={24}>
			                 <Col {...layout.label}>水费对应项:</Col>
			                 <Col {...layout.content}>{meelObj[itemCodeWater]}</Col>
			               </Col>
			               <Col md={8} sm={24}>
			                 <Col {...layout.label}>电费对应项:</Col>
			                 <Col {...layout.content}>{meelObj[itemCodeKwh]}</Col>
			               </Col>
			               <Col md={8} sm={24}>
			                 <Col {...layout.label}>餐费对应项:</Col>
			                 <Col {...layout.content}>{meelObj[itemCodeMeal]}</Col>
			               </Col>
			               <Col md={8} sm={24}>
			                 <Col {...layout.label}>水费承当比例:</Col>
			                 <Col {...layout.content}>{shareProportionWater}%</Col>
			               </Col>
			               <Col md={8} sm={24}>
			                 <Col {...layout.label}>电费承当比例:</Col>
			                 <Col {...layout.content}>{shareProportionPower}%</Col>
			               </Col>
	                  	</Fragment>
	                  }
	                </div>
	              }
	           </Row>  
	        </Card>
	    </Modal>    
      </Fragment>
    )
  }
}
 
export default ElderlyInfo
 
