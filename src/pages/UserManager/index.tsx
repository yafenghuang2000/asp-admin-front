import React, { useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Button, Flex, Table, Pagination } from 'antd';
import type { TableProps } from 'antd';
import { useMount } from 'ahooks';
import FormSearcher from './FormSearcher.tsx';
import CreateForm from './createForm.tsx';
import './index.scss';

const UserManager: React.FC = () => {
  const tableRef = useRef<HTMLDivElement | null>(null);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(20);
  const [total, setTotal] = useState(0);
  const [tableLoading, setTableLoading] = useState(false);
  const [maxHeight, setMaxHeight] = useState(200);
  const [open, setOpen] = useState(false);

  useMount(() => {
    setTableLoading(true);

    setCurrent(1);
    setPageSize(20);
    setTotal(10000);

    if (tableRef.current) {
      setMaxHeight(tableRef?.current?.offsetHeight - 20);
    }

    // TODO: 模拟请求数据
    setTimeout(() => {
      setTableLoading(false);
    }, 1000);
  });

  const column: TableProps['columns'] = [
    {
      title: '用户名',
      dataIndex: 'username',
    },
    {
      title: '姓名',
      dataIndex: 'name',
    },
    {
      title: '状态',
      dataIndex: 'status',
    },
    {
      title: '手机号码',
      dataIndex: 'iphone',
    },
    {
      title: '用户类型',
      dataIndex: 'address',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
    },
    {
      title: '组织',
      dataIndex: 'organization',
    },
    {
      title: '操作',
      dataIndex: 'option',
      key: 'option',
      width: 100,
      fixed: 'right',
      render: () => [
        <Button key='1' type='link'>
          详情
        </Button>,
      ],
    },
  ];

  return (
    <div className='userManager'>
      <div className='userManager-header'>
        <div className='userManager-header-title'>用户管理</div>
        <div className='userManager-header-btn'>
          <Flex wrap gap='small'>
            <Button type='primary' icon={<PlusOutlined />} onClick={() => setOpen(true)}>
              添加用户
            </Button>
            <Button type='primary' icon={<PlusOutlined />}>
              批量启用/禁用
            </Button>
          </Flex>
        </div>
      </div>
      <div className='userManager-table'>
        <div className='userManager-table-content'>
          <div className='userManager-table-content-form'>
            <FormSearcher />
          </div>
          <div className='userManager-table-content-table'>
            <div className='table' ref={tableRef}>
              <Table
                loading={tableLoading}
                dataSource={[{ id: 1 }]}
                pagination={false}
                columns={column}
                bordered={true}
                size='small'
                virtual
                rowKey='id'
                scroll={{
                  y: maxHeight,
                }}
              />
            </div>
            <div className='pagination'>
              <Pagination
                total={total}
                pageSizeOptions={[10, 20, 30, 40, 50, 100]}
                current={current}
                pageSize={pageSize}
                showSizeChanger
                showQuickJumper
                showTotal={(total) => `共 ${total}条`}
              />
            </div>
          </div>
        </div>
      </div>

      {open && <CreateForm open={open} onClose={() => setOpen(false)} />}
    </div>
  );
};

export default UserManager;
