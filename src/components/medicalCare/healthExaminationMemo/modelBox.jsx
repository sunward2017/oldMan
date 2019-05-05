import React from 'react';
import { Modal, } from 'antd';

export default ({children, onCancel, setting}) => {
    return (
        <Modal
            visible={true}
            onCancel={onCancel}
            footer={null}
            {...setting}
        >
            {children}
        </Modal>
    )
}