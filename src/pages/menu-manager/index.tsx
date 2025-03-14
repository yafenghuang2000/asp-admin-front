import React, { useEffect, useRef, useState } from 'react';
import { SearchOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Tree } from 'antd';
import { getMenuList } from '@/service/userService';
import { convertToMenuItems, IMenuItem } from '@/utils/treeFunction.ts';
import './index.scss';
const { DirectoryTree } = Tree;
const MenuManager: React.FC = () => {
  const [treeData, setteeData] = useState<IMenuItem[]>([]);
  const [treeElementHeight, setTreeElementHeight] = useState(0);
  const treeRef = useRef<HTMLDivElement>(null);

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

  const getMenuAll = async () => {
    try {
      const result = await getMenuList();
      setteeData(convertToMenuItems(result || []));
    } catch (e) {
      console.log(e);
    }
  };

  console.log(treeData, 'treeData');

  useEffect(() => {
    void getMenuAll();
  }, []);
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
                <Button type='primary' icon={<PlusOutlined />} style={{ width: '100%' }}>
                  创建系统
                </Button>
              </div>
              <div className='menu-item-list' ref={treeRef}>
                <DirectoryTree multiple draggable height={treeElementHeight} treeData={treeData} />
              </div>
            </div>
            <div className='menu-container'></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuManager;
