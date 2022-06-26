/*get/post data to api*/
/*processApi() - gets the similar ads*/
/*processApi(params) - posts an ad*/

const API_PUSH_URL = 'https://26.javascript.pages.academy/keksobooking';
const API_PULL_URL = 'https://26.javascript.pages.academy/keksobooking/data';
const API_DEFAULT_METHOD = 'GET';

const connectToApi = async (
  whatToDo = 'pull',
  body    = false,
  method  = false
) => {
  const fetchData = {};
  const PARAMETERS = {
    apiUrl: {
      push: API_PUSH_URL,
      pull: API_PULL_URL,
    },
    body: '',
    method: API_DEFAULT_METHOD,
  };
  if (body) {
    PARAMETERS.body = body;
  }
  if (method) {
    PARAMETERS.method = method;
  }
  fetchData.method = PARAMETERS.method;
  if (PARAMETERS.body) {
    fetchData.body = PARAMETERS.body;
  }
  try {
    const response = await fetch(PARAMETERS.apiUrl[whatToDo], fetchData);
    if (response.ok) {
      return await response.text();
    }
    return false;
  } catch(error) {
    return false;
  }
};

export {connectToApi};
