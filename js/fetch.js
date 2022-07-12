const API_PUSH_METHOD = 'POST';
const API_PULL_METHOD = 'GET';
const SERVER_PUSH_URL = 'https://26.javascript.pages.academy/keksobooking';
const SERVER_PULL_URL = 'https://26.javascript.pages.academy/keksobooking/data';

const parameters = {
  url: '',
  data: {
    method: '',
  }
};

const connectToServer = async () => {
  const response = await fetch(parameters.url, parameters.data);
  if (response.ok) {
    return await response.text();
  }
  return false;
};
const pullFromServer = async () => {
  parameters.url = SERVER_PULL_URL;
  parameters.data.method = API_PULL_METHOD;
  delete parameters.data.body;
  return connectToServer()
    .then((response) => response);
};
const pushToServer = async (adData) => {
  parameters.url = SERVER_PUSH_URL;
  parameters.data.method = API_PUSH_METHOD;
  parameters.data.body = adData;
  return connectToServer()
    .then((response) => response);
};

export { pullFromServer };
export { pushToServer };
