import axios from 'axios'
import qs from 'qs'
import authRefreshInterceptor from 'axios-auth-refresh'
import { setToken, getToken } from '@utils/auth'
import { firebaseAuth } from 'src/boot/firebase'

const baseURL = `${process.env.API}/v1`
const contentType = {
  json: 'application/json',
  form: 'multipart/form-data'
}

const axiosInstance = axios.create({
  baseURL,
  headers: {
    Accept: contentType.json,
    'Content-Type': contentType.json
  },
  paramsSerializer: params => {
    return qs.stringify(params, { arrayFormat: 'brackets' })
  },
  transformResponse: [
    apiResponse => {
      if (apiResponse) {
        const { data } = JSON.parse(apiResponse)
        return data
      }
      return apiResponse
    }
  ]
})

axiosInstance.interceptors.request.use(config => {
  const token = getToken()
  if (token) config.headers.Authorization = token
  return config
})

const refreshToken = failedRequest => {
  return firebaseAuth.currentUser
    .getIdToken(true)
    .then(token => {
      setToken(token)
      failedRequest.response.config.headers['Authorization'] = token
      return Promise.resolve()
    })
    .catch(error => {
      if (error) throw error
      return Promise.reject()
    })
}

authRefreshInterceptor(axiosInstance, refreshToken)

export const formRequest = {
  post: (url, data) =>
    axiosInstance.post(url, data, { 'Content-Type': contentType.form }),
  put: (url, data) =>
    axiosInstance.put(url, data, { 'Content-Type': contentType.form })
}

const request = {
  get: (url, params) => axiosInstance.get(url, { params }),
  post: (url, body) => axiosInstance.post(url, body),
  put: (url, body) => axiosInstance.put(url, body),
  patch: (url, body) => axiosInstance.patch(url, body),
  del: url => axiosInstance.delete(url),
  delWithData: (url, data) => axiosInstance.delete(url, { data })
}

export default request
