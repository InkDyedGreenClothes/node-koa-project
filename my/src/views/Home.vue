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
    this.socket = io('http://172.16.10.13:8888');
    // console.log(this.socket);
    this.socket.on('connect', () => {
      if (this.socket.connected) {
        console.log('连接成功');
      }
    });
  },
  methods: {
    socketSend() {
      this.socket.emit('message', { message: this.message });
    },
    disconnected() {
      this.socket.on('connect', () => {
        if (!this.socket.connected) {
          console.log('断开连接');
        }
      });
    }
  }
};
</script>
