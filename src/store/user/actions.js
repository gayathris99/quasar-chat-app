import { removeToken, setToken } from 'src/utils/auth'
import { firebaseAuth, firebaseDb } from 'src/boot/firebase'



export function registerUser({},payload) {
  firebaseAuth.createUserWithEmailAndPassword(payload.email, payload.password)
  .then(response => {
    const userID = firebaseAuth.currentUser.uid
    firebaseDb.collection("users").doc(userID).set({
      name: payload.name,
      email:payload.email,
      online: true
    })

  })
  .catch(error => {})
}

export function loginUser({},payload) {
    firebaseAuth.signInWithEmailAndPassword(payload.email, payload.password)
    .then(response => {
      this.$router.push('/chat')
    })
    .catch(error => {})
}

export function logoutUser() {
  firebaseAuth.signOut()
}

export function handleAuthStateChanged({commit , dispatch,state}) {
  firebaseAuth.onAuthStateChanged(user => {
      if (user) {
      const userID = firebaseAuth.currentUser.uid
      firebaseDb.collection("users").doc(userID)
      .get()
      .then(doc => {
        const userDetails = doc.data()
        commit('setUserDetails', {
          name: userDetails.name,
          email:userDetails.email,
          userId: userID
        })
      })
      dispatch('firebaseUpdateUser', {
        userId: userID,
        updates: {
          online: true
        }
      })
      dispatch('firebaseGetUsers')
      this.$router.push('/')
    }
    else {
      dispatch('firebaseUpdateUser', {
        userId: state.userDetails.userId,
          updates: {
              online: false
          }
        })
        commit('setUserDetails',{})
        this.$router.replace('/auth')
    }
  })
}

export function firebaseUpdateUser({},payload) {
  firebaseDb.collection("users").doc(payload.userId).update(payload.updates)
}


export function firebaseGetUsers({commit}) {
  firebaseDb.collection("users").onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if(change.type == "added") {
          let userDetails = change.doc.data()
          let userId = change.doc.id;
          commit('addUser', {userId,userDetails})
      }
    })
  })
  firebaseDb.collection("users").onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change => {
      if(change.type == "modified") {
          let userDetails = change.doc.data()
          let userId = change.doc.id;
          commit('updateUser', {userId,userDetails})
      }
    })
  })
}

export function firebaseGetMessages({state,commit},otherUserId) {
  let userId = state.userDetails.userId
  firebaseDb.collection("chats/").doc(userId).collection(otherUserId)
  .orderBy("timestamp")
  .onSnapshot(snapshot => {
    snapshot.docChanges().forEach(change=> {
      if (change.type == 'added') {
        let messageDetails = change.doc.data()
        let messageId = change.doc.id
        commit('addMessage', {
        messageDetails,
        messageId
      })
      }
    })
  })
}

export function firebaseSendMessage({state}, payload) {
  firebaseDb.collection("chats").doc(state.userDetails.userId).collection(payload.otherUserId)
  .add(payload.message)
  payload.message.from = 'them'
  firebaseDb.collection("chats").doc(payload.otherUserId).collection(state.userDetails.userId)
  .add(payload.message)
}

export function firebaseStopMessages({commit}) {
  commit('stopMessages',{})
}