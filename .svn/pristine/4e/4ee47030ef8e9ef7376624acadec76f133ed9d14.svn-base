import React,{Fragment} from 'react';
import { Route, Switch } from 'react-router-dom';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import RecordList from './recordList';

export default class MonthBirthday extends React.Component {
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
                <BreadcrumbCustom first="查询统计" second="本月生日人员" />
                <RecordList {...this.props}  auth={this.props.auth} />
            </Fragment>
        )
    }
}