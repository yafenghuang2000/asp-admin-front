export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
};

export interface ISOnSelectNodeProps {
  icon: string | null;
  remark: string | null;
  code: string | null;
  id: string;
  key: string;
  title: string;
  path: string;
  children?: Array<ISMenuDetail> | null;
}

export interface ISMenuDetail {
  key: string;
  title: string | null;
  path?: string;
  code: string | null;
  type: string | null;
  icon: string | null;
  sort: string | number | null;
  remark: string | null;
}
