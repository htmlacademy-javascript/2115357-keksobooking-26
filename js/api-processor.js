/*get/post data to api*/
/*processApi() - gets the similar ads*/
/*processApi(params) - posts an ad*/
const processApi = async (
  whatToDo = 'pull',
  body    = false,
  method  = false
) => {
  const PARAMETERS = {
    apiUrl: {
      push: 'https://26.javascript.pages.academy/keksobooking',
      pull: 'https://26.javascript.pages.academy/keksobooking/data',
    },
    body: '',
    method: 'GET',
  };
  if (body) {
    PARAMETERS.body = body;
  }
  if (method) {
    PARAMETERS.method = method;
  }
  const fetchData = {};
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

export {processApi};
