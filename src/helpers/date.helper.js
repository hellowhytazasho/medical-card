const convertToTimestamp = (obj, fields = []) => {
  const res = {};

  fields.forEach((field) => {
    res[field] = obj[field] ? obj[field].getTime() : null;
  });

  return res;
};

module.exports = {
  convertToTimestamp,
};
