import { Config } from '@/Config';
import useStorage from '@/Hooks/Utils/use-storage';
import { AtomKeys } from '@/Jotai/AtomKeys';
import axios from 'axios';

console.log('Config.API_URL', Config.API_URL);
const instance = axios.create({
  baseURL: Config.API_URL,
});

const getUserToken = async () => {
  try {
    const tokenValue = await useStorage.getItem(AtomKeys.authToken);
    if (tokenValue) {
      return tokenValue;
    }
    return null;
  } catch (error) {
    console.error('Error retrieving user token from AsyncStorage', error);
    return null;
  }
};

export const api = {
  get: async function (query, header = {}, params = {}) {
    console.log('query in get api -- ', query);
    console.log('params in get api -- ', params);

    const token = await getUserToken();
    return new Promise(function (resolve, reject) {
      const headers: any = {
        'Content-Type': 'application/json',
        ...header,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      var opts = {
        method: 'GET',
        headers,
        params,
      } as any;

      instance
        .get(query, opts)
        .then(function (response) {
          resolve(response.data);
        })
        .catch(error => {
          let err = {
            resError: error.response ? error.response.data : error.message,
            message: 'Server not responding!',
          };
          reject(err);
        });
    });
  },
  post: async function (url_path, body, header = {}) {
    console.log('body in post api -- ', body);
    console.log('url_path in post api -- ', url_path);

    const token = await getUserToken(); // await getUserToken();

    return new Promise(function (resolve, reject) {
      const headers: any = {
        'Content-Type': 'application/json',
        ...header,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      var opts = {
        method: 'POST',
        headers,
      } as any;

      instance
        .post(url_path, body, opts)
        .then(function (data) {
          resolve(data.data);
        })
        .catch(error => {
          console.log('error in post api -- ', error);

          let err = {
            resError: error.response ? error.response.data : error.message,
            message: 'Server not responding!',
          };
          reject(err);
        });
    });
  },
  delete: async function (url_path, header = {}) {
    const token = await getUserToken();
    return new Promise(function (resolve, reject) {
      const headers: any = {
        'Content-Type': 'application/json',
        ...header,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      var opts = {
        method: 'DELETE',
        headers,
      } as any;

      instance
        .delete(url_path, opts)
        .then(function (data) {
          resolve(data.data);
        })
        .catch(error => {
          let err = {
            resError: error.response ? error.response.data : error.message,
            message: 'Server not responding!',
          };
          reject(err);
        });
    });
  },
  put: async function (url_path, body, header = {}) {
    const token = await getUserToken(); // await getUserToken();
    return new Promise(function (resolve, reject) {
      const headers: any = {
        'Content-Type': 'application/json',
        ...header,
      };

      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      var opts = {
        method: 'PUT',
        headers,
      } as any;

      instance
        .put(url_path, body, opts)
        .then(function (data) {
          resolve(data.data);
        })
        .catch(error => {
          let err = {
            resError: error.response ? error.response.data : error.message,
            message: 'Server not responding!',
          };
          reject(err);
        });
    });
  },
};
