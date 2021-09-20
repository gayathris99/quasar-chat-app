import { removeToken, setToken } from 'src/utils/auth'
import { firebaseAuth } from 'src/boot/firebase'

export async function signIn({ dispatch, commit }, { email, password }) {
  firebaseAuth
    .signInWithEmailAndPassword(email, password)
    .then(async ({ user }) => {
      user.getIdToken().then(token => {
        removeToken()

        setToken(token)
      })
    })
    .catch(err => {
      const error = {
        errorCode: err.code,
        errorMessage: err.message
      }
      commit('setError', error)
    })
}
