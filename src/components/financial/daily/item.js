import React from 'react';
import { Form, Input, Button,InputNumber,Select} from 'antd';

class ItemInput extends React.Component {
  static getDerivedStateFromProps(nextProps) {
    // Should be a controlled component.
    if ('value' in nextProps) {
      return {
        ...(nextProps.value || {}),
      };
    }
    return null;
  }

  constructor(props) {
    super(props);
    const value = props.value || {};
    this.state = {
      money: value.money || 1,
      itemName: value.itemName||'',
      payType: value.payType||'支付宝',
    };
  }

  handleNumberChange = e => {
  	const  itemName = e.target.value;
    if (!('value' in this.props)) {
      this.setState({itemName});
    }
    this.triggerChange({itemName});
  };

  handleCurrencyChange = money => {
    if (!('value' in this.props)) {
      this.setState({ money });
    }
    this.triggerChange({money });
  };
  
   handleTypeChange = payType => {
    if (!('value' in this.props)) {
      this.setState({ payType });
    }
    this.triggerChange({payType});
  };
  triggerChange = changedValue => {
    // Should provide an event to pass value to Form.
    const onChange = this.props.onChange;
    if (onChange) {
      onChange(Object.assign({}, this.state, changedValue));
    }
  };

  render() {
    const { size } = this.props;
    const state = this.state;
    const types=["支付宝",'微信',"现金","刷卡","转账","其他"];
    return (
      <span>
        <Input
          type="text"
          size={size}
          value={state.itemName}
          placeholder="收费项目"
          onChange={this.handleNumberChange}
          style={{ width: '35%', marginRight: '2%' }}
        />
        <InputNumber
          min={1}
          size={size}
          value={state.money}
          onChange={this.handleCurrencyChange}
          style={{ width: '32%',marginRight: '2%'}}
        />
        <Select style={{ width:'20%',marginRight:'1%'}} value={state.payType} onChange={this.handleTypeChange}>
            {types.map(i=>(<Select.Option key={i}>{i}</Select.Option>))}
        </Select>
      </span>
    );
  }
}

export default ItemInput;