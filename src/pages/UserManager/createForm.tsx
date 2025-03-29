import React, { useState } from 'react';
import { Button, Drawer, Form, Input, Select, Row, Col, notification } from 'antd';
import { useMount } from 'ahooks';
import { register } from '@/service/userService';
import { IRegisterUser } from '@/service/userService/type.ts';
import { filterNullAndUndefined } from '@/utils/commonFunction.ts';
import './createForm.scss';

interface ISCreateMenuProps {
  open: boolean;
  onClose: () => void;
}

const CreateForm: React.FC<ISCreateMenuProps> = (props) => {
  const { open, onClose } = props;
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [form] = Form.useForm();

  useMount(() => {
    setLoading(false);
  });

  const onSubmit = async () => {
    const values = await form.validateFields();
    if (!values) return;
    try {
      setSaveLoading(true);
      const params = filterNullAndUndefined(values) as IRegisterUser;
      const res = await register({ ...params, password: '123456' });
      if (res) {
        notification.open({
          type: 'success',
          message: '系统提示',
          description: '新增用户成功',
        });
        onClose();
      }
    } catch (error) {
      console.log(error, 'error');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Drawer
      className='creature-drawer'
      open={open}
      title='添加用户'
      destroyOnClose
      width={600}
      onClose={onClose}
      loading={loading}
      footer={
        <div className='footer'>
          <Button type='primary' className='footer-button' loading={saveLoading} onClick={onSubmit}>
            确定
          </Button>
          <Button type='default' className='footer-button' onClick={onClose}>
            取消
          </Button>
        </div>
      }
    >
      <div className='createUser'>
        <Form form={form} layout='vertical' initialValues={{}}>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label='用户名'
                name='username'
                rules={[{ required: true, message: '请输入用户名' }]}
              >
                <Input placeholder='请输入用户名' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='姓名'
                name='nickname'
                rules={[{ required: true, message: '请输入姓名' }]}
              >
                <Input placeholder='请输入姓名' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label='邮箱'
                name='email'
                rules={[{ required: true, message: '请输入邮箱' }]}
              >
                <Input placeholder='请输入邮箱' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='手机号'
                name='phone'
                rules={[{ required: true, message: '请输入手机号' }]}
              >
                <Input placeholder='请输入手机号' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label='用户类型'
                name='type'
                rules={[{ required: true, message: '请选择用户类型' }]}
              >
                <Select
                  options={[
                    {
                      value: 'admin',
                      label: '超级管理',
                    },
                  ]}
                  placeholder='请选择用户类型'
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='所属组织'
                name='organization'
                rules={[{ required: false, message: '请选择所属组织' }]}
              >
                <Select options={[]} placeholder='请选择所属组织' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item label='账户角色' name='role'>
                <Select options={[]} placeholder='请选择权限角色' />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label='是否生效'
                name='status'
                rules={[{ required: true, message: '请选择是否生效' }]}
              >
                <Select
                  options={[
                    {
                      value: '1',
                      label: '启用',
                    },
                    {
                      value: '2',
                      label: '禁用',
                    },
                  ]}
                  placeholder='请选择状态'
                />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </div>
    </Drawer>
  );
};

export default CreateForm;
