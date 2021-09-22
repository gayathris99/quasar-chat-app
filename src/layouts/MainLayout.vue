<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
        <q-header elevated>
        <q-toolbar>
          <q-btn v-if="$route.fullPath.includes('/chat')" flat dense to ='/' icon="arrow_back" label="Back" />
          <q-toolbar-title class="absolute-center">{{ title }}</q-toolbar-title>
          <q-btn v-if="!userDetails.userId" flat dense to ='/auth' icon="account_circle" class="absolute-right q-pr-sm" label="Login" />
          <q-btn v-else @click="logoutUser" flat dense no-caps icon="account_circle" class="absolute-right q-pr-sm">Logout <br> {{userDetails.name}}</q-btn>
        </q-toolbar>
      </q-header>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import {mapState,mapActions} from 'vuex'

export default {
  computed: {
    ...mapState('user',['userDetails']),
    title() {
      if (this.$route.fullPath == '/auth')
        return "Login"
      else if (this.$route.fullPath.includes('/chat'))
        return this.otherUserDetails.name
      else
        return "Chat App"
    },
    otherUserDetails() {
       return this.$store.state.user.users[this.$route.params.otherUserId]
    }
    
  },
  methods: {
    ...mapActions('user',['logoutUser'])
  }
}
</script>
