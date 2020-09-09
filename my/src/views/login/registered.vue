<template>
  <div class="registered">
    <van-form @submit="verifyPassword">
      <van-field v-model="userName" name="userName" label="账号" placeholder="请输入账号" />
      <van-field v-model="nikeName" name="nikeName" label="昵称" placeholder="请输入昵称" />
      <van-field v-model="password" name="password" type="password" label="密码" placeholder="请输入密码" />
      <van-field
        v-model="confirmPassword"
        name="confirmPassword"
        type="password"
        @blur="verifyPassword"
        label="确认密码"
        placeholder="请重新输入密码"
      />
      <div style="margin: 16px;">
        <van-button round block type="info" native-type="submit">注册</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import util from '../../utils/util';
import { registered } from '../../api/api';
export default {
  data() {
    return {
      userName: '',
      nikeName: '',
      password: '',
      confirmPassword: ''
    };
  },
  methods: {
    //校验两次密码是否相同
    verifyPassword(value) {
      if (this.password !== this.confirmPassword) {
        util.showTip('密码不相同');
        return;
      }
      this.verify();
    },
    verify() {
      if (
        !this.userName ||
        !this.nikeName ||
        !this.password ||
        !this.verifyPassword
      ) {
        util.showTip('请将信息填写完整');
        return;
      }
      this.registered();
    },
    registered() {
      let data = {
        userName: this.userName,
        password: this.password,
        nikeName: this.nikeName
        
      };
      registered(data).then(res => {
        if (res.status == 200) {
          util.showTip('注册成功');
          this.$router.push('/login');
        } else {
          util.showTip(res.message);
        }
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>