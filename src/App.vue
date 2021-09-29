<template>
  <div id="q-app">
    <router-view />
  </div>
</template>

<script>
import {mapActions} from 'vuex'

export default {
  methods: {
  ...mapActions('user', ['handleAuthStateChanged']),
  //  confirm_leaving (evt) {
         
  //               const unsaved_changes_warning = "You have unsaved changes. Are you sure you wish to leave?";
  //               evt.returnValue = unsaved_changes_warning; 
  //               return unsaved_changes_warning;
            
  //       }
  },
  mounted() {
    this.handleAuthStateChanged()
  },
  created() {
// window.addEventListener('beforeunload', this.confirm_leaving)
  },
  //  beforeDestroy() {
  //   this.firebaseUpdateUser({
  //         userId: firebaseAuth.currentUser.uid,
  //         updates: {
  //           online:false
  //         }
  //       })
  // },

  destroyed() {
    this.firebaseUpdateUser({
          userId: firebaseAuth.currentUser.uid,
          updates: {
            online:false
          }
        })
  }
}
</script>
