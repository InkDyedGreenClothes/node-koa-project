<template>
  <div class="home">
    <input type="text" name id v-model="message" />
    <button @click="socketSend">发送</button>
    <select name id>
      <option value>请选择用户</option>
      <option :value="item.id" v-for="item in userList" :key="item.id">{{ item.name }}</option>
    </select>
  </div>
</template>

<script>
// @ is an alias to /src
import io from 'socket.io-client';
import config from '@/config/config';
import util from 'utils/util';
export default {
  name: 'Home',
  data() {
    return {
      message: '',
      socket: null,
      userList: []
    };
  },
  created() {
    let data = JSON.parse(util.getCookie('myUser'));
    // console.log(data);
    this.socket = io(`${config.socketUrl}`);
    // console.log(this.socket);
    // this.socket.on('connect', () => {
    //   if (this.socket.connected) {
    //     console.log('连接成功');
    //   }
    // });
    this.socket.emit('login', data);
  },
  mounted() {
    this.receiveUser();
  },
  methods: {
    socketSend() {
      this.socket.emit('message', { message: this.message });
      this.socket.on('message', data => {
        // console.log(data);
      });
    },
    disconnected() {
      this.socket.on('connect', () => {
        if (!this.socket.connected) {
          console.log('断开连接');
        }
      });
    },
    receiveUser() {
      let _that = this;
      this.socket.on('login', data => {
        console.log(data);
        for (let key in data.onLineUsers) {
          _that.userList.push({
            id: key,
            name: data.onLineUsers[key]
          });
        }
      });
    }
  }
};
</script>
