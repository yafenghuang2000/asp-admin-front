import React, { useEffect, useMemo, useState } from 'react';
import { Button, Drawer, Form, Input, InputNumber, notification, Select } from 'antd';
import { addMenu } from '@/service/userService';
import { filterNullAndUndefined } from '@/utils/commonFunction.ts';
import { IScreateMensItems } from '@/service/userService/type.ts';
import { titleConfig, ISMenuDetail } from './data';
import './createmenu.scss';

const { TextArea } = Input;

interface ISCreateMenuProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  menuDetail: ISMenuDetail | null;
  getMenuAll: () => void;
}

const CreateMenu: React.FC<ISCreateMenuProps> = (props) => {
  const { open, setOpen, title, getMenuAll, menuDetail } = props;
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [form] = Form.useForm();

  const menuTitle = useMemo(() => {
    const value = titleConfig.find((item) => item.id === title);
    return value?.title;
  }, [title]);

  useEffect(() => {
    setLoading(false);
  }, []);
  const onClose = () => {
    setOpen(false);
  };

  const onSubmit = async () => {
    try {
      setSaveLoading(true);
      const values = await form.validateFields();
      const params = {
        id: values.id,
        title: values.title,
        code: values.code,
        path: values.path,
        type: values.type,
        description: values.description,
        remark: values.remark,
        sortOrder: values.sortOrder || 0,
      };

      if (['createMenu', 'editMenu'].includes(title)) {
        Object.assign(params, {
          parentId: menuDetail?.id,
        });
      }

      const res = await addMenu(filterNullAndUndefined(params) as IScreateMensItems);
      onClose();
      getMenuAll();
      notification.open({
        type: 'success',
        message: '提示',
        description: res,
        placement: 'bottomRight',
      });
    } catch (error) {
      console.log(error, 'err');
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <Drawer
      onClose={onClose}
      className='creature-drawer'
      open={open}
      title={menuTitle}
      width={600}
      destroyOnClose
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
      <div className='creature'>
        <Form form={form} labelCol={{ span: 4 }} layout='horizontal' initialValues={{}}>
          {['createSys', 'editSys'].includes(title) && (
            <>
              <Form.Item
                label='系统名称'
                name='title'
                rules={[{ required: true, message: '系统名称不能为空' }]}
              >
                <Input placeholder='系统名称' />
              </Form.Item>
              <Form.Item
                label='系统编码'
                name='code'
                rules={[{ required: true, message: '系统编码不能为空' }]}
              >
                <Input placeholder='系统编码' />
              </Form.Item>

              <Form.Item
                label='系统地址'
                name='path'
                rules={[{ required: true, message: '系统地址不能为空' }]}
              >
                <Input placeholder='系统地址' />
              </Form.Item>
              <Form.Item
                label='菜单类型'
                name='type'
                rules={[{ required: true, message: '菜单类型不能为空' }]}
              >
                <Select
                  options={[
                    { value: '目录', label: '目录' },
                    { value: '菜单', label: '菜单' },
                    { value: '系统', label: '系统' },
                  ]}
                  placeholder='请选择菜单类型'
                />
              </Form.Item>
              <Form.Item
                label='描述'
                name='description'
                rules={[{ required: true, message: '描述不能为空' }]}
              >
                <Input placeholder='描述' />
              </Form.Item>
              <Form.Item
                label='备注'
                name='remark'
                rules={[{ required: true, message: '备注不能为空' }]}
              >
                <Input placeholder='备注' />
              </Form.Item>
            </>
          )}
          {['createMenu', 'editMenu'].includes(title) && (
            <>
              <Form.Item
                label='菜单名称'
                name='title'
                rules={[{ required: true, message: 'Please input!' }]}
              >
                <Input placeholder='菜单名称' />
              </Form.Item>
              <Form.Item
                label='菜单编码'
                name='code'
                rules={[{ required: true, message: '系统名称不能为空' }]}
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
              <Form.Item
                label='菜单类型'
                name='type'
                rules={[{ required: true, message: '菜单类型不能为空' }]}
              >
                <Select
                  options={[
                    { value: '目录', label: '目录' },
                    { value: '菜单', label: '菜单' },
                  ]}
                  placeholder='请选择菜单类型'
                />
              </Form.Item>
              <Form.Item label='菜单图标' name='icon'>
                <Input placeholder='菜单图标' />
              </Form.Item>
              <Form.Item label='菜单排序' name='sortOrder'>
                <InputNumber style={{ width: '100%' }} placeholder='菜单排序' />
              </Form.Item>
              <Form.Item label='备注信息' name='remark'>
                <TextArea rows={4} placeholder='备注信息' maxLength={6} />
              </Form.Item>
            </>
          )}
        </Form>
      </div>
    </Drawer>
  );
};

export default CreateMenu;
