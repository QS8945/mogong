<template>
  <div class="view-total">
    <iframe class="iframe-config" id="linkIframe" :src="iframeAddress"></iframe>
  </div>
</template>

<script>
import GLB_CONFIG from '@/assets/js/glb-constant'

export default {
  name: 'enterpriseList',
  data () {
    return {
      iframeAddress: ''
    }
  },
  created () {
    this.initIframe()
  },
  methods: {
    initIframe () {
      if (this.$route.path.indexOf('/http') === 0) {
        this.iframeAddress = this.$route.path.substr(1)
      } else {
        this.iframeAddress = GLB_CONFIG.devUrl.childIframeAddress + this.$route.path + '?ticket=' + localStorage.getItem('token') + (this.$route.query && this.$route.query.mactres ? '&mactres=' + this.$route.query.mactres : '')// 't1bklz50d'
      }
    }
  }
}
</script>

<style lang="scss">
  .iframe-config{
    border: none;
    height: 100%;
    width: 100%;
  }
</style>
