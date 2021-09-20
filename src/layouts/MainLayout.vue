<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
        <q-header elevated>
        <q-toolbar>
          <q-btn v-if="$route.fullPath.includes('/chat')" flat dense to ='/' icon="arrow_back" label="Back" />
          <q-toolbar-title class="absolute-center">{{ title }}</q-toolbar-title>
        </q-toolbar>
      </q-header>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  computed: {
    title() {
      if (this.$route.fullPath == '/auth')
        return "Login"
      else if (this.$route.fullPath  == '/chat')
        return "Chat Page"
      else
        return "Chat App"
    }
    
  }
}
</script>
