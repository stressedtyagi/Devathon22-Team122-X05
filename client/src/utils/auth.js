import axios from "axios";

/**
 * @description : manages all actions realted to server requests and response
 */
const auth = {
  get: async (url, params) => {
    const token = params?.token;
    const data = params?.data;

    return await axios.get(url, {
      headers: {
        Authorization: token,
      },
      params: {
        ...data,
      },
    });
  },
  post: async (url, params) => {
    const token = params?.token;
    const data = params?.data;

    return await axios.post(
      url,
      { ...data },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  },
  patch: async (url, params) => {
    const token = params?.token;
    const data = params?.data;

    return await axios.patch(
      url,
      { ...data },
      {
        headers: {
          Authorization: token,
        },
      }
    );
  },
  delete: async (url, params) => {
    const token = params?.token;

    return await axios.delete(url, {
      headers: {
        Authorization: token,
      },
    });
  },
};

export default auth;
