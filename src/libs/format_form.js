function formatForm (formArr) {
  const formDataArr = [];
  // 分段解析
  for (let i = 0; i < formArr.length; i += 5) {
    formDataArr.push(formArr.slice(i, i + 5));
  }

  return formDataArr;
}

module.exports = {
  formatForm,
};
