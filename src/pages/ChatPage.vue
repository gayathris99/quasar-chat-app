<template>
  <q-page class="flex column">
    <q-banner class="text-center bg-grey-4">
     User offline
    </q-banner>
    <div class="q-pa-md column col justify-end">
      <q-chat-message v-for="message in messages"
        :key="message"
        :name="message.from"
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
export default {
  data() {
    return {
      newMessage: "",
      messages: [
        {
          text: "Hello",
          from: "me"
        },
        {
          text: "Hey Long time",
          from: "them"
        },
        {
          text: "Yes! How are you?",
          from: "me"
        },
      ]
    }
  },
  methods: {
    sendMessage() {
      this.messages.push({
        text: this.newMessage,
        from: "me"
      })
      this.newMessage = ''
    }
  }
};
</script>

