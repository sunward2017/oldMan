import React,{Fragment} from 'react';
import { Route, Switch } from 'react-router-dom';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import ElderlyByRoom from '@/common/elderlyByRoom';
import drugSchedule from './drugSchedule';

export default class HealthRecord extends React.Component {
    state = {
        editFlag:false,
        baseUrl:'/app/pension-agency/medicalCare/healthRecord'
    };
    componentDidMount(){
        //console.log('record index props:',this.props);
    }
    render() {
        const { match } = this.props;
        return (
            <div>
                <Switch>
                    <Route exact path={match.path} component={props => <ElderlyByRoom {...props} auth={this.props.auth} />} />
                    <Route exact path={`${match.path}/edit`} auth={this.props.auth} component={drugSchedule} />
                </Switch>
            </div>
        )
    }
}