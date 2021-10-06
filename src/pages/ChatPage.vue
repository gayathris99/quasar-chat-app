<template>
  <q-page class="flex column" id="chatpage">
    <q-scroll-area ref="chatScroll" style="height: 650px" :delay="350">
      <q-banner v-if="!otherUserDetails.online" class="text-center bg-grey-4">
        {{ otherUserDetails.name }} is offline
      </q-banner>
      <div
        class="q-pa-md column col justify-end "
        v-for="message in messages"
        :key="message.id"
      >
        <q-chat-message
          v-if="message.text && message.url"
          :text="[message.text]"
          :stamp="message.timestamp"
          :sent="message.from == 'me' ? true : false"
        >
          <img
            v-if="message.url"
            :src="message.url"
            height="125px"
            width="300px"
          />
        </q-chat-message>

        <q-chat-message
          v-else-if="message.text"
          :text="[message.text]"
          :stamp="message.timestamp"
          :sent="message.from == 'me' ? true : false"
        >
        </q-chat-message>

        <q-chat-message
          v-else-if="message.url"
          :stamp="message.timestamp"
          :sent="message.from == 'me' ? true : false"
        >
          <img
            v-if="message.url"
            :src="message.url"
            height="125px"
            width="300px"
          />
        </q-chat-message>
      </div>
    </q-scroll-area>
    <q-footer elevated>
      <q-toolbar>
        <q-form @submit="sendMessage" class="full-width">
          <q-input
            bg-color="white"
            outlined
            v-model="newMessage"
            label="Message"
            dense
            autogrow
            :rows="1"
            input-style="max-height: 6em"
          >
            <q-file
              color="teal"
              ref="myFileInput"
              v-if="filePicker"
              class="q-pa-sm"
              filled
              v-model="photo"
              label="Add a file"
            >
            </q-file>
            <template v-slot:after>
              <q-btn
                type="submit"
                color="white"
                round
                dense
                flat
                icon="send"
                @click="sendMessage"
              />
              <q-btn
                round
                color="primquasaary"
                icon="add"
                @click="getFile"
              ></q-btn>
            </template>
          </q-input>
        </q-form>
      </q-toolbar>
    </q-footer>
  </q-page>
</template>

<script>
import { ref } from 'vue'
import { mapActions, mapState, mapMutations } from 'vuex'
import { firebaseAuth } from 'src/boot/firebase'
export default {
  data() {
    return {
      newMessage: '',
      objDiv: {},
      filePicker: false,
      photo: null
    }
  },
  methods: {
    ...mapActions('user', [
      'firebaseGetMessages',
      'firebaseStopMessages',
      'firebaseSendMessage',
      'uploadPhoto',
      'deleteImageUrl'
    ]),
    scroll() {
      const scrollArea = this.$refs.chatScroll
      const scrollTarget = scrollArea.getScrollTarget()
      const duration = 0
      scrollArea.setScrollPosition(scrollTarget.scrollHeight, duration)
    },
    getFile() {
      this.filePicker = !this.filePicker
    },
    sendMessage() {
      if (this.photo) {
        const photo = this.photo
        const userId = firebaseAuth.currentUser.uid
        const otherUserId = this.$route.params.otherUserId
        this.uploadPhoto({
          photo,
          userId,
          otherUserId,
          message: {
            text: this.newMessage,
            from: 'me',
            timestamp: Date.now(),
            url: ''
          }
        })
      } else {
        this.firebaseSendMessage({
          message: {
            text: this.newMessage,
            from: 'me',
            timestamp: Date.now()
          },
          otherUserId: this.$route.params.otherUserId
        })
      }

      this.newMessage = ''
      this.photo = null
      this.deleteImageUrl()
      this.scroll()
      this.filePicker = false
    }
  },
  mounted() {
    this.firebaseStopMessages()
    this.firebaseGetMessages(this.$route.params.otherUserId)
  },

  updated() {
    this.scroll()
  },

  computed: {
    ...mapState('user', ['messages', 'userDetails', 'url']),

    otherUserDetails() {
      return this.$store.state.user.users[this.$route.params.otherUserId]
    }
  },

  destroyed() {
    this.firebaseStopMessages()
  }
}
</script>

<style scoped>
.input {
  max-height: min-content;
}
</style>
