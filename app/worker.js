self.onmessage = function (event) {
  const { data } = event;
  const result = data * 2;
  postMessage(result);
};
