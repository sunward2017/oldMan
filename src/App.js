import React, { Component } from 'react';
import { Layout, LocaleProvider} from 'antd';
import './style/index.less';
import SiderCustom from './components/SiderCustom';
import HeaderCustom from './components/HeaderCustom';
import { receiveData, isLogin } from './action';
import { connect } from 'react-redux';
import Routes from './routes';
import zh_CN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';

const { Content} = Layout;

class App extends Component {
    state = {
        collapsed: false,
        auth: JSON.parse(sessionStorage.getItem('auth')),
    };
    componentWillMount() {
        this.props.loginStatus(!!this.state.auth);
        this.getClientWidth();
        window.onresize = () => {
            this.getClientWidth();
        }
    }
    componentDidMount() {
        // console.log('App props:',this.props);
    }
    getClientWidth = () => {    // 获取当前浏览器宽度并设置responsive管理响应式
        const clientWidth = document.body.clientWidth;
        // console.log(clientWidth);
        this.props.isMobileView({isMobile: clientWidth <= 992},'responsive');
    };
    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };
    render() {
        // console.log(this.props.responsive);
        const { responsive, location } = this.props;
        const { auth } = this.state;
        return (
            <Layout>
                {!responsive.data.isMobile && <SiderCustom collapsed={this.state.collapsed} auth={auth} />}
                <Layout style={{flexDirection: 'column'}} >
                    <HeaderCustom toggle={this.toggle} collapsed={this.state.collapsed} user={auth || {}} />
                    <Content style={{ margin: '0 16px', overflow: 'initial'}}>
                        <LocaleProvider locale={zh_CN}>
                          <Routes auth={auth} location={location} />
                        </LocaleProvider>
                    </Content>
                </Layout>
            </Layout>
        );
    }
}

const mapStateToProps = state => {
    const { responsive = {data: {}} } = state.httpData;
    const auth = state.myAuth;
    return {auth, responsive};
};
const mapDispatchToProps = dispatch => ({
    isMobileView:(data, category) => {
        dispatch(receiveData(data, category))
    },
    loginStatus:(data) => {
        dispatch(isLogin(data))
    }
});
export default connect(mapStateToProps, mapDispatchToProps)(App);
