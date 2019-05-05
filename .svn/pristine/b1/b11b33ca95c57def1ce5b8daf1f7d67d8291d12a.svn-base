import React,{Fragment} from 'react';
import { Route, Switch } from 'react-router-dom';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import ElderlyByRoom from '@/common/elderlyByRoom';
import RecordList from './recordList'

export default class HealthRecord extends React.Component {
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
            <div>
                <Switch>
                    <Route exact path={match.path} component={props => <ElderlyByRoom {...props} auth={this.props.auth} />} />
                    <Route exact path={`${match.path}/list`} auth={this.props.auth} component={RecordList} />
                </Switch>
            </div>
        )
    }
}