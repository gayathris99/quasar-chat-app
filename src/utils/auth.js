import { LocalStorage } from 'quasar'

export function setToken(token) {
  LocalStorage.set('access_token', token)
}

export function removeToken() {
  LocalStorage.remove('access_token')
}
export function getToken() {
  return LocalStorage.getItem('access_token')
}
