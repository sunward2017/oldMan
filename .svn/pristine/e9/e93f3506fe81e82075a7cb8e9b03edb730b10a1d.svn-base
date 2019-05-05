import React , {Component,Fragment} from 'react';
import { Card ,Row, Col ,Tree, notification, Table, Popconfirm,Select,Divider,message} from 'antd';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import httpServer from '../../../axios/index';

const Option = Select.Option
const TreeNode = Tree.TreeNode;
 

class LeaveAuditSet extends Component{
  constructor(props){
    super(props);
    this.state = {
      treeData:[],
      dataSource:[],
      type:'leave',
      operators:[],
      activeKey:'',
      operatorInfo:{},
      optId:[],
    }
    this.onSelect = this.onSelect.bind(this);
  }

  componentDidMount(){
    this.getDeptInfoTree();
    this.listOperators();
  }
  //获取部门列表数据
  getDeptInfoTree(){
    const {customerId} = this.props.auth;
    httpServer.getDeptInfoTree({customerId}).then((res) => {
      if (res.code === 200) {
        res.data?this.setState({treeData:[res.data]}):this.setState({treeData:[]});
      }else{
        if(res.message ==='Request failed with status code 500'){
          console.log(res.message);
        }else{
          const args = {
            message: '通信失败',
            description: res.msg,
            duration: 2,
          };
          notification.error(args);
        }
      }
    }).catch((error)=>{
      console.log(error);
    });
  }

  //获取审核部门列表
  getListLeaveAuditSet(){
    const {customerId} = this.props.auth;
    const {type} = this.state;
    const url = type==='leave'?'listLeaveAuditSet':'listCNGAuditSet';
    httpServer[url]({customerId}).then(res=>{
      if (res.code === 200) {
        res.data?this.setState({dataSource:res.data,activeKey:''}):this.setState({dataSource:[],activeKey:''});
      }else{
        if(res.message ==='Request failed with status code 500'){
          console.log(res.message);
        }else{
          const args = {
            message: '通信失败',
            description: res.msg,
            duration: 2,
          };
          notification.error(args);
        }
      }
    }).catch((error)=>{
      console.log(error);
    });
  }

  //选中树节点
  onSelect(selectedKeys,info){
     if(info.selectedNodes.length===0)return;
     const dept = info.selectedNodes[0].props.dataRef;
     if(dept.children.length>0) return;
     const {dataSource} = this.state;
     const index = dataSource.findIndex(t=>(t.deptId==dept.id));
     if(index>-1){
       message.info(`${dept.departmentName}已存在,请编辑或删除`);
     }else{
        dataSource.push({deptId:dept.id,deptName:dept.departmentName});
        this.setState({dataSource},()=>{
           this.listOperatorByDept({deptId:dept.id})
        })
     }
  }
  handleSave=(r)=>{
   const { type, optIds } = this.state;
   if(optIds.length===0){
     message.error('没有添加人员');
     return;
   }
   const { customerId } = this.props.auth;
   let values={},Url; 
   if(type==='leave'){
      Url = r.id?'updateLeaveAuditSet':'saveLeaveAuditSet';
      values={...values,...r,optId:optIds.map(i=>i.key).join(','),customerId};
   }else{
      Url = r.id?'updateCNGAuditSet':'saveCNGAuditSet';
      const auditId = optIds.map(i=>i.key).join(',');
      values={...values,...r,auditId,customerId};
   }
   delete values.addtime;
   httpServer[Url](values).then((res) => {
      if (res.code === 200) {
        const args = {
          message: '通信成功',
          description: res.msg,
          duration: 2,
        };
        notification.success(args);
        this.getListLeaveAuditSet();
      }else{
        if(res.message ==='Request failed with status code 500'){
          console.log(res.message);
        }else{
          const args = {
            message: '通信失败',
            description: res.msg,
            duration: 2,
          };
          notification.error(args);
        }
      }
    }).catch((error)=>{
      console.log(error);
    });
  }

