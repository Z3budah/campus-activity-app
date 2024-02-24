
const zero = (text) => {
  return text.length < 2 ? '0' + text : text;
};

const formateTime = function formateTime(time, type) {
  let arr = time.match(/\d+/g),
    [year, month, day, hours = '00', minutes = '00'] = arr;

  switch (type) {
    case "list":
      return `${zero(month)}-${zero(day)} ${zero(hours)}:${zero(minutes)}`;
    case "detail":
      return `${year} 年 ${zero(month)} 月 ${zero(day)} 日 ${zero(hours)}:${zero(minutes)}`;
    default:
      return 'time type error';
  };
};


export { formateTime };