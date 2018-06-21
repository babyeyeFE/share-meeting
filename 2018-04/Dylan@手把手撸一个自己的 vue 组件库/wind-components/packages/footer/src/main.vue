<template>
  <div class="footer">
    <div class="footer-centent">
      <div class="footer-centent-text">
        {{ content }}
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'wd-footer',
  data() {
    return {
    }
  },
  props: {
      content: {
        type: String,
        default: 'Copyright 2005-2018 京ICP备16017877号-1 视琦科技旗下产品 贝云医疗云平台提供计算支持'
      }
    },
  components: {
  },
  methods: {
  }
}
</script>
<style>
  .footer {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 63px;
    background-color: #202a39;
  }
  .footer-centent {
    width: 100%;
    margin: 0 auto;
    height: 63px;
    font-size: 15px;
    overflow: hidden;
  }
  .footer-centent-text {
    margin-top: 25px;
    color: white;
    text-align: center;
  }
</style>
