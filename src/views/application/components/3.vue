<template>
    <div >
       
  
  <fengSu v-if="show==2"   @update-show="changeShow"/>
  <fengXiang v-if="show==1"  @update-show="changeShow"/>
  <meiGui v-if="show==3"   @update-show="changeShow"/>
  <fuHe v-if="show==4"   @update-show="changeShow"/>
    </div>
</template>

<script>
import  fengXiang from  '../components/charts/fengxiang.vue'
 import  fengSu from '../components/charts/fengsu.vue'
 import   meiGui   from  '../components/charts/meigui'
 import  fuHe  from '../components/charts/fuhe'
export default {
  data(){
    return {
      show:3
    }
  },

  methods:{
   changeShow(type){
     this.show=type
   }
  },
     components:{
      fengXiang,
      fengSu ,
      meiGui ,
       fuHe
         
   }
}
</script>

<style lang="scss" scoped>
  .climate {
       padding:  30px;
  }
</style>
