/**
 * 下载文件
 * @param blob 文件流
 * @param fileName 文件名
 */
export const downloadFile = (blob: Blob, fileName: string): void => {
  // 创建一个临时的 URL
  const url = window.URL.createObjectURL(blob);

  // 创建一个临时的 a 标签
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;

  // 模拟点击下载
  document.body.appendChild(link);
  link.click();

  // 清理
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

//跨域下载文件
export const downloadFileByXHR = (href: string, filename = ''): void => {
  const xhr = new XMLHttpRequest();
  xhr.open('GET', href, true);
  xhr.responseType = 'blob';
  xhr.onload = () => {
    if (xhr.status === 200) {
      const url = window.URL.createObjectURL(xhr.response);
      const a = document.createElement('a');
      a.download = filename;
      a.target = '_blank';
      a.href = url;
      a.style.display = 'none';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
    }
  };
  xhr.send();
};

// 采用正则表达式获取地址栏参数
export const getUrlParams = (url: string): Record<string, string> => {
  const params = url.split('?')[1];
  if (!params) return {};

  const reg = /([^?&=]+)=([^?&=]*)/g;
  const obj: Record<string, string> = {};

  params.replace(reg, (match, p1, p2) => {
    obj[p1] = decodeURIComponent(p2);
    return match;
  });

  return obj;
};

/**
 * 获取指定月份的天数
 * @param year 年份
 * @param month 月份（1-12）
 * @returns 返回该月份的天数
 */
export const getDaysInMonth = (year: number, month: number): number => {
  // 处理月份参数，确保在 1-12 范围内
  let normalizedMonth = month;
  if (normalizedMonth < 1) normalizedMonth = 1;
  if (normalizedMonth > 12) normalizedMonth = 12;

  // 月份天数对照表
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // 处理闰年二月
  if (month === 2) {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28;
  }

  return daysInMonth[month - 1];
};

/**
 * 获取日期范围内的所有月份及其天数
 * @param startDate 开始日期
 * @param endDate 结束日期
 * @returns 返回月份和对应天数的数组
 */
export const getMonthDaysInRange = (
  startDate: Date,
  endDate: Date,
): Array<{
  year: number;
  month: number;
  days: number;
}> => {
  const result = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;

    result.push({
      year,
      month,
      days: getDaysInMonth(year, month),
    });

    // 移到下个月
    currentDate.setMonth(currentDate.getMonth() + 1);
  }

  return result;
};
