<template>
  <div class="container">
    <div class="content" :style="contentSize">
      <div class="imageBox">
        <!--<img v-if="!item.picture_url" :src="defaultWare" alt="" :style="imageSize">-->
        <img :src="item.picture_url" alt="" :style="imageSize">
      </div>
      <div class="info">
        <p class="name" :title="item.course_name">{{item.course_name}}</p>
        <p>
          <span>主讲老师</span>
          <span :title="item.teacher_name">{{item.teacher_name}}</span>
        </p>
        <p>
          <span>课程类型</span>
          <span>{{item.course_type_name || '无'}}</span>
        </p>
        <p>
          <span>学科</span>
          <span>{{item.subject_name || '无'}}</span>
        </p>
        <p>
          <span>年级</span>
          <span>{{item.grade_name || '无'}}</span>
        </p>
        <p>
          <span>班型</span>
          <span>{{item.class_type_name || '无'}}</span>
        </p>
        <p>
          <span>总课程数</span>
          <span>{{item.amount}}</span>
        </p>
        <p>
          <span>剩余课程数</span>
          <span>{{item.amount - item.used_amount - item.refund_amount}}</span>
        </p>
      </div>
      <div class="buttonGroup">
        <el-button type="primary" size="small" round class="cac-button-three" @click="goWisroomDetail(item)">查看详情</el-button>
        <el-button type="primary" size="small" :disabled="(item.amount - item.used_amount - item.refund_amount) === 0" round class="cac-button-one" @click="goCreateWare(item)">创建班级</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { imageFormat } from '@/utils'
export default {
  props: ['size', 'item', 'detailPath', 'page'],
  data () {
    return {
      defaultWare: '../../static/img/wisroom_default_courseware.jpg',
      imageFormat: ''
    }
  },
  filters: {
    imageFormat: imageFormat
  },
  computed: {
    contentSize () {
      let arr = this.size.contentSize.split('x')
      return {
        'width': arr[0] + 'px',
        'height': arr[1] + 'px'
      }
    },
    imageSize () {
      let arr = this.size.imageSize.split('x')
      return {
        'width': arr[0] + 'px',
        'height': arr[1] + 'px'
      }
    }
  },
  methods: {
    goWisroomDetail (item) {
      this.$router.push({name: this.detailPath, query: { id: item.id }})
    },
    goCreateWare (item) {
      this.$router.push({name: 'createWisroomClass', query: { type_id: 1, wareId: item.id, page: this.page }})
    }
  }
}
</script>
<style lang="less">
.container {
  text-align: left;
  margin-right: 20px;
  margin-bottom: 20px;
  display: inline-block;
  .content {
    .imageBox {
      display: inline-block;
      width: 164px;
      height: 164px;
      margin-right: 20px;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      display: inline-block;
      vertical-align: top;
      p {
        width: 300px;
        height: 21px;
        line-height: 21px;
        span {
          float: left;
          display: inline-block;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 13px;
          &:first-of-type {
            width: 65px;
            text-align: right;
            color: #7A808D;
            margin-right: 20px;
          }
        }
      }
      .name {
        font-size: 14px;
        font-weight: bold;
        margin-bottom: 10px;
        overflow: hidden;
        white-space: nowrap;
        -ms-text-overflow: ellipsis;
        text-overflow: ellipsis;
      }
    }
  }
  .buttonGroup {
    margin-top: 10px;
    font-size: 13px;
  }
}
</style>
