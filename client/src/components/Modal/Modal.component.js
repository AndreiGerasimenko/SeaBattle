import React from 'react';
import { Modal } from 'antd';

export const ModalComponent = ({
    type, 
    onOk, 
    onCancel, 
    modalText, 
    confirmLoading, 
    confirmNotification
}) => {
    if(confirmNotification) {
        return (
            <Modal 
            title={type}
            visible={!!type}
            onOk={onOk}
            centered={true}
            closable={false}
            keyboard={false}
            maskClosable={false}
            cancelButtonProps={{ style: { display: 'none'}}}
        >
            {modalText}
        </Modal>
        )
    }

    if(type === "Waiting...") {
        return (
            <Modal 
            title={type}
            visible={!!type}
            centered={true}
            closable={false}
            keyboard={false}
            maskClosable={false}
            footer={null}
        >
            {
                modalText || "Waiting for the response"
            }
        </Modal>
        )
    } else {
        return (
            <Modal 
                title={type}
                visible={!!type}
                onCancel={onCancel}
                onOk={onOk}
                centered={true}
                closable={false}
                keyboard={false}
                maskClosable={false}
                okText="Confirm"
                cancelText="Reject"
                confirmLoading={confirmLoading}
            >
                {modalText}
            </Modal>
        )
    }
}