<template>
  <div>
    <!-- <img :src="this.$route.params.url" alt="" class="img"> -->
    <q-img
      class="q-pt-xl q-mt-xl fixed-center"
      :src="this.$route.params.url"
      :ratio="1"
    />

    <!-- <q-zoom
        background-color="blue-grey-1"
      >
        <img
         class= "q-pt-xl q-mt-xl fixed-center my-image"
          :src="this.$route.params.url"
         
        >
      </q-zoom> -->
  </div>
</template>

<script>
export default {
  created() {
    console.log('works')
    console.log('this', this.imgUrl)
  }
}
</script>

<style scoped>
.img {
  max-width: 100%;
  height: auto;
}
</style>
