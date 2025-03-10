import React, { useEffect, useRef, useState, useCallback } from 'react';
import './index.scss';

const List: React.FC = () => {
  const listData = [1];
  const [data, setData] = useState(listData);
  const containerRef = useRef<HTMLDivElement>(null);

  const checkAndAppendData = useCallback(() => {
    if (containerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } = containerRef.current;
      if (scrollTop + clientHeight >= scrollHeight || data.length === 1) {
        const newData = Array.from({ length: 2 }, (_, i) => data.length + i + 1);
        setData((prevData) => [...prevData, ...newData]);
        return true;
      }
    }
    return false;
  }, [data]);

  useEffect(() => {
    checkAndAppendData(); // 初次加载时手动触发
    const interval = setInterval(() => {
      const isBottomReached = checkAndAppendData();
      if (isBottomReached) {
        clearInterval(interval);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [checkAndAppendData]);

  const onScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight) {
      console.log('已经滚动到底部');
      const newData = Array.from({ length: 10 }, (_, i) => data.length + i + 1);
      setData((prevData) => [...prevData, ...newData]);
    }
  };
  return (
    <div className='list-container' onScroll={onScroll} ref={containerRef}>
      <div className='list-content'>
        {data.map((item) => {
          return (
            <div className='list-content-box' key={item}>
              <div className='list-content-box-item'>{item}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default List;
