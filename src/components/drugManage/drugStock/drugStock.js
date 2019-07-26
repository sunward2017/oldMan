import React , { Component } from 'react';
import httpServer from '@/axios';
import {Tag,Table,notification,Button,Card,Modal,Divider,Avatar} from 'antd';
import img from "@/style/imgs/smile.jpg"

const { Meta } = Card;
class DrugStock extends Component{
  constructor(props){
    super(props);
  }
  
  handleCancel=()=>{
    this.props.close()
  }

  render(){
    const { elderly,drugs} = this.props.drugStockInfo;
    const columns = [{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      width:'10%',
      key:'index'
    },{
      title: '药品名称',
      dataIndex: 'name',
      key: 'name',
      widh:'20%'
    },{
      title:'药品库存',
      dataIndex: 'quantity',
      key: 'quantity',
      width:'10%'
    },{
      title: '最小单位',
      dataIndex: 'minUnit',
      key: 'minUnit',
      width:'15%'
    }];
    return(
      <Modal
        title="药品信息"
        width="60%"
        visible={true}
        onCancel={this.handleCancel}
        maskClosable={false}
        footer={[
            <Button key="back" type="primary" onClick={this.handleCancel}>关闭</Button>,
         ]}
        >
        <Card title="老人基本信息">
		    <Meta
		        avatar={<Avatar src={img}/>}
		        title={elderly.name}
				    description={<span>性别:&emsp;<Tag color="#108ee9">{elderly.sex===0?'女':'男'}</Tag>&emsp;年龄:&emsp;<Tag color="orange">{elderly.age}岁</Tag>&emsp;&emsp;房间:&emsp;<Tag color='geekblue'>{elderly.roomName}</Tag></span>}
				/>
	    </Card>
	    <Divider/>
        <Table 
          size="middle"
          dataSource={drugs} 
          columns={columns} 
          pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50']}}
          rowKey={record => record.drugCode}
        />
      </Modal>
    )
  }
}

export default DrugStock;