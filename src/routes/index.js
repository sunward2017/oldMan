import React, { Component } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { adminMenus } from './config.admin';
import { clientMenus } from './config.client';
import AllComponents from './config';

export default class CRouter extends Component {
    state = {
        routesConfig : adminMenus.concat(clientMenus),
    };
    shouldComponentUpdate(nextProps) {
        return nextProps.location !== this.props.location;
    }
    requirePermission = (component, path) => {
        const { auth } = this.props;
        // console.log('routes......props auth:',auth);
        if(!auth) return <Redirect to={'/login'} />;
        const isPermission = auth.level ===2 ? /^\/app\/admin\//.test(path) : /^\/app\/pension-agency\//.test(path);
        // console.log('isPermission:',isPermission);
        if (!isPermission) return <Redirect to={'404'} />;
        return component;
    };
    render() {
        const { routesConfig } = this.state;
        const { auth } = this.props;
        return (
            <Switch>
                {
                    routesConfig.map(rt => {
                        const route = r => {
                            const Component = AllComponents[r.component];
                            return (
                                <Route
                                    key={r.key}
                                    path={ r.key}
                                    component={(props) => this.requirePermission(<Component {...props} auth={auth} />, r.key)}
                                />
                            )
                        };
                        return rt.component ? route(rt) : rt.sub.map(r => route(r));
                    })
                }
                <Route render={() => <Redirect to="/404" />} />
            </Switch>
        )
    }
}