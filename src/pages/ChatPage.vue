<template>
  <q-page class="flex column" id = "chatpage"> 
    <q-scroll-area
              ref="chatScroll"
              style="height: 555px"
              :delay="350"
              
            >
    <q-banner v-if="!otherUserDetails.online" class="text-center bg-grey-4">
     {{otherUserDetails.name}} is offline
    </q-banner>
    <div class="q-pa-md column col justify-end " >
      <q-chat-message v-for="message in messages"
        :key="message.id"
        
        :text="[message.text]"
        :stamp = message.timestamp
        :sent ="message.from == 'me' ? true: false"
      />
    </div>
    </q-scroll-area>
      <q-footer elevated>
        <q-toolbar>
          <q-form @submit="sendMessage" class="full-width">
            <q-input bg-color="white" outlined rounded v-model="newMessage" label="Message" dense>
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

import {mapActions, mapState,mapMutations} from 'vuex'
export default {
  data() {
    return{
      newMessage: "",
      objDiv: {}
    }
  },
  methods: {
    ...mapActions('user', ['firebaseGetMessages','firebaseStopMessages','firebaseSendMessage','onChatPage']),
      scroll () {
        const scrollArea = this.$refs.chatScroll
        const scrollTarget = scrollArea.getScrollTarget()
        const duration = 0
        scrollArea.setScrollPosition(scrollTarget.scrollHeight, duration)
},
    sendMessage() {
        this.firebaseSendMessage({
        message: {
          text: this.newMessage,
          from: "me",
          timestamp: Date.now(),
          seen: false,
        },
        otherUserId: this.$route.params.otherUserId
      })
      this.newMessage = ''
      this.scroll()
    },


  },
  mounted() {
    this.firebaseStopMessages()
    this.firebaseGetMessages(this.$route.params.otherUserId)
   
 
  },

  updated() {
    this.scroll()
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


