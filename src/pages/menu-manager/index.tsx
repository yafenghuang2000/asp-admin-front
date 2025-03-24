import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Tree, Empty } from 'antd';
import type { TreeProps } from 'antd';
import { useMount } from 'ahooks';
import { getMenuList } from '@/service/userService';
import CreateMenu from './createMenu.tsx';
import { ISMenuDetail, convertToMenuItems } from './data.ts';
import './index.scss';

const { DirectoryTree } = Tree;

const MenuManager: React.FC = () => {
  const [treeData, setteeData] = useState<ISMenuDetail[]>([]);
  const [treeElementHeight, setTreeElementHeight] = useState(0);
  const treeRef = useRef<HTMLDivElement>(null);

  const [menuDetail, setMenuDetail] = useState<ISMenuDetail | null>(null);
  const [menuList, setMenuList] = useState<ISMenuDetail[]>([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const updateTreeHeight = () => {
    if (treeRef.current) {
      const height = treeRef.current.offsetHeight;
      setTreeElementHeight(height);
    }
  };

  useEffect(() => {
    // 初始化时计算一次高度
    updateTreeHeight();
    // 添加 resize 事件监听器
    window.addEventListener('resize', updateTreeHeight);
    // 清理函数：在组件卸载时移除事件监听器
    return () => {
      window.removeEventListener('resize', updateTreeHeight);
    };
  }, [treeData]);

  const getMenuAll = async (): Promise<void> => {
    try {
      const result = await getMenuList();
      const menuData = convertToMenuItems(result);
      setteeData(menuData);
      setSelectedKeys([menuData?.[0]?.id ?? '']);
      setMenuDetail({
        id: menuData?.[0]?.id,
        key: menuData?.[0]?.key,
        title: menuData?.[0]?.title, // 提供默认值
        path: menuData?.[0]?.path,
        code: menuData?.[0]?.code,
        type: menuData[0]?.type,
        icon: menuData?.[0]?.icon,
        sortOrder: menuData?.[0]?.sortOrder || 0,
        remark: menuData?.[0]?.remark,
      });
    } catch (e) {
      console.log(e);
    }
  };

  useMount(async () => {
    await getMenuAll();
  });

  const onSelect: TreeProps['onSelect'] = (_, info) => {
    const node = info.node as unknown as ISMenuDetail;

    setSelectedKeys([node.id ?? '']);
    setMenuDetail({
      id: node.id,
      key: node.key,
      title: node.title,
      path: node.path,
      code: node.code,
      type: node.type,
      icon: node.icon,
      sortOrder: node.sortOrder,
      remark: node.remark,
      children: node.children || [], // 添加children属性
    });
    setMenuList(node.children || []);
  };

  return (
    <div className='menuManager'>
      <div className='menuManager-header'>
        <div className='menuManager-header-title'>菜单管理</div>
      </div>
      <div className='menuManager-container'>
        <div className='menuManager-container-box'>
          <div className='menu'>
            <div className='menu-item'>
              <div className='menu-item-header'>
                <div className='menu-item-header-title'>系统管理</div>
                <SearchOutlined style={{ fontStyle: '14px' }} />
              </div>
              <div className='menu-item-create'>
                <Button
                  type='default'
                  icon={<PlusOutlined />}
                  style={{ width: '100%' }}
                  onClick={() => {
                    setOpen(true);
                    setTitle('createSys');
                  }}
                >
                  创建系统
                </Button>
              </div>
              <div className='menu-item-list' ref={treeRef}>
                <DirectoryTree
                  draggable
                  showLine
                  height={treeElementHeight}
                  selectedKeys={selectedKeys}
                  treeData={treeData}
                  onSelect={onSelect}
                />
              </div>
            </div>
            <div className='menu-container'>
              <div className='menu-container-header'>
                <div className='menu-container-header-title'>XMS售后系统</div>
                <div className='menu-container-header-buttons'>
                  <Button type='link' icon={<EditOutlined />} style={{ color: '#000' }}>
                    编辑
                  </Button>
                  <Button type='link' style={{ color: '#000' }} icon={<DeleteOutlined />}>
                    删除
                  </Button>
                </div>
              </div>
              <div className='menu-container-content'>
                <div className='menu-container-content-lable'>
                  <div className='title'>菜单名称</div>
                  <div className='content'>{menuDetail?.title ?? '--'}</div>
                </div>
                <div className='menu-container-content-lable'>
                  <div className='title'>菜单编码</div>
                  <div className='content'>{menuDetail?.code ?? '--'}</div>
                </div>
                <div className='menu-container-content-lable'>
                  <div className='title'>菜单类型</div>
                  <div className='content'>{menuDetail?.type ?? '--'}</div>
                </div>
                <div className='menu-container-content-lable'>
                  <div className='title'>菜单图标</div>
                  <div className='content'>{menuDetail?.icon ?? '--'}</div>
                </div>
                <div className='menu-container-content-lable'>
                  <div className='title'>菜单地址</div>
                  <div className='content'>{menuDetail?.path ?? '--'}</div>
                </div>
                <div className='menu-container-content-lable'>
                  <div className='title'>菜单排序</div>
                  <div className='content'>{menuDetail?.sortOrder ?? '--'}</div>
                </div>
                <div className='menu-container-content-lable'>
                  <div className='title'>备注信息</div>
                  <div className='content'>{menuDetail?.remark ?? '--'}</div>
                </div>
              </div>
              <div className='menu-container-submenus'>
                <div className='menu-container-submenus-create'>
                  <div className='title'>菜单信息</div>
                  {menuDetail?.type !== '菜单' && (
                    <Button
                      type='link'
                      icon={<PlusOutlined />}
                      style={{ color: '#000' }}
                      onClick={() => {
                        setOpen(true);
                        setTitle('createMenu');
                      }}
                    >
                      创建
                    </Button>
                  )}
                </div>
                <div className='menu-container-submenus-list'>
                  {menuList.length <= 0 ? (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Empty />
                    </div>
                  ) : (
                    menuList.map((item) => {
                      return (
                        <div className='menu-container-submenus-list-item' key={item.key}>
                          {item.title}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {open && (
        <CreateMenu
          open={open}
          setOpen={setOpen}
          title={title}
          menuDetail={menuDetail}
          getMenuAll={getMenuAll}
        />
      )}
    </div>
  );
};

export default MenuManager;
