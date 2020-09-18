<template>
  <div class="nav-bar">
    <van-nav-bar
      :title="navBarObj.title"
      :left-text="navBarObj.leftText"
      :left-arrow="navBarObj.isLeftArrow"
      @click-left="leftClick"
      @click-right="rightClick"
    />
  </div>
</template>

<script>
export default {
  data() {
    return {};
  },
  methods: {
    leftClick() {
      this.$router.go(-1);
    },
    rightClick() {
      console.log('right');
    }
  },
  props: {
    navBarObj: {
      type: Object,
      default: () => {
        return {
          isLeftArrow: true,
          leftText: '返回',
          title: '标题'
        };
      }
    }
  }
};
</script>

<style lang="scss" scoped>
</style>