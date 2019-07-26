import React from 'react';
import {  Button, Table,Card} from 'antd';
export class BillInfo extends React.Component{
    state = {
        isSubmit:false,
        selectedRows:[],
    };
    rowSelection = {
	    onChange: (selectedRowKeys, selectedRows) => {
	    	const { data }= this.props;
	    	this.props.onBillSubmit(selectedRows,data.type)
	    }
    };
    render() {
        const {data, columns,title} = this.props;
        const {moneyLeft,selectedRows } = this.state;
        
        return (
            <React.Fragment> 
	            <Card title={title} headStyle={{fontWeight:'bold',color:'#62bbef'}}>
	                <Table
	                   size='small'
	                   pagination={ false }
	                   columns={columns} 
	                   dataSource={data.dataSource} 
	                   rowKey={record => record.id}  
	                   rowSelection={this.rowSelection}
	                />
	            </Card>    
            </React.Fragment>
        )
    }
}