import React, {Component,Fragment} from 'react';
import {  Tag, Divider, Button, Modal, Form, Input, DatePicker,Upload,message,Icon,notification, Calendar,Row,Col,Popover,Spin,List,Badge,Carousel} from 'antd';
import moment from 'moment';
import httpServer from '@/axios/index';
import reqwest from 'reqwest'
import {host} from '@/axios/config'
import ElderlySelect from '@/common/elderlySelect';

const {Search} = Input;
function split_array(arr, len){   
 	var a_len = arr.length;    var result = [];    
 	for(var i=0;i<a_len;i+=len){       
 		result.push(arr.slice(i,i+len));    
 	}    
 	return result;
 }
 
const Dragger = Upload.Dragger;
 
class CMT extends Component {
	constructor(props) {
		super(props);
		this.state = {
			modalFlag: false,
			fileList:[],
			fileName:'',
			visitDate:"",
			visible:false,
			curTime:props.record.endTime?moment(props.record.endTime):moment(),
			loading:false,
			dataSource:[],
			curRecord:{},
			uploading:false,
			previewVisible:false,
		}
		this.carouselRef = null;
	    this.setCarouselRef = el => {
	      this.carouselRef = el;
	    };
	}
    getHistoryVisit=()=>{
    	this.setState({loading:true})
    	const {record} = this.props;
    	const {curTime} = this.state;
    	const time = curTime||moment();
    	const startTime = time.month(time.month()).startOf('month').format("YYYY-MM-DD HH:mm:ss");
        const endTime= time.month(time.month()).endOf('month').format("YYYY-MM-DD HH:mm:ss");
    	httpServer.detailVisitOldMan({elderlyId:record.elderlyId,startTime,endTime}).then(res=>{
    		if(res.data&&res.data.length>0){
    			const curRecord = res.data[res.data.length-1];
    			const visitDate = moment(curRecord.visitDate).format("YYYY-MM-DD")
    			const fileList = curRecord.picUrl?curRecord.picUrl.split(','):[];
    			const dates = res.data.map(i=>i.visitDate.split(' ')[0]);
    			this.setState({loading:false,dataSource:res.data,visitDate,curRecord,fileList,dates});
    		}else{
    			const visitDate = moment().format('YYYY-MM-DD')
    			this.setState({loading:false,dataSource:[],visitDate:moment().format("YYYY-MM-DD"),curRecord:{},fileList:[],dates:[]})
    		}	
    	})
    }
	/*添加按钮*/
	handleVisited=()=>{
		this.setState({
			modalFlag: true,
		},()=>{
			this.getHistoryVisit()
		});
	}

	/*关闭弹框*/
	handleCancel=()=>{
		this.setState({
			modalFlag: false, 
		});
	}
	handleCancel1=()=>{
		this.setState({
			previewVisible: false, 
		});
	}
	/*提交完成添加客户信息*/
	handleSubmit = (e) => {
		e.preventDefault();
		let _this = this;
		this.props.form.validateFieldsAndScroll((err, fieldsValue) => {
			if(!err) {
				this.setState({ loading: true });
				const {visitDate,fileList} = this.state;
				const values = {
					...fieldsValue,
					elderlyId:this.props.record.elderlyId,
					visitDate:visitDate+' 00:00:00',
					picUrl: fileList.join(',')
				};
				if(this.state.curRecord.id){
					values.id = this.state.curRecord.id;
				}
			    httpServer.saveVisitOldMan(values).then(res=>{
				   if(res.code === 200) {
					const args = {
						message: '提示',
						description: "保存成功",
						duration: 2,
					};
					notification.success(args);
					 
					} else {
						const args = {
							message: '通信失败',
							description: res.msg,
							duration: 2,
						};
						notification.error(args);
					}
			    	this.setState({ loading: false});
			    });
			}
		});
	}
	
   normFile = (e) => {
       const names = e.fileList.map(i=>(i.name));
	   return  names.join(',');
   }
   handleUpload=(info)=>{
   	 this.setState({uploading:true});
     const formData = new FormData();
     formData.append('file', info.file);
     reqwest({
          url: host.api+'/uploadFile',
	      method: 'post',
	      processData: false,
	      data: formData,
	      success: (res) => {
	        message.success('文件上传成功');
	        const fileList = this.state.fileList;
	        fileList.push('/upload/'+res.data);
	        this.setState({fileList,uploading:false})
	      },
	      error: () => {
	      	this.setState({uploading:false})
	        message.error('文件上传失败');
	      },
	    });
    }
    onDateChange=(v)=>{
    	const  visitDate = v.format('YYYY-MM-DD');
    	const {dates,dataSource} = this.state;
    	if(dates.includes(visitDate)){
    		const curRecord = dataSource.find(i=>i.visitDate.substr(0,10)===visitDate);
    	    const fileList = curRecord.picUrl?curRecord.picUrl.split(','):[];
    	    this.setState({visible:false,curRecord,fileList,visitDate});
    	}else{
    	    this.setState({visible:false,visitDate,curRecord:{},fileList:[]})
    	}
    }
    
    onPanelChange=(v)=>{
       this.setState({curTime:v},()=>{
       	   this.getHistoryVisit()
       })
    }
    