  //树形节点渲染
  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.departmentName} key={item.id} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} />;
  })

  //删除
  handleRowDelete(r){
    if(!r.id){
      const {dataSource} = this.state;
      const index = dataSource.findIndex(t=>(t.deptId==r.id)); 
      dataSource.splice(index,1);
      this.setState({dataSource})
      
    }else{
      const {type} = this.state;
      const Url = type==='leave'?'deleteLeaveAuditSet':'deleteCNGAuditSet';
      httpServer[Url]({id:r.id}).then((res)=>{
         if (res.code === 200) {
            const args = {
              message: '通信成功',
              description: res.msg,
              duration: 2,
            };
            notification.success(args);
            this.getListLeaveAuditSet();
          } else {
            if(res.message ==='Request failed with status code 500'){
                console.log(res.message);
             }else{
                 const args = {
                message: '通信失败',
                description: res.msg,
                duration: 2,
              };
              notification.error(args);
             }
          }
      }).catch((err)=>{
        console.log(err);
      });
    }
  }
  changeType=(type)=>{
     this.setState({type,activeKey:''},()=>{
       this.getListLeaveAuditSet()
     })
  }
  listOperators() {
    const {customerId} = this.props.auth;
    httpServer.listOperator({customerId}).then(res => {
       if(res.data&&res.data.length>0){
            let obj = {};
            res.data.forEach(i=>{
               obj[i.id] = i.name
            })
            this.setState({operatorInfo:obj},()=>{
               this.getListLeaveAuditSet()
            });
       }else{
          this.setState({operatorInfo:{}});
          const args = {
              message: '提示',
              description:'获取员工失败',
              duration: 2,
          };
          notification.error(args);
       }
    })
  }
  listOperatorByDept=(r)=>{
    const {customerId} = this.props.auth;
    httpServer.listAuditOperator({deptId:r.deptId}).then(res => {
       if(res.data&&res.data.length>0){
            const opts = r.optId||r.auditId;
            const {operatorInfo} = this.state;
            this.setState({operators:res.data.filter(i=>(i.status==1)),activeKey:r.deptId,optIds:opts?opts.split(',').map(o=>({key:o,label:operatorInfo[o]})):[]})
       }else{
          this.setState({operators:[],activeKey:''});
          const args = {
              message: '提示',
              description:'没有找到部门下的成员',
              duration: 2,
          };
          notification.error(args);
       }
    })
  }
  edit=(r)=>{
    this.listOperatorByDept(r)
  }
  changeOperators=(v)=>{
    this.setState({optIds:v})
  }
  render(){
    const {treeData,dataSource,type,activeKey,operators,optIds,operatorInfo} = this.state;
    const columns =type==='leave'?[{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      key:'serialNumber',
      width:'5%'
    },{
      title: '审核部门',
      dataIndex: 'deptName',
      key: 'deptName',
      width:'10%'
    },{
      title: '审核人员',
      dataIndex: 'optId',
      key: 'optId',
      width:'25%',
      render:(text,record)=>{
         if(activeKey===record.deptId){
          const ids = optIds.map(i=>+i.key);
            let opts = operators.filter(o => !ids.includes(o.id));
           return(
              <Select  mode="multiple" style={{width:'100%'}} onChange={this.changeOperators} value={optIds} labelInValue >
                 {
                  opts.map(t=>(<Option key={t.id}>{t.name}</Option>))
                 }
              </Select>
           )
         }else{
            if(text){
              const arr = text.split(',')
              return arr.map(a=>(operatorInfo[a])).join('/');
            }
         }
      }
    },{
      title:'操作',
      dataIndex:'action',
      key:'action',
      width:'10%',
      render:(text,record)=>{
        return(
          <span>
              { record.deptId===activeKey?
                <span>
                  <a href="javascript:;" style={{color:'#2ebc2e'}} onClick={()=>{this.handleSave(record)}} >保存</a>
                  <Divider type="vertical" />
                  <a href="javascript:;" style={{color:'#2ebc2e'}} onClick={()=>{this.setState({activeKey:'',operators:[]})}} >取消</a>
                </span>
                :<a href="javascript:;" style={{color:'#2ebc2e'}} onClick={()=>{this.edit(record)}} >编辑</a>
              }
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record)}>
                <a href="javascript:;" style={{color:'#2ebc2e'}}>删除</a>
              </Popconfirm>
          </span>
        )
      },
    }]:[{
      title: '序号',
      render:(text,record,index)=>`${index+1}`,
      key:'serialNumber',
      width:'5%'
    },{
      title: '审核部门',
      dataIndex: 'deptName',
      key: 'deptName',
      width:'10%'
    },{
      title: '审核人员',
      dataIndex: 'auditId',
      key: 'auditId',
      width:'25%',
      render:(text,record)=>{
         if(activeKey===record.deptId){
           const ids = optIds.map(i=>+i.key);
           let opts = operators.filter(o => !ids.includes(o.id));
           return(
              <Select  mode="multiple" style={{width:'100%'}} onChange={this.changeOperators} value={optIds} labelInValue>
                 {
                  opts.map(t=>(<Option key={t.id} value={t.id}>{t.name}</Option>))
                 }
              </Select>
           )
         }else{
            if(text){
              const arr = text.split(',');
              return arr.map(a=>(operatorInfo[a])).join('、');
            }
            
         }
      }
    },{
      title:'操作',
      dataIndex:'action',
      key:'action',
      width:'10%',
      render:(text,record)=>{
        return(
          <span>
              { record.deptId===activeKey?
                <span>
                  <a href="javascript:;" style={{color:'#2ebc2e'}} onClick={()=>{this.handleSave(record)}} >保存</a>
                  <Divider type="vertical" />
                  <a href="javascript:;" style={{color:'#2ebc2e'}} onClick={()=>{this.setState({activeKey:'',operators:[]})}} >取消</a>
                </span>
                :<a href="javascript:;" style={{color:'#2ebc2e'}} onClick={()=>{this.edit(record)}} >编辑</a>
              }
              <Divider type="vertical" />
              <Popconfirm title="确定删除?" onConfirm={() => this.handleRowDelete(record)}>
                <a href="javascript:;" style={{color:'#2ebc2e'}}>删除</a>
              </Popconfirm>
          </span>
        )
      }
    }];
    return(
      <Fragment>
        <BreadcrumbCustom first="基础信息" second="出院审核部门设置" />
        <Row gutter={16}>
          <Col md={10} lg={8} xl={6}>
            <Card title="部门列表"  bordered={false} >
               <Tree
                defaultExpandAll={true}
                onSelect={this.onSelect}
              >
                {this.renderTreeNodes(treeData)}
              </Tree>
            </Card>
          </Col>
          <Col md={14} lg={16} xl={18}>
            <Card 
               title="审核部门列表" 
               bordered={false} 
               extra={
                  <Select value={type} onChange={this.changeType} style={{width:160}}>
              <Option value="leave">老人离院审核</Option>
              <Option value="nursing">护理等级变更审核</Option>
            </Select>
                }
            >
              <Table 
                bordered
                dataSource={dataSource} 
                columns={columns} 
                pagination={{ showSizeChanger:true , showQuickJumper:true , pageSizeOptions:['10','20','30','40','50','100']}}
                rowKey={record => record.deptId}
              />
            </Card>
            
          </Col>
        </Row>
      </Fragment>
    )
  }
}

export default LeaveAuditSet;