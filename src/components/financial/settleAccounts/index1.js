import React,{Fragment} from 'react';
import { Route, Switch } from 'react-router-dom';
import BreadcrumbCustom from '../../BreadcrumbCustom';
import ElderlyByRoom from './elderly';
import Page from './page'

export default class HealthRecord extends React.Component {
    state = {
        editFlag:false,
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
                    <Route exact path={`${match.path}/page`} component={props=><Page {...props} auth={this.props.auth} />} />
                </Switch>
            </div>
        )
    }
}