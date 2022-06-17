/*get/post data to api*/
const processApi = async (
  whatToDo = 'pull',
  body    = false,
  method  = false,
  headers = false
) => {

  const PARAMETERS = {
    apiUrl: {
      push: 'https://26.javascript.pages.academy/keksobooking/',
      pull: 'https://26.javascript.pages.academy/keksobooking/data',
    },
    body: '',
    method: 'GET',
    headers: '',
  };
  if (body) {
    PARAMETERS.body = body;
  }
  if (method) {
    PARAMETERS.method = method;
  }
  if (headers) {
    PARAMETERS.headers = headers;
  }

  const fetchData = {};
  fetchData.method = PARAMETERS.method;
  if (PARAMETERS.headers) {
    fetchData.headers = PARAMETERS.headers;
  }
  if (PARAMETERS.body) {
    fetchData.body = PARAMETERS.body;
  }

  const returnFail = () => false;

  try {
    const response = await fetch(PARAMETERS.apiUrl[whatToDo], fetchData);
    if (response.ok) {
      return await response.text();
    }
    returnFail();
  } catch(error) {
    return returnFail();
  }
};

export {processApi};

