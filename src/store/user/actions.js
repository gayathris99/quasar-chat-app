import { removeToken, setToken } from 'src/utils/auth'
import { firebaseAuth, firebaseDb, firebaseStorage } from 'src/boot/firebase'
import { Loading } from 'quasar'

export function registerUser({}, payload) {
  Loading.show()
  firebaseAuth
    .createUserWithEmailAndPassword(payload.email, payload.password)
    .then(response => {
      const userID = firebaseAuth.currentUser.uid
      firebaseDb
        .collection('users')
        .doc(userID)
        .set({
          name: payload.name,
          email: payload.email,
          online: true,
          msgTimestamp: payload.msgtimestamp
        })
      Loading.hide()
    })
    .catch(error => {})
}

export function loginUser({ state }, payload) {
  Loading.show()
  firebaseAuth
    .signInWithEmailAndPassword(payload.email, payload.password)
    .then(response => {
      Loading.hide()
      this.$router.push('/chat')
    })
    .catch(error => {
      Loading.hide()
      state.wrongCredentials = true
    })
}

export function logoutUser() {
  firebaseAuth.signOut()
}

export function handleAuthStateChanged({ commit, dispatch, state }) {
  firebaseAuth.onAuthStateChanged(user => {
    if (user) {
      const userID = firebaseAuth.currentUser.uid
      firebaseDb
        .collection('users')
        .doc(userID)
        .get()
        .then(doc => {
          const userDetails = doc.data()
          commit('setUserDetails', {
            name: userDetails.name,
            email: userDetails.email,
            userId: userID
          })
        })
      dispatch('firebaseUpdateUser', {
        userId: userID,
        updates: {
          online: true
        }
      })
      //dispatch('firebaseGetUsers')
      this.$router.push('/')
    } else {
      dispatch('firebaseUpdateUser', {
        userId: state.userDetails.userId,
        updates: {
          online: false
        }
      })
      commit('setUserDetails', {})
      this.$router.replace('/auth')
    }
  })
}

export function firebaseUpdateUser({}, payload) {
  firebaseDb
    .collection('users')
    .doc(payload.userId)
    .update(payload.updates)
}

export function firebaseGetUsers({ commit }) {
  let userDetails = {}
  firebaseDb.collection('users').onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if (change.type == 'added') {
        let userId = change.doc.id
        let currentUserId = firebaseAuth.currentUser.uid
        if (userId != currentUserId) {
          let userDetails = change.doc.data()
          firebaseDb
            .collection('chats')
            .doc(currentUserId)
            .collection(userId)
            .orderBy('timestamp', 'desc')
            .limit(1)
            .get()
            .then(snapshot => {
              snapshot.forEach(doc => {
                if (doc.exists) {
                  let lastMsgTimeStamp = doc.data().timestamp
                  userDetails.msgTimestamp = lastMsgTimeStamp
                  commit('addUser', { userId, userDetails })
                }
              })
            })
          commit('addUser', { userId, userDetails })
        }
      }
      if (change.type == 'modified') {
        let userDetails = change.doc.data()
        let userId = change.doc.id
        commit('updateUser', { userId, userDetails })
      }
    })
  })
  // Loading.hide()
  // commit('sortUsers')
}

export function firebaseGetMessages({ state, commit }, otherUserId) {
  let userId = state.userDetails.userId
  let messageDetails = {}
  firebaseDb
    .collection('chats/')
    .doc(userId)
    .collection(otherUserId)
    .orderBy('timestamp')
    .onSnapshot(snapshot => {
      snapshot.docChanges().forEach(change => {
        if (change.type == 'added' || change.type == 'modified') {
          let messageDetail = change.doc.data()
          let messageId = change.doc.id
          messageDetails[messageId] = messageDetail
        }
      })
      commit('addMessage', messageDetails)
    })
}

export function firebaseSendMessage({ state, dispatch, commit }, payload) {
  firebaseDb
    .collection('chats')
    .doc(state.userDetails.userId)
    .collection(payload.otherUserId)
    .add(payload.message)
  payload.message.from = 'them'
  firebaseDb
    .collection('chats')
    .doc(payload.otherUserId)
    .collection(state.userDetails.userId)
    .add(payload.message)
  dispatch('firebaseGetMessages', payload.otherUserId)
}

export function firebaseStopMessages({ commit }) {
  commit('stopMessages', {})
}

export function uploadPhoto({ dispatch, commit }, payload) {
  Loading.show()
  let ref = firebaseStorage
    .ref()
    .child(`${payload.userId}/${payload.otherUserId}/${payload.photo.name}`)
  ref.put(payload.photo).then(snapshot => {
    ref.getDownloadURL().then(url => {
      commit('updateImgUrl', url)
      payload.message.url = url
      let message = payload.message
      let otherUserId = payload.otherUserId
      dispatch('firebaseSendMessage', { message, otherUserId })
    })
    Loading.hide()
  })
}

export function deleteImageUrl({ commit }) {
  commit('deleteUrl')
}
