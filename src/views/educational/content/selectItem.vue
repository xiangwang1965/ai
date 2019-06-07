<template>
  <div class="select-item-wrap">
    <h5 class="select-item-title">{{label}}</h5>
    <ul class="select-item-list">
      <li v-for="(item, index) in itemList" :key="item.key" :class="index === activeIndex ? 'select-item-list-active' : ''" @click="handleClick(item, index)">{{item.value}}</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'SelectItem',
  props: {
    label: {
      required: true,
      type: String
    },
    param: {
      require: true,
      type: String
    },
    itemList: {
      required: true,
      type: Array
    }
  },
  data () {
    return {
      activeIndex: 0,
      params: {}
    }
  },
  methods: {
    handleClick (item, index) {
      this.activeIndex = index
      switch (this.param) {
        case 'subject_id':
          this.params.subject_id = item.key
          break
        case 'grade_id':
          this.params.grade_id = item.key
          break
        case 'use_status':
          this.params.use_status = item.key
          break
      }
      this.$emit('selectChange', this.params)
    }
  }
}
</script>

<style lang="less" scoped>
.select-item-wrap {
  width: 100%;
  font-size: 13px;
  font-family:PingFangSC-Regular;
  color: #3E434C;
  display: flex;
  margin-bottom: 16px;
  .select-item-title {
    margin-right: 48px;
    height: 26px;
    line-height: 26px;
    color: #7A808D;
  }
  .select-item-list {
    > li {
      float: left;
      margin-right: 35px;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      padding: 0 12px;
      border-radius: 13px;
      &:hover {
        color: rgb(47, 160, 255);
        background: #fff;
      }
    }
  }
  .select-item-list-active {
    background-color: rgba(60,117,246,0.1);
    color: #3C75F6 !important;
  }
}
</style>
