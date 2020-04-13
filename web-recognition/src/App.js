import React, { Component } from 'react'
import { PageHeader, Steps, Upload, Modal, Button, Empty, Tag, Card, Col, Row, Message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './App.css';
import axios from 'axios'

const { Step } = Steps;

class App extends Component {

  constructor() {
    super()
    this.state = {
      imgList: null,
      current: 0,
      result: false,
      carInfo: null
    }
  }

  saveImg = (file) => {
    if(!file) throw new Error('file is not defined')

    this.setState({imgList: file})
    
    this.changeCurrent(1)
  }

  clearImg = () => {
    this.setState({ imgList: null})

    this.changeCurrent(0)
    this.initCarInfo()
  }
  initCarInfo = () => {
    this.setState({
      result: false,
      carInfo: null
    })
  }

  changeCurrent = (current) => {
    if(typeof current == "undefined" || !(typeof current == "number")) throw new Error('current error')
    
    this.setState({ current })
  }

  setResult = (result) => {
    this.setState({ result})
  }

  sendImgUrl = () => {

    if(this.state.result) {
      return Message.error('请勿重新提交')
    }

    let image = this.state.imgList
    if(image.includes('base64,')) {
      image = image.substring(image.indexOf('base64,') + 7)
    }

    axios.post('/api/getCarInfo', {
      image
    }).then(res => {
      this.changeCurrent(2)
      console.log(res)

      this.setResult('true')
      let carInfo = res.data.plates[0]

      this.setState({carInfo})

    })
  }

  render () {
    let { result, carInfo } = this.state
   return (
    <div className="App">
        <Title></Title>
        <StepCom current={this.state.current} />

        <section className="result-container">
          <Result result={result} carInfo={carInfo} />
        </section>

       <section className="btn-container">
          <PicturesWall parent={this} />
          <BtnItem parent={this} disabled={this.state.imgList ? false : true}>提交</BtnItem>
        </section>
    </div>
  );
  }
}

class Title extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: '阿里云车牌识别',
      subtitle: 'react+node.js'
    }
  }

  render() {
    return (
        <PageHeader
        className="site-page-header"
          title= { this.state.title }
          // subTitle= { this.state.subtitle }
          tags={<Tag color="blue">{this.state.subtitle}</Tag>}
          />
    )
  }
}


class StepCom extends Component {
  state = {
    // current: 0,
    stepText: [
      {
        status: 'wait',
        title: '上传图片'
      },
      {
        status: 'wait',
        title: '提交'
      },
      {
        status: 'wait',
        title: '显示结果'
      }
    ]
  };

  onChange = current => {
    console.log('onChange:', current);
  };

  render() {
    const { stepText } = this.state;
    const { current } = this.props
    return (
      <div>
        <Steps
          type="navigation"
          current={current}
          onChange={this.onChange}
          className="site-navigation-steps"
        >
          {
            stepText.map((item, index) => {
              return (
                <Step status={item.status} title={item.title} key={index} disabled={true} />
              )
            })
          }
        </Steps>
      </div>
    );
  }
}

function getBase64(file) {
  if(!file) throw new Error('file is not defined')
  
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

class PicturesWall extends Component {
  constructor(props) {
    super(props)
    this.state = {
      previewVisible: false,
      previewImage: '',
      fileList: [],
    }
  };

  handleCancel = () => {
    this.setState({ previewVisible: false })
  };
  
  handleRemove = () => {
    this.props.parent.clearImg()
  }

  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
    });

    console.log('delete')
  };

  handleChange = ({ fileList }) => {
    this.setState({ fileList })
    // console.log(fileList[0].thumbUrl)
    // console.log(this)
    if(fileList && fileList[0] && fileList[0].thumbUrl) {
      this.props.parent.saveImg(fileList[0].thumbUrl)
    }
  };

  render() {
    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">Upload</div>
      </div>
    );
    return (
      <div className="clearfix">
        <Upload
          action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
          listType="picture-card"
          fileList={fileList}
          onPreview={this.handlePreview}
          onChange={this.handleChange}
          onRemove={this.handleRemove}
        >
          {fileList.length >= 1 ? null : uploadButton}
        </Upload>
        <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </div>
    );
  }
}

class BtnItem extends Component {
  constructor(props) {
    super(props)
    this.state = {
      
    }
  }

  btnClick = () => {
    this.props.parent.sendImgUrl()
  }

  render() {
    return (
      <div className="btn">
        <Button onClick={this.btnClick} type="primary" disabled={this.props.disabled}>{this.props.children ||'按钮'}</Button>
      </div>
    )
  }
}


class Result extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    let dom = null
    let { result, carInfo } = this.props

    let carInfoList = [
      {
        name: 'cls_name',
        title: '车型'
      },
      {
        name: 'txt',
        title: '车牌号'
      },
      {
        name: 'prob',
        title: '车牌号置信度'
      }
    ]
    if(result) {
      dom =(  <div className="site-card-wrapper">
          <Row gutter={16}>
            {
              carInfoList.map(i => {
                if(carInfo === null) {
                  return ''
                }
                return (<Col span={8} key={i.name}>
                  <Card title={i.title} bordered={false}>
                    {
                      <Tag color="#108ee9">{carInfo[i.name]}</Tag>
                    }
                  </Card>
                </Col>)
              })
            }
          </Row>
        </div> 
      )
    } else {
      dom =  <Empty />
    }
    return (
      dom
    )
  }
}



export default App;
