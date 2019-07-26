import React ,{Fragment}from 'react';
import httpServer from '../../../axios';
import { Card, Icon, Avatar,Tag} from 'antd';
import moment from 'moment';
import img from '@/style/imgs/smile.jpg'
import ElderlyInfo from '@/common/elderlyInfo';

const {
  Meta
} = Card;
 
class RecordItem extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      modalFlag:false,
      dataSource:{}   
    }
  }
  componentDidMount() {
    // this.getPayItemChild();
    //console.log('item record:',this.props);
  }

  handleBtnClick = (data) =>{
    this.setState({modalFlag:true,dataSource:data}); 
  }
  render() {
    const {
      data,
      baseUrl,
      meelObj,
      gradeObj
    } = this.props;
    const date = moment(data.checkInDate).format('YYYY-MM-DD');
    const {modalFlag,dataSource} = this.state;
    return(
      <Fragment>
        <Card
        style={{ width: 260, marginTop: 16 }}
        onClick={()=>{this.handleBtnClick(data)}}
        >
           <Meta
                avatar={<Avatar src={img} />}
                title={`${data.name} -- ${data.age}岁`}
                description={<span>入院时间:&emsp;<Tag color="#108ee9">{date}</Tag></span>}
            />
        </Card>
        <ElderlyInfo visible={modalFlag} data={dataSource} close={()=>{this.setState({modalFlag:false})}} meelObj={meelObj} gradeObj={gradeObj}/>
      </Fragment>
    )
  }
}
export default RecordItem;
 