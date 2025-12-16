
const BASE_URL = 'https://api.rmtechsolution.com/';

const URLS = {
  addCms: BASE_URL + 'addCms',
  getCms: BASE_URL + 'getCms',
  updateCms: BASE_URL + 'updateCms',
  deleteCms: BASE_URL + 'deleteCms',
  deleteModel: BASE_URL + 'deleteModel',
  uploadCmsImage: BASE_URL + 'uploadCmsImage',
  createMerchant: BASE_URL + 'createMerchant',
  merchantLogin: BASE_URL + 'merchantLogin'
};

const apiClient = {
  Urls: URLS,

  jsonHeaders: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },

  make(url, method, params = {}) {
    const reqUrl =
      method === 'GET'
        ? `${url}?${new URLSearchParams(params).toString()}`
        : url;

    return fetch(reqUrl, {
      method,
      headers: this.jsonHeaders,
      ...(method === 'GET' ? {} : { body: JSON.stringify(params) }),
    }).then((res) => res.json());
  },

  post(url, params) {
    return this.make(url, 'POST', params);
  },

  get(url, params) {
    return this.make(url, 'GET', params);
  },

  // 🔥 NEW: FOR IMAGE UPLOAD
  postForm(url, formData) {
    return fetch(url, {
      method: 'POST',
      body: formData, // ❌ NO headers
    }).then((res) => res.json());
  },
};


export default apiClient;

