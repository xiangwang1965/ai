<!-- 基础信息 -->
<template>
  <div class="basicPage">
    <div class="cac-bread-bar toggle__bar">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/basic' }" class="cac-bread">校区管理</el-breadcrumb-item>
      </el-breadcrumb>
      <!-- <ul class="campusInfo__bar">
        <li class="campusInfo__list__item" @click="showCampus" :class="{'active__campusInfo__list__item':campus}">校区管理</li>
        <li class="campusInfo__list__item" @click="showClassType" :class="{'active__campusInfo__list__item':!campus}">班型管理</li>
        <div class="clearfix"></div>
        <div class="clearfix"></div>
      </ul> -->
    </div>

    <transition class="toggle__body">
      <Campus v-if="campus"></Campus>
      <ClassType v-if="!campus"></ClassType>
    </transition>
  </div>
</template>

<script type="text/ecmascript-6">
import Campus from './campus'
import ClassType from './classtype'
export default {
  data () {
    return {
      campus: true
    }
  },
  components: {
    Campus,
    ClassType
  },
  methods: {
    showCampus () {
      this.campus = true
    },
    showClassType () {
      this.campus = false
    }
  }
}
</script>

<style scoped>
.clearfix {
  clear: both;
}
.campusInfo__bar{
  float: left;
}
.toggle__bar li {
  float: left;
  font-size: 18px;
  line-height: 0;
  padding-top: 20px;
}
.toggle__bar li:nth-child(2) {
  margin-left: 15px;
}
.toggle__bar li:active,
.toggle__bar li:hover {
  color: #3a9cff;
  cursor: pointer;
}
.active__campusInfo__list__item {
  color: #3a9cff;
}

</style>
