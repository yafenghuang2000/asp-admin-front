import { JSX, cloneElement } from 'react';
import { Flex } from 'antd';
import './index.scss';

interface ISxmsProps {
  title: string;
  actionButtons?: JSX.Element[];
}
const XmsHeader = (props: ISxmsProps): JSX.Element => {
  const { title, actionButtons } = props;

  return (
    <div className='xms-header'>
      <div className='xms-header-title'>{title}</div>
      <div className='xms-header-button'>
        <Flex gap='small' wrap>
          {actionButtons?.map((item) => {
            return cloneElement(item, { key: item.key });
          })}
        </Flex>
      </div>
    </div>
  );
};

export default XmsHeader;
