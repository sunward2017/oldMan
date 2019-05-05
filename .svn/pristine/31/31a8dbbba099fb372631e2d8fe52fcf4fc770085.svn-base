import React,{Fragment} from 'react';
import { Route, Switch } from 'react-router-dom';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import RecordList from './recordList';

export default class LeavingNursingHome extends React.Component {
    state = {
        editFlag:false,
        baseUrl:'/app/pension-agency/medicalCare/healthRecord'
    };
    componentDidMount(){
        console.log('record index props:',this.props);
    }
    render() {
      const { match } = this.props;
        return (
            <Fragment>
                <BreadcrumbCustom first="查询统计" second="离院老人" />
                <RecordList {...this.props}  auth={this.props.auth} />
            </Fragment>
        )
    }
}