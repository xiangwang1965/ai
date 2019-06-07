<!-- 双师详情介绍 -->
<template>
  <div class="prepareLessonInfo">
    <div class="imgWrap">
      <span class="imgWrapInner">
        <img :src="defaultWare" alt="" :style="imageSize">
        <div class="imageText">
          <p class="title">主辅备课</p>
          <p class="subject">{{mediaInfoData.subject_name}}</p>
          <p class="type">双师</p>
          <p class="grade">{{mediaInfoData.grade_name}}</p>
        </div>
        <span class="mediaInfoData__info__title__right" :class="{'mediaInfoData__info__title__right__green':mediaInfoData.status_id===1,'mediaInfoData__info__title__right__red':mediaInfoData.status_id===2,'mediaInfoData__info__title__right__gray':mediaInfoData.status_id===3 || mediaInfoData.status_id===4}">
          {{mediaInfoData.status}}</span>
      </span>
    </div>
    <div class="mediaInfoData__info">
      <div class="mediaInfoData__info__title">
        <h5 class="mediaInfoData__info__title__left">{{mediaInfoData.class_name}}</h5>
      </div>
      <ul class="mediaInfoData__info__detail">
        <li>
          <p>主讲老师：</p>
          <span>{{mediaInfoData.teacher_name}}</span>
        </li>
        <li>
          <p>上课日期：</p>
          <span>{{mediaInfoData.class_time}}</span>
        </li>
        <!-- <li>
          <p>剩余课程数：</p>
          <span>{{mediaInfoData.available_amount}}</span>
        </li>
        <li>
          <p>课程总数：</p>
          <span>{{mediaInfoData.total_amount}}</span>
        </li> -->
        <li>
          <p>总讲次数：</p>
          <span>{{mediaInfoData.lesson_count}}</span>
        </li>
        <li>
          <p>校区：</p>
          <span>{{mediaInfoData.campus_name || '无'}}</span>
        </li>
        <li>
          <p>教室：</p>
          <span>{{mediaInfoData.room_name || '无'}}</span>
        </li>
        <li>
          <p>辅导老师：</p>
          <span>{{mediaInfoData.teacher || '无'}}</span>
        </li>
        <li class="description">
          <p>课程介绍：</p>
          <span>{{mediaInfoData.brief || '无'}}</span>
        </li>
        <div class="clearfix"></div>
      </ul>
    </div>
    <div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      defaultWare: '../../static/img/prepare_default.jpg',
      mediaInfoData: {}
    }
  },
  props: {
    mediaInfo: Object,
    size: Object
  },
  watch: {
    mediaInfo () {
      this.mediaInfoData = this.mediaInfo
      this.mediaInfoData.cover_image = this.mediaInfoData.cover_image
    }
  },
  created () {
    this.mediaInfoData = this.mediaInfo
  },
  computed: {
    imageSize () {
      let arr = this.size.imageSize.split('x')
      return {
        'width': arr[0] + 'px',
        'height': arr[1] + 'px'
      }
    }
  }
}
</script>
<style lang="less">
.prepareLessonInfo {
  background-color: #fff;
  display: flex;
  overflow: hidden;
  text-align: left;
  .imgWrap {
    position: relative;
    .infodetail__img {
      width: 150px;
      height: 150px;
      margin-right: 30px;
    }
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
  }
  .mediaInfoData__info {
    text-align: left;
    margin-left: 30px;
  }
  .mediaInfoData__info__title {
    display: flex;
  }
  .mediaInfoData__info__title__left {
    font-size: 18px;
    font-weight: 700;
    margin-right: 15px;
  }
  .mediaInfoData__info__title__right {
    position: absolute;
    left: 0;
    top: 0;
    width:54px;
    height: 22px;
    line-height: 22px;
    color: #FFF;
    font-size: 12px;
    text-align: center;
    background-color: #7A808D;
    border-radius:0px 0px 14px 0px;
    opacity:0.8;
    display: inline-block;
  }
 .mediaInfoData__info__title__right__green {
    background-color: #FF7641 !important;
  }
  .mediaInfoData__info__title__right__red {
    background-color: #40D980;
  }
  .mediaInfoData__info__title__right__gray {
    background-color: #969aa2;
  }
  .mediaInfoData__info__detail {
    clear: both;
    margin-top: 22px;
    li {
      display: inline-block;
      vertical-align: top;
      width: 200px;
      margin-bottom: 10px;
      p {
        height: 25px;
        line-height: 25px;
        margin-top: 0;
        color: #888d9d;
      }
    }
    .description{
      display: block;
      width: 100%;
      min-width: 600px !important;
    }
  }
  .mediaInfoData__info__detail > li:nth-child(even){
    // width: 70%;
  }
}
</style>
