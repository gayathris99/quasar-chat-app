import Vue from 'vue'

export function setUserDetails(state,payload) {
    state.userDetails = payload
}


export function addUser(state,payload) {
    Vue.set(state.users, payload.userId, payload.userDetails)
}


export function updateUser(state,payload) {
    Object.assign(state.users[payload.userId],payload.userDetails)
}


export function addMessage (state,payload) {
    for (const property in payload) {
    let timeN = new Date(payload[property].timestamp)
    let difference = (Date.now() - payload[property].timestamp)/60
    let options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      };
    let timeString = timeN.toLocaleString('en-US', options);
    if (difference > 1000) {
        payload[property].timestamp = timeString
    }
    else {
        payload[property].timestamp = "now"
    }
}
    state.messages = payload

}
export function stopMessages(state,payload) {
    state.messages = {}
}

