<template>
  <div class="content-item-wrap">
    <div class="content-item-top">
      <div class="content-item-img">
        <img :src="data.content_image_url" alt="">
        <span class="status-icon" :class="dataCom.class">{{dataCom.statusName}}</span>
      </div>
      <div class="class-item-title">
        <h5>{{dataCom.course_bag_name}}</h5>
        <ul class="class-item-desc">
          <li>
            <span>学科</span>
            <span>{{dataCom.subjectName || '无'}}</span>
          </li>
          <li>
            <span>年级</span>
            <span>{{dataCom.gradeName || '无'}}</span>
          </li>
          <li>
            <span>面授主讲</span>
            <span>{{dataCom.scene_teacher_name}}</span>
          </li>
          <li>
            <span>生效日期</span>
            <span>{{dataCom.effected_at}}</span>
          </li>
          <li>
            <span>结束日期</span>
            <span>{{dataCom.expired_at}}</span>
          </li>
        </ul>
      </div>
    </div>
    <div class="content-item-bottom">
      <el-button type="primary" :disabled="disabled" class="cac-button-one" round size="mini" @click="handleBind">{{dialogTitle}}</el-button>
    </div>
    <el-dialog
      :title="dialogTitleCom"
      :visible.sync="dialogVisible"
      @open="handleOpen"
      width="450px"
      center>
      <div style="display:flex;height:50px;line-height:50px;justify-content:space-between;">
        <div style="color:#7A808D;font-weight:500;font-family: '苹方-简 中黑体';">面授主讲</div>
        <div style="position:relative;">
          <el-select v-model="mainTeacher" placeholder="请选择">
            <el-option
              v-for="item in teacherList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              <span>{{item.name}}</span>
              <span style="color:#8492a6;font-size:12px;">{{item.tel}}</span>
            </el-option>
          </el-select>
          <span v-if="validateTip" style="position:absolute;top:60px;left:0;font-size:12px;color:#f56c6c;line-height:1;">请选择面授主讲</span>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="cac-button-three dialog_cancel_button is-round" @click="handleCancel">取 消</el-button>
        <el-button :loading="submitLoading" class="cac-button-one dialog_confirm_button is-round" type="primary" @click="handleSubmit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import contentApi from '@/services/educational/content'

export default {
  name: 'ContentItem',
  props: {
    data: {
      type: Object,
      required: true
    },
    teacherList: {
      type: Array,
      required: true
    }
  },
  data () {
    return {
      itemData: {},
      dialogTitle: '选择主讲',
      dialogVisible: false,
      submitLoading: false,
      mainTeacher: '',
      validateTip: false
      // bindFlag: this.data.scene_teacher_name === '暂无面授主讲'
    }
  },
  watch: {
    mainTeacher (newVal, oldVal) {
      if (newVal) {
        this.validateTip = false
      }
    }
  },
  computed: {
    dataCom () {
      switch (this.data['use_status']) {
        case 1:
          this.data.statusName = '未生效'
          this.data.class = 'not-use'
          this.disabled = false
          break
        case 2:
          this.data.statusName = '生效中'
          this.data.class = 'used'
          this.disabled = false
          break
        case 3:
          this.data.statusName = '已到期'
          this.data.class = 'lost-use'
          this.disabled = true
          break
      }
      if (!(this.data.scene_teacher_name === '暂无面授主讲')) {
        this.dialogTitle = '更换主讲'
      }
      this.data.content_image_url = this.data.content_image_url ? this.data.content_image_url : '../../../../static/img/content_default.png'
      return Object.assign({}, this.data)
    },
    dialogTitleCom () {
      return this.dialogTitle.slice(0, 2) + '面授主讲'
    }
  },
  methods: {
    // 处理课程包绑定面授主讲
    handleBind () {
      this.dialogVisible = true
    },
    // 处理对话框取消
    handleCancel () {
      this.dialogVisible = false
    },
    // 处理对话框打开时的回调
    handleOpen () {
      this.mainTeacher = this.data.user_id ? this.data.user_id : ''
      this.validateTip = false
    },
    // 处理提交
    handleSubmit () {
      if (this.mainTeacher) {
        this.validateTip = false
        this.submitLoading = true
        const { subject_id, grade_id, effected_at, id } = this.data
        let params = Object.assign({}, { subject_id, grade_id, effected_at, content_id: id, user_id: this.mainTeacher })

        if (this.data.scene_teacher_name === '暂无面授主讲') {
          contentApi.contentBind(params).then(res => {
            this.handleSubmitCallback(res, 1)
          })
        } else {
          contentApi.contentChange(params).then(res => {
            this.handleSubmitCallback(res, 0)
          })
        }
      } else {
        this.validateTip = true
      }
    },
    // 处理绑定主讲或更换主讲的回调
    handleSubmitCallback (res, type) {
      this.submitLoading = false
      if (res.status_code === 200) {
        this.dialogVisible = false
        this.$parent.getContentList(false, false)
        // let msg = type ? '添加' : '更换'

        // this.$message({
        //   type: 'success',
        //   message: `恭喜你, ${msg}面授主讲成功!`
        // })
      // } else {
      //   if (res.status_code === 400) {
      //     this.$message.error(res.message)
      //   } else {
      //     this.$message.error('操作失败, 请稍后重试!')
      //   }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.content-item-wrap {
  display: inline-block;
  width: 500px;
  font-size: 13px;
  font-family:PingFangSC-Regular;
  text-align: left;
  padding-bottom: 40px;
  .content-item-top {
    display: flex;
  }
  .content-item-img {
    width: 164px;
    height: 164px;
    background: lightgray;
    border-radius: 3px;
    position: relative;
    .status-icon {
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      width: 54px;
      height: 22px;
      line-height: 22px;
      text-align: center;
      font-size: 12px;
      color: #fff;
      border-radius: 0 0 14px 0;
    }
    img {
      width: 164px;
      height: 164px;
      border-radius: 3px;
      display: block;
    }
  }
  .class-item-title {
    padding-left: 20px;
    h5 {
      width: 321px;
      word-break: break-all;
      font-size: 16px;
      font-weight: 600;
      line-height: 22px;
      padding-bottom: 10px;
    }
    .class-item-desc {
      li {
        height: 18px;
        line-height: 18px;
        margin-bottom: 6px;
        span {
          color: #3E434C;
          &:first-child {
            color: #7A808D;
            font-weight: 500;
            display: inline-block;
            width: 55px;
            text-align: right;
            margin-right: 20px;
          }
        }
      }
    }
  }
  .not-use {
    background:rgba(255,118,65,.8)
  }
  .used {
    background: rgba(64,217,128,.8);
  }
  .lost-use {
    background: rgba(122,128,141,.8);
  }
  .content-item-bottom {
    padding-top: 20px;
    .el-button {
      font-size: 13px;
    }
  }
  /deep/ .cac-button-one,.cac-button-three {
    min-width: 100px;
    height: 32px;
    font-size: 13px;
  }
  /deep/ .el-dialog__header{
    text-align: left;
    font-size: 24px;
  }
  /deep/ .el-dialog__body {
    text-align: left;
  }
  /deep/ .el-select .el-input__inner {
    width: 315px;
    height: 50px!important;
    line-height: 50px!important;
    border-radius: 3px;
  }
  /deep/ .el-dialog__title {
    font-size: 24px;
  }
  /deep/ .el-dialog__header {
    padding: 30px 30px 10px;
  }
  /deep/ .el-dialog__headerbtn {
    top: 30px;
    right: 30px;
  }
  /deep/ .el-dialog--center .el-dialog__body {
    padding: 25px 30px 30px;
  }
  /deep/ .el-dialog__footer{
    padding: 0px 20px 40px;
  }
  /deep/ .el-input__suffix {
    right: 10px;
  }
  // /deep/ .el-icon-arrow-up:before {
  //   content: '';
  //   width: 0;
  //   height: 0;
  //   border-bottom: 5px solid rgba(171,185,198,1);
  //   border-left: 5px solid transparent;
  //   border-right: 5px solid transparent;
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -50%);
  //   vertical-align: inherit;
  // }
}
</style>
