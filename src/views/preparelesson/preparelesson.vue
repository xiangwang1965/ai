<template>
  <div class="prepareLessonContainer">
    <div class="content" :style="contentSize">
      <div class="imgWrap">
        <span class="imgWrapInner">
          <img :src="defaultWare" alt="" :style="imageSize">
          <div class="imageText">
            <p class="title">主辅备课</p>
            <p class="subject" :title="item.subject_name">{{item.subject_name}}</p>
            <p class="type">双师</p>
            <p class="grade" :title="item.grade_name">{{item.grade_name}}</p>
          </div>
          <span class="mediaInfo__info__title__right" :class="{'mediaInfo__info__title__right__orange':item.status_id===1,'mediaInfo__info__title__right__green':item.status_id===2,'mediaInfo__info__title__right__gray':item.status_id===3||item.status_id===4}">
            {{item.status}}</span>
        </span>
      </div>
      <div class="info">
        <p class="name">{{item.class_name}}</p>
        <p>
          <span>主讲老师：</span>
          <span :title="item.teacher_name">{{item.teacher_name}}</span>
        </p>
        <p>
          <span>总讲次数：</span>
          <span>{{item.lesson_count}}</span>
        </p>
        <!-- <p>
          <span>课程总数：</span>
          <span>{{item.course_counts}}</span>
        </p> -->
        <p>
          <span>上课日期：</span>
          <span :title="item.class_time">{{item.class_time}}</span>
        </p>
        <!-- <p>
          <span>剩余课程数：</span>
          <span>{{item.leave_lesson_counts}}</span>
        </p> -->

      </div>
      <div class="buttonGroup">
        <el-button type="primary" size="mini" round class="cac-button-two" @click="goPrepareDetail(item)">查看详情</el-button>
        <el-button type="primary" size="mini" round class="cac-button-one" :disabled="item.status_id===4 || item.status_id===3 || item.available_amount===0" @click="goPrepareLesson(item)">{{item.class_status ? '重新排课' : '排课'}}</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import { imageFormat } from '@/utils'
import preparelessonApi from '@/services/preparelesson'
export default {
  props: ['size', 'item', 'detailPath'],
  data () {
    return {
      defaultWare: '../../static/img/prepare_default.jpg',
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
    goPrepareDetail (item) {
      this.$router.push({name: 'prepareLessonDetail', query: { id: item.live_class_id }})
    },
    goPrepareLesson (item) {
      let params = {
        live_class_id: item.live_class_id,
        is_need_ass_teachers: 1
      }
      preparelessonApi.getPreparelessonDetail(params).then(res => {
        this.classLoading = false
        if (res.ok) {
          sessionStorage.setItem('prepareDetail', JSON.stringify(res.data))
          this.$router.push({ name: 'scheduleLesson', query: { 'create': 'create', 'code': item.code, 'detail_code': item.detail_code, 'id': item.live_class_id } })
        }
      })
    }
  }
}
</script>
<style lang="less">
.prepareLessonContainer {
  text-align: left;
  margin-right: 20px;
  margin-bottom: 20px;
  display: inline-block;
  .content {
    .imgWrap {
      display: inline-block;
      vertical-align: top;
      .imgWrapInner {
        position: relative;
        display: inline-block;
        .imageText {
          position: absolute;
          height: 115px;
          top: 28px;
          left: 9px;
          font-weight: 700;
          color: #FFF;
          .title {
            font-size: 16px;
            margin-bottom: 6px;
          }
          .subject {
            margin-bottom: 3px;
            width: 80px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .type {
            color: #FAE600;
          }
          .grade {
            position: absolute;
            bottom: 0;
            width: 35px;
            color: #7d92d6;
            text-align: center;
            font-size: 10px;
            transform: scale(0.8);
            margin-left: -6px;
            white-space: nowrap;
            overflow: hidden;
          }
        }
      }
      .mediaInfo__info__title__right {
        position: absolute;
        left: 0;
        top: 0;
        display: inline-block;
        width: 54px;
        height: 22px;
        line-height: 22px;
        text-align: center;
        background-color: #7a808d;
        color: #fff;
        border-radius: 0px 0px 12px 0px;
      }
      .mediaInfo__info__title__right__orange {
        background: rgba(255,118,65,.8);
      }
      .mediaInfo__info__title__right__green {
        background: rgba(64,217,128,.8);
      }
      .mediaInfo__info__title__right__gray {
        background:rgba(122,128,141,.8);
      }
      .mediaInfo__info__detail > li > p {
        display: inline-block;
        margin-top: 10px;
        font-size: 12px;
        font-weight: 500px;
        color: #888d9d;
      }
    }
    .info {
      display: inline-block;
      vertical-align: top;
      padding-left: 30px;
      p {
        min-height: 20px;
        line-height: 20px;
        span {
          display: inline-block;
          max-width: 200px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      .name {
        max-width: 300px;
        font-size: 16px;
        line-height: 16px;
        font-weight: 700;
        margin-bottom: 10px;
      }
    }
  }
  .buttonGroup {
    margin-top: 10px;
  }
}
</style>
