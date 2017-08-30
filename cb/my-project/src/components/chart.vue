<template>
  <div id="test" class="x-bar">
    aaaa
  </div>
</template>
<script>

import HighCharts from 'highcharts';

import options from '../option';

export default {
  // 验证类型
  // props: {
  //   id: {
  //     type: String
  //   },
  //   option: {
  //     type: Object
  //   }
  // },
  data(){
    let option = options.line
    return{
      id:'test',
      option:option
    }
  },
  mounted() {
    var info = this.option.series[0].data;
    this.option.series.forEach(function(value,index,array){
      array[index].data = info;
      console.log(value);
    })

    HighCharts.chart(this.id,this.option)
  }
}
</script>
