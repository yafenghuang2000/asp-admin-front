import React from 'react';
import { Form, Input, Select, Button } from 'antd';

const FormSearcher: React.FC = () => {
  const [form] = Form.useForm();
  return (
    <Form form={form} initialValues={{}}>
      <div className='form'>
        <div className='form-item'>
          <Form.Item label='用户名' name='username'>
            <Input placeholder='请输入用户名' />
          </Form.Item>
        </div>
        <div className='form-item'>
          <Form.Item label='状态' name='status'>
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
        </div>
        <div className='form-item'>
          <Form.Item label='用户类型' name='type'>
            <Select
              options={[
                {
                  value: '1',
                  label: '超级管理员',
                },
              ]}
              placeholder='请选择用户类型'
            />
          </Form.Item>
        </div>
        <div className='form-item'>
          <Form.Item label='组织' name='organization'>
            <Select placeholder='请选择组织' />
          </Form.Item>
        </div>
        <div className='form-button'>
          <Form.Item>
            <div style={{ display: 'flex', gap: '12px' }}>
              <Button type='default' htmlType='reset'>
                重置
              </Button>
              <Button type='primary' htmlType='submit'>
                查询
              </Button>
            </div>
          </Form.Item>
        </div>
      </div>
    </Form>
  );
};

export default FormSearcher;
