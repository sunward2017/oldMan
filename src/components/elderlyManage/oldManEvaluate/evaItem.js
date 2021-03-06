import React,{Component , Fragment} from 'react';
import {Row,Col, Button,message,Avatar,notification,Tag,InputNumber,List, Select,Progress} from 'antd';
import httpServer from '@/axios';
import {host} from '@/axios/config'

const Option = Select.Option;

export default class EvalItem extends Component{
	constructor(props){
		super(props);
		
		this.state={
			itemEvaluate:{}, //老人评估项
            EstimateGrades:[],//评估等级库
            estimateGrade:{},//评估等级
            score:0,
		}
	}
	componentDidMount(){
		this.fetchGradeByItem();
		let obj = {};
		if(this.props.elderlyEvaluate){
			this.props.elderlyEvaluate.forEach(item=>{
				obj[item.estimateId] = item.tbElderlyEstimateItemDetail[0].itemId;
			})
			this.setState({itemEvaluate:obj})
		}
	}
    handleSelectText=(item,v)=>{
       const  itemEvaluate = this.state.itemEvaluate;
        itemEvaluate[item.id]=v;
       this.setState({itemEvaluate});
       this.startEvaluate();
    }
    fetchGradeByItem=()=>{
    	const {evaItem} = this.props;
    	if(evaItem&&evaItem.length>0){
    	    const {classId} = evaItem[0]
	    	httpServer.listEstimateGrade({classId}).then(res=>{
	    		if(res.code===200){
	    			const data = res.data||[];
	    			this.setState({EstimateGrades:data},function(){
	    				this.startEvaluate()
	    			});
	    		}
	    	})	
    	}
    }
    startEvaluate=()=>{
	  	 let score=0;
	  	 const {itemEvaluate,EstimateGrades } = this.state;
	     const newData = this.props.evaItem;
	  	 const data = [];
//	  	 console.log('评估明细',itemEvaluate);
	  	 newData.forEach(item=>{
	  	 	  if(itemEvaluate[item.id]){
	  	 	  	const obj = {};
		  	 	  obj.tbElderlyEstimateItemDetail=[];
		  	 	  item.tbEstimateLibraryDetail.forEach(i=>{
		  	 	  	if(itemEvaluate[item.id]===i.id){
		  	 	     let item = JSON.parse(JSON.stringify(i).replace(/id/g,"itemId"));
		  	 	       score+=i.score;
		  	 	      obj.tbElderlyEstimateItemDetail.push(item);
		  	 	    }
		  	 	  });
		  	 	  obj.estimateId = item.id;
		  	 	  obj.classId = item.classId;
		  	 	  data.push(obj);
	  	 	  }
	  	 });
	  	 
	  	let max = 0,estimateGrade={};
	    //最大值
	  	EstimateGrades.forEach(item=>{
		    if(max<item.highScore) max=item.highScore;
		})
	  
	  	if(score>max){
	  		estimateGrade =  EstimateGrades.find(item=>{
	  			return item.highScore===max;
	  		})
	  	}else{
	  		estimateGrade = EstimateGrades.find(item=>{
		  		return item.lowScore<=score&&score<=item.highScore
		  	})
	  	}
	  	if(!estimateGrade){
	  		estimateGrade = {estimateGradeName:'未知'}
	  	}
	  	estimateGrade.score = score;
	  	estimateGrade.data = data; 
	  	this.setState({estimateGrade,score},function(){
	  		this.props.changeGrade(newData[0].classId,estimateGrade)
	  	})
	}
	render(){
		const {evaItem} = this.props;
		const {itemEvaluate,score} =this.state;
		return(<Fragment>
				<List
		            grid={{ gutter: 16, column: 2 }}
		            dataSource={evaItem}
		            renderItem={(item,index) => (
		              <List.Item>
		                <List.Item.Meta
		                  avatar={<Avatar icon="star" />}
		                  title={item.title}
		                  description={
		                    <Select style={{width:"80%"}} value={itemEvaluate[item.id]}  onChange={(value)=>{this.handleSelectText(item,value)}}>
		                      {
		                        item.tbEstimateLibraryDetail.map((child,index)=>{
		                            return <Option key={child.id} value={child.id}>{`${child.name}_${child.score}分`}</Option>
		                        })
		                      }
		                    </Select>
		                  }
		                />
		              </List.Item>
		            )}
		        >
			        <List.Item>
			            <Progress   percent={score} format={percent => `${percent} 分`} />
			        </List.Item>
		        </List>
		    </Fragment>)
	}
}
       