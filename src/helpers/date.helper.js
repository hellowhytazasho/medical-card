const convertToTimestamp = (obj, fields = []) => {
  const res = {};

  fields.forEach((field) => {
    res[field] = obj[field] ? obj[field].getTime() : 0;
  });

  return res;
};

module.exports = {
  convertToTimestamp,
};
