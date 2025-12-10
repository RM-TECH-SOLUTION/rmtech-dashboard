
const BASE_URL = 'https://api.rmtechsolution.com/';

const URLS = {
  addCms: BASE_URL + 'addCms',
  getCms: BASE_URL + 'getCms',
  updateCms: BASE_URL + 'updateCms',
};

const apiClient = {
  Urls: URLS,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },

  make(url, method, params = {}) {
    params.merchantAccessToken = params.merchantAccessToken || window.merchantAccessToken;
    const reqUrl = method === 'GET' ? `${url}?${new URLSearchParams(params).toString()}` : url;
    return fetch(reqUrl, {
      method,
      headers: apiClient.headers,
      ...(method === 'GET' ? {} : { body: JSON.stringify(params) }),
    }).then(response => response.json());
  },

  post(url, params) {
    return this.make(url, 'POST', params);
  },

  get(url, params) {
    return this.make(url, 'GET', params);
  },


  

}

export default apiClient;