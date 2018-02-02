<template>
  <div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        imgUrl: ''
      }
    },
    components: {},
    created() {
      this.getDate()
    },
    mounted() {
      // 获取不到值
      console.log(this.imgUrl)
    },
    methods: {
      getData() {
        getImg()
          .then(res => {
            this.imgUrl = res
          })
      }
    }
  }
</script>
<style>
</style>
