
<template>
<div id="loginIn" class="imgtest">
    <router-link to="/chart">
      chart
    </router-link>
  <h2>111111111111</h2>
  <!-- <p >
        {{response}}
      </p> -->
  <!-- <Table border :columns="columns7" :data="contentlist"></Table> -->
<!-- <ul>
    <li v-for="(item, index) in contentlist" @click="show(index)">
      <div>
        <div class="author clearfix">
          <span style="height:35px">
            <img :src="item.profile_image"></img>
          </span>

          <span style="height:35px">
            <h2>{{ item.text }} - {{index}}</h2>
          </span>
        </div>

        <p>{{ item.text }} - {{index}}</p>
      </div>
    </li>
  </ul> -->
</div>
</template>
<script>
import axios from 'axios';
// import util from '../libs/util';
import qs from 'qs';

var a = [];
for (let i = 0; i < 10; i++) {
  a[i] = function() {
    console.log('----------------------');
    console.log('i=' + i);
    console.log('----------------------');
  };
}
a[6]();

class Animal {
  constructor() {
    this.type = 'animal'
  }
  says(say) {
    console.log(this.type + ' says ' + say)
  }
}

let animal = new Animal()
animal.says('hello') //animal says hello
class Cat extends Animal {
  constructor() {
    super()
    this.type = 'cat'
  }
}

let cat = new Cat()
cat.says('hello') //cat says hello

export default {
  data() {
    return {
      response: '1111',
      contentlist: [],
      allPages: ''
    }
  },
  methods: {
    show(index) {
      console.log(index);
    }
  },
  created() {
    // this.$http({
    //     url: util.commonUrl,
    //     method: 'GET',
    //     params:{
    //       showapi_appid: util.showapi_appid,
    //       showapi_sign: util.showapi_sign,
    //       type: util.img_type
    //     }
    //   }).then(response => {
    //     this.response = response;
    //     this.allPages = response.body.showapi_res_body.pagebean.allPages;
    //     this.contentlist = response.body.showapi_res_body.pagebean.contentlist;
    //     console.log("11111111111111111111111:");
    //     console.log(response);
    //     console.log("11111111111111111111111:");
    //   }).catch(function(response) {
    //     console.log(response);
    //   }),
      axios.get('http://route.showapi.com/255-1',{
        params:{
          showapi_appid: '17899',
          showapi_sign: '79A437A15BE0060D902754D6176B5C3B',
          type: '10'
        }
      }).then(response1 => {
        this.response = response1;
        this.allPages = response1.data.showapi_res_body.pagebean.allPages;
        this.contentlist = response1.data.showapi_res_body.pagebean.contentlist;
        console.log("22222222222222222222222222:");
        console.log(response1);
        console.log("22222222222222222222222222:");
      }).catch(function(err) {
        console.log(err);
      });
      // axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      // axios.get('https://api.douban.com/v2/movie/top250?start=7').then(response1 => {
      //   console.log("555555555555555555333333333:");
      //   console.log(response1);
      //   console.log("5555555555555555553333333333:");
      // }).catch(function(err) {
      //   console.log(err);
      // });

      // axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      // axios.get('apitest/movie/top250?start=7').then(response1 => {
      //   console.log("555555555555555555333333333:");
      //   console.log(response1);
      //   console.log("5555555555555555553333333333:");
      // }).catch(function(err) {
      //   console.log(err);
      // });
      //
      // this.$fetch(util.commonUrl,{
      //     showapi_appid: util.showapi_appid,
      //     showapi_sign: util.showapi_sign,
      //     type: util.img_type
      //   }
      // ).then((res) => {
      //   console.log("666666666666666666666666:");
      //   console.log(res);
      //   console.log("666666666666666666666666:");
      // })
    // function getUserAccount() {
    //   return axios.get('https://api.douban.com/v2/movie/top250?start=7');
    // }
    //
    // function getUserPermissions() {
    //   return axios.get('https://api.douban.com/v2/movie/top250?start=7');
    // }
    //
    // axios.all([getUserAccount(),getUserPermissions()]) .then(axios.spread(function(acct,perms){ //当这两个请求都完成的时候会触发这个函数，两个参数分别代表返回的结果
    //   console.log("33333333333333333333333:");
    //   console.log(acct);
    //   console.log(perms);
    // }))

  }
}
</script>
<style type="text/css">
.author {
  margin: 0 0 17px;
  clear: both;
}

.clearfix {
  /*display: block;*/
}

.author a,
.author span {
  float: left;
  font-size: 14px;
  font-weight: 700;
  line-height: 35px;
}

.author img {
  width: 35px;
  height: 35px;
  border-radius: 55px;
  padding: 0;
  margin-right: 10px;
}
</style> -->
