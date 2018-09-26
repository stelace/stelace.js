import axios from 'axios';

export function run() {
  return axios.get('https://example.com').then(function (res) {
    return res.data;
  });
}