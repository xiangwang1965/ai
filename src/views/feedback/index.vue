<template>
  <div id="teacherView">
    <div class="content1">
      <p class="content_title">客服电话</p>
      <div class="left_content" style="height: 6.67rem;background: #fff;border-radius: 0.2rem;">

      <div class="phone" style="margin: auto;position: relative;text-align: center;top: 50%;">客服电话：010-8288 6681</div>
      </div>
    </div>
    <div class="content2">
      <div class="content_title">教师信息</div>
      <div class="right_content teacher_info" style="height: 6.67rem">
 <iframe src="http://web.wisetechai.com/userInfo/index.html" frameborder="0" width="100%" height="100%" id="childFrame" scrolling="no" style="border-radius:0.2rem;"></iframe>
      </div>
    </div>
  </div>

</template>
<script>
import teacher from "@/services/teacher";
export default {
  data() {
    return {

    }
  }

};
</script>
<style lang="less" scoped>
#teacherView {
  display: flex;
  flex: 1;
  .teacher_info {
    background: #fff;
    border-radius: 0.2rem;
  }
  .teacher_box {
    text-align: center;
    width: 3.6rem;
    margin: 0 auto;
    padding-top: 0.3rem;
    .photo {
      width: 1rem;
      height: 1rem;
      border-radius: 100%;
      padding-bottom: 0.12rem;
    }
    .name {
      color: #4a4a4a;
      font-size: 0.2rem;
    }
    .id {
      font-size: 0.16rem;
      color: #9b9b9b;
    }
    .grade {
      background: #ffc151;
      border-radius: 6px;
      text-align: center;
      padding: 0.05rem 0.15rem;
      margin: 0.05rem 0 0.08rem 0;
      display: inline-block;
    }
    .phone {
      font-size: 0.12rem;
      color: #9b9b9b;
    }
    .statistics {
      height: 1rem;
      background: #ffffff;
      border: 0.01rem solid #979797;
      border-radius: 0.2rem;
      display: flex;
      padding: 0.21rem 0;
      margin: 0.18rem 0 0.09rem 0;
      box-sizing: border-box;
      .item {
        border-left: 0.01rem solid #c6c6c6;
        flex: 1;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        .num {
          font-size: 0.3rem;
          color: #9b9b9b;
        }
        .txt {
          font-size: 0.13rem;
          color: #787878;
          opacity: 0.4;
        }
      }
      .item:first-child {
        border-left: none;
      }
    }
    .lesson_lock {
      .lock_row {
        display: flex;
        margin-bottom: 0.12rem;
        .name {
          width: 0.54rem;
          height: 0.54rem;
          border-radius: 100%;
          text-align: center;
          font-size: 0.1rem;
          color: #fff;
          line-height: 0.54rem;
          margin-right: 0.2rem;
        }
        .lock_level {
          width: 2.76rem;
          height: 0.54rem;
          border-radius: 0.27rem;
          display: flex;
          box-sizing: border-box;
          overflow: hidden;
          .lock_item {
            padding: 0.09rem 0;
            flex: 1;
            text-align: center;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            .lock {
              width: 0.21rem;
              height: 0.2rem;
              position: absolute;
              z-index: 10;
              top: 50%;
              margin-top: -0.1rem;
              left: 50%;
              margin-left: -0.1rem;
            }
            p {
              color: #d8d8d8;
              font-size: 0.1rem;
              opacity: 0.6;
            }
          }
          .lock_item:before {
            content: "";
            height: 0.36rem;
            width: 0.01rem;
            position: absolute;
            background: #c6c6c6;
            top: 0.09rem;
            left: 0.01rem;
          }
          .lock_item:first-child:before {
            content: "";
            height: 0.36rem;
            width: 0rem;
          }
          .unlock_y {
            background: #ffc151;
            p {
              color: #fff;
              opacity: 1;
            }
          }
          .unlock_blue {
            background: #6edbef;
            p {
              color: #fff;
              opacity: 1;
            }
          }
          .unlock_red {
            background: #ff696c;
            p {
              color: #fff;
              opacity: 1;
            }
          }
          .unlock_purple {
            background: #777dff;
            p {
              color: #fff;
              opacity: 1;
            }
          }
        }
      }
      .lock_row_y {
        .name {
          background: #ffc151;
        }
        .lock_level {
          border: 0.01rem solid #ffc151;
        }
      }
      .lock_row_b {
        .name {
          background: #6edbef;
        }
        .lock_level {
          border: 0.01rem solid #6edbef;
        }
      }
      .lock_row_r {
        .name {
          background: #ff696c;
        }
        .lock_level {
          border: 0.01rem solid #ff696c;
        }
      }
      .lock_row_p {
        .name {
          background: #777dff;
        }
        .lock_level {
          border: 0.01rem solid #777dff;
        }
      }
    }
  }
}
</style>