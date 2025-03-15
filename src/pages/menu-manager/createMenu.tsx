import React, { useEffect, useState } from 'react';
import { Drawer, Form, Input, InputNumber } from 'antd';
import './createmenu.scss';

const { TextArea } = Input;

interface ISCreateMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const CreateMenu: React.FC<ISCreateMenuProps> = (props) => {
  const { open, setOpen } = props;
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    setLoading(false);
  }, []);
  const onClose = () => {
    setOpen(false);
  };

  return (
    <Drawer
      onClose={onClose}
      open={open}
      title='创建菜单'
      width={600}
      destroyOnClose
      loading={loading}
    >
      <div className='creature'>
        <Form
          form={form}
          labelCol={{ span: 4 }}
          layout='horizontal'
          initialValues={{ variant: 'filled' }}
        >
          <Form.Item
            label='菜单名称'
            name='name'
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input placeholder='菜单名称' />
          </Form.Item>
          <Form.Item
            label='菜单编码'
            name='code'
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input placeholder='菜单编码' />
          </Form.Item>
          <Form.Item
            label='菜单地址'
            name='path'
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <Input placeholder='菜单地址' />
          </Form.Item>
          <Form.Item label='菜单图标' name='icon'>
            <Input placeholder='菜单图标' />
          </Form.Item>
          <Form.Item label='菜单排序' name='stor'>
            <InputNumber style={{ width: '100%' }} placeholder='菜单排序' />
          </Form.Item>
          <Form.Item label='备注信息' name='remark'>
            <TextArea rows={4} placeholder='备注信息' maxLength={6} />
          </Form.Item>
        </Form>
      </div>
    </Drawer>
  );
};

export default CreateMenu;
