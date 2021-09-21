<template>
  <q-page class="flex column">
    <q-banner v-if="!otherUserDetails.online" class="text-center bg-grey-4">
     {{otherUserDetails.name}} is offline
    </q-banner>
    <div class="q-pa-md column col justify-end">
      <q-chat-message v-for="message in messages"
        :key="message.id"
        :name="message.from == 'me' ? userDetails.name : otherUserDetails.name"
        :text="[message.text]"
        :sent ="message.from == 'me' ? true: false"
      />
    </div>
      <q-footer elevated>
        <q-toolbar>
          <q-form @submit="sendMessage" class="full-width">
            <q-input bg-color="white" outlined rounded v-model="newMessage" label="Message"  dense>
            <template v-slot:after>
              <q-btn type="submit" color="white" round dense flat icon="send" @click="sendMessage" />
            </template>
            </q-input>
          </q-form> 
        </q-toolbar>
      </q-footer>
  </q-page>
</template>

<script>
import {mapActions, mapState} from 'vuex'
export default {
  data() {
    return{
      newMessage: ""
    }
  },
  methods: {
    ...mapActions('user', ['firebaseGetMessages','firebaseStopMessages','firebaseSendMessage']),
    sendMessage() {
      this.firebaseSendMessage({
        message: {
          text: this.newMessage,
          from: "me",
          timestamp: Date.now()

        },
        otherUserId: this.$route.params.otherUserId
      })
      this.newMessage = ''
    }
  },
  mounted() {
    this.firebaseStopMessages()
    this.firebaseGetMessages(this.$route.params.otherUserId)
  },
  computed: {
    ...mapState('user',['messages','userDetails']),
    otherUserDetails() {
       return this.$store.state.user.users[this.$route.params.otherUserId]
    }
  },
  destroyed() {
    this.firebaseStopMessages()
  }
};
</script>

