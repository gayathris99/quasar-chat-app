<template>
  <q-page class="flex q-pa-md">
    <q-list class="full-width" id="users" style="display:none" separator>
      <q-item
        v-for="(user, key) in users"
        :key="key"
        :to="'/chat/' + key"
        clickable
        v-ripple
      >
        <q-item-section avatar>
          <q-avatar color="primary" text-color="white">
            {{ user.name.charAt(0) }}
          </q-avatar>
        </q-item-section>

        <q-item-section>
          <q-item-label>{{ user.name }}</q-item-label>
        </q-item-section>

        <q-item-section side>
          <q-badge :color="user.online ? 'light-green-5' : 'grey-4'">
            {{ user.online ? 'Online' : 'Offline' }}
          </q-badge>
        </q-item-section>
      </q-item>
    </q-list>
  </q-page>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
export default {
  computed: {
    ...mapGetters('user', ['users'])
  },
  beforeMount() {
    this.firebaseGetUsers()
  },
  mounted() {
    setTimeout(() => {
      document.getElementById('users').style.display = 'block'
    }, 2000)
  },
  methods: {
    ...mapActions('user', ['firebaseGetUsers'])
  }
}
</script>

<style></style>