    handleHoverChange=(v)=>{
    	this.setState({visible:v})
    }
    dateCellRender=(value)=>{
	  const v = value.format("YYYY-MM-DD");
	  const {dates} = this.state; 
	  console.log('dates',dates)
	  if(dates.includes(v)){
	  	return   <Badge status="success" />
	  }
	}
    deletePreview(n){
       this.setState(state=>{
       	  state.fileList = state.fileList.filter(i=>(i!==n));
       	  return state;
       })
    }
    renderFile(list){
    	if(list.length>0){
	        var arr = split_array(list,4);
	        return  arr.map((k,index)=>(<div key={index}>{
	        	k.map((n,i)=>(<div key={i+"img"} className="visitWrap mr-s mb-s">
	        	<img src={host.api+n}  className="visitImg" />
	        	<Icon className="visitE text-2x" type="eye" onClick={()=>{this.handlePreview(n)}} /><Icon className="visitD text-2x" type="delete" onClick={()=>{this.deletePreview(n)}}/>
	        	</div>))
	        }</div>))
        }
    }
    handlePreview(url){
    	this.setState({previewVisible:true})
    }
    
    changeDT(direction){
    	if(direction==='pre'){
    		if (this.carouselRef) this.carouselRef.prev();
    	}else{
    		if (this.carouselRef) this.carouselRef.next(); 
    	}
    }
    
	render() {
		const {
			modalFlag,
			fileList,
			visitDate,
			visible,
			curRecord,
			uploading,
			previewVisible,
			curTime
		} = this.state;
	    const props = {
			  onChange:this.handleUpload,
			  beforeUpload: (file) => {return false},
              fileList:null,			  
			};
		const {
			getFieldDecorator
		} = this.props.form;
		const {elderlyName} =this.props;
		return(
		  <Fragment>
		    <Button onClick={() => { this.handleVisited() }} title="主任探访" size="small" icon="twitter" type="primary"></Button>
	        <Modal 
	            title="探访记录"
	            okText='保存'
	            width={900}
	            visible={modalFlag}
	            onCancel={this.handleCancel}
	            maskClosable={false}
	            footer={null}
	          >
		        <Popover 
		          placement="topLeft" 
		          visible={visible} title={null}  
		          content={
		        	<div style={{border: '1px solid #d9d9d9', borderRadius: 4 }}>
		                  <Calendar value={curTime} fullscreen={false} onSelect={this.onDateChange} onPanelChange={this.onPanelChange}  dateCellRender={this.dateCellRender}s/>
		            </div>  
		           }
		          onVisibleChange={this.handleHoverChange}
		          trigger="click">
			         探访日历:&emsp;<Search style={{width:150}} value={visitDate} placeholder="探访日历"/>
			    </Popover>
                <Spin size="large"  spinning={this.state.loading}>
                    <Form hideRequiredMark onSubmit={this.handleSubmit} layout="inline">
			              <Form.Item>
			                 探访老人:&emsp;<Tag color="#108ee9">{ elderlyName }</Tag>
			              </Form.Item>
			              <Form.Item >
			                {getFieldDecorator('nurseName', {
			                  rules: [{ required: true, message: '不可为空'}],
			                  initialValue:curRecord.nurseName
			                })(
			                  <Input className="tb-line-input" placeholder="探访主任"/>
			                )}
			              </Form.Item>
			              <Form.Item>
			                {getFieldDecorator('memo', {
			                  rules: [{ required: false, message: '请输入探访情况' }],
			                  initialValue:curRecord.memo,
			                })(
			                  <Input className="tb-line-input" style={{width:400}} placeholder="备注"/>
			                )}
			              </Form.Item>
			       
			              <Form.Item>
			                 <Button type="primary"  onClick={this.handleSubmit}>保存</Button>
			              </Form.Item>
			            </Form> 
			            <Divider/>
			            <div className="pa-s">
				            <Carousel autoplay>
					            {this.renderFile(fileList)}
							</Carousel>
						</div>
						<div>
						    <Dragger {...props}>
							    <p className="ant-upload-drag-icon">
									<Icon type="inbox" />
							    </p>
							    <p className="ant-upload-hint">点击或拖入上传图片</p>
							    <p className="ant-upload-text">上传好图片请保存,以防丢失</p>
							</Dragger>
					    </div>
                 </Spin>
            </Modal>
            <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel1} width="700px">
               <Carousel ref={this.setCarouselRef}>
	              {fileList.map(i=>(<img key={i} alt="探访图片" style={{ width: '100%' }} src={host.api+i} />))}
	           </Carousel>
	           <Icon className="left text-3x" type="double-left" onClick={()=>{this.changeDT("pre")}}/> <Icon className="right text-3x" type="double-right" onClick={()=>{this.changeDT("next")}}/>
	        </Modal>
	        <style>{`
	          .visitWrap{
	          	position:relative;
	          	float:left;
	          }
	          .visitWrap:hover:before,
	          .visitWrap:hover .visitD,.visitWrap:hover .visitE{
	          	opacity:1;
	          }
	          .visitD,.visitE{
	          	position:absolute;
	          	top:45%;
	          	opacity:0;
	          	transition: all .3s;
	          	color:yellow;
	          	z-index:100
	          }
	          .visitD{
	          	left:55%;
	          }
	          .visitE{
	          	left:30%;
	          }
	          .visitWrap:before{
	          	position: absolute;
			    z-index: 1;
			    width: 100%;
			    height: 100%;
			    background-color: rgba(0,0,0,0.5);
			    opacity: 0;
			    transition: all .3s;
			    content: ' ';
	          }
	          .left,.right{
	          	position:absolute;
	          	top:50%;
	          	color:#ccc;
	          }
	          .left{
	          	left:10px;
	          }
	          .right{
	          	right:10px;
	          }
	        `}</style>
      </Fragment>
		)
	}
}
const Visited = Form.create()(CMT);

export default Visited