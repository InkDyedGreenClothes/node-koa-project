<!--
 * @Author: 
 * @Date: 2020-03-19 11:15:54
 * @LastEditTime: 2020-04-14 10:51:35
 * @Descripttion: describe
 -->
<template>
  <div class="login">
    <div class="form">
      <h1>{{ title }}</h1>
      <van-form @submit="login">
        <van-field v-model="userName" name="userName" label="用户名" placeholder="用户名" />
        <van-field v-model="password" name="password" type="password" label="密码" placeholder="密码" />
        <div style="margin: 16px;">
          <van-button round block type="info" :disabled="!showBtn" native-type="submit">登陆</van-button>
        </div>
      </van-form>
      <div class="registered">
        还没有账号？
        <span @click="registered">注册</span> 一个吧
      </div>
    </div>
  </div>
</template>

<script>
import { login } from 'api/api';
import util from 'utils/util';
export default {
  data() {
    return {
      name: 'login',
      title: '欢迎登陆',
      showBtn: true, // 是否显示登陆
      isSignup: false, // 显示注册 or 登陆
      userName: 'admin', // 账号
      password: '123456' // 密码
    };
  },
  mounted() {
    util.delCookie('myUser');
  },
  computed: {
    loginData() {
      const { userName, password } = this;
      return {
        userName,
        password
      };
    }
  },
  watch: {
    loginData(val) {
      if (val.userName && val.password.length >= 6) {
        this.showBtn = true;
      } else {
        this.showBtn = false;
      }
    }
  },
  methods: {
    // 校验字段
    verify() {},
    login(values) {
      let data = {
        userName: this.userName,
        password: this.password
      };
      login(data).then(res => {
        util.showLoad('正在登陆');
        if (res.code == 200) {
          util.hideLoad();
          if (res.status == 200) {
            util.showTip(res.message);
            util.setCookie('myUser', JSON.stringify(res.data))
            this.$router.push('/');
          } else {
            util.showTip(res.message);
          }
        }
      });
    },
    // 跳转注册
    registered() {
      this.$router.push('/registered');
    }
  }
};
</script>

<style lang="scss" scoped>
.login {
  height: 100%;
  width: 100%;
  background: url('../../assets/login/index-bg.png') no-repeat;
  background-size: cover;
  .form {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 60%;
    width: 100%;
    background: #fff;
    border-radius: 15px 15px 0 0;
    h1 {
      text-align: center;
    }
  }
  .registered {
    width: 100%;
    text-align: center;
    span {
      color: rgb(0, 188, 156);
    }
  }
}
</style>