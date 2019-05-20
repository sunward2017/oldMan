import React from 'react';
import { Form, Input, Button,InputNumber } from 'antd';

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
    return (
      <span>
        <Input
          type="text"
          size={size}
          value={state.itemName}
          placeholder="收费项目"
          onChange={this.handleNumberChange}
          style={{ width: '60%', marginRight: '3%' }}
        />
        <InputNumber
          min={1}
          size={size}
          value={state.money}
          onChange={this.handleCurrencyChange}
          style={{ width: '32%',marginRight: '1%'}}
        />
      </span>
    );
  }
}

export default ItemInput;