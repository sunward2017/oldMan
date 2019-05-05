import React, { Component } from 'react';
import { Upload, Icon, Modal ,message} from 'antd';
import  urls from '@/routes/config';
class PicturesWall extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
    };
  }
  componentDidMount(){
    const _this = this;
    if(_this. props.A01){
      _this.setState({fileList:[{
      uid: '-1',
      name: 'xxx.png',
      status: 'done',
      url: _this.props.A01,
    }]});
    }
  }


  handleCancel = () => this.setState({ previewVisible: false })

  handlePreview = (file) => {
    this.setState({
      previewImage: file.url || file.thumbUrl,
      previewVisible: true,
    });
  }

  handleChange= ({ fileList,file }) => {
    const _this = this;
    this.setState({ fileList });
    if (file.status === 'done') {
        const { response } = file;
        if (response.result === 200) {
            message.success(`${file.name}文件上传成功`);
            // console.log(response.data);
            // const obj = {};
            // obj.A01=response.data;
            _this.props.changUrl(response.data);
        } else {
            message.error(`${file.name} 上传失败`);
        }
    } else if (file.status === 'error') {
        message.error(`${file.name}异常`);
    }
     console.log('file===',file);
  }

  handleBeforeUpload(file){
    console.log(file);
    const isJPG = file.type === 'image/jpeg'||file.type==='image/png';
    if (!isJPG) {
        message.error('只能上传jpg/png格式');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
        message.error('图片不能大于2MB!');
    }

    return isJPG && isLt2M;
  }

  handleRemove(){
    this.props.deleteUrl();
  }

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus" />
        <div className="ant-upload-text">上传头像</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action={urls.upLoadImg}
          name="img"
          listType="picture-card"
          fileList={fileList}
          onPreview={(file)=>{this.handlePreview(file)}}
          onChange={({ fileList ,file})=>{this.handleChange({ fileList,file })}}
          beforeUpload={(file)=>{this.handleBeforeUpload(file)}}
          onRemove={()=>{this.handleRemove()}}
          className="upLoadImg2_upload"
          disabled={this.props.disabled}
        >
          {fileList.length >= 1? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

export default PicturesWall;