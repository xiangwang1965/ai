<template>
  <div class="createTeacherClass" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/liveClassroom' }">直播间管理</router-link>
        <el-breadcrumb-item>创建直播间</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="createForm">
      <p>基本信息</p>
      <el-form
        class="demo-teacherForm"
        ref="LiveRoomForm"
        :model="LiveRoomForm"
        :rules="LiveRoomRules"
        label-width="160px"
        size="mini"
        label-position="top">
        <el-form-item label="威度ID：" prop="vd_id">
          <el-input maxlength="10" v-model="LiveRoomForm.vd_id" placeholder="请输入威度ID" @blur="inputBlur"></el-input>
        </el-form-item>
        <el-form-item label="机构地区：" prop="area_id">
          <el-input v-show="false" v-model.trim="LiveRoomForm.area_id"></el-input>
          <AreaSelect :address="address" v-on:select="SelectArea"></AreaSelect>
        </el-form-item>
        <el-form-item label="详细地址：" prop="address">
          <el-input type="textarea" :maxlength="50" :resize="'none'" :autosize="{ minRows: 2 }" v-model.trim="LiveRoomForm.address" placeholder="请输入详细地址"></el-input>
        </el-form-item>
        <el-form-item label="直播间名称：" prop="name">
          <el-input v-model.trim="LiveRoomForm.name" :maxlength="30" placeholder="请输入直播间名称"></el-input>
        </el-form-item>
        <el-form-item label="直播间描述：" prop="describe" class="describeForm">
          <el-input type="textarea" :resize="'none'" :autosize="{ minRows: 2, maxRows: 4}" :maxlength="50" v-model.trim="LiveRoomForm.describe" placeholder="请输入50字以内描述"></el-input>
        </el-form-item>
      </el-form>
      <div class="bottom">
        <el-button type="primary" @click="cancel" size="small" round class="cac-button-two cancel_button">取 消</el-button>
        <el-button type="primary" @click="submitForm('LiveRoomForm')" size="small" round class="cac-button-one confirm_button">创 建</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import teacherClassApi from '@/services/platform/teacher_class'
  import AreaSelect from '@/components/platform/area'
  import InputNumber from '@/components/inputNumber'
  export default {
    data () {
      return {
        address: {
        },
        loading: false,
        LiveRoomForm: {
          vd_id: '',
          area_id: '',
          address: '',
          name: '',
          describe: ''
        },
        LiveRoomRules: {
          vd_id: [
            { required: true, message: '请输入威度ID', trigger: 'blur' }
          ],
          area_id: [
            { required: true, message: '请选择机构地区', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入直播间名称', trigger: 'blur' }
          ]
        }
      }
    },
    components: {
      AreaSelect,
      InputNumber
    },
    watch: {
    },
    created () {
    },
    mounted () {
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/liveClassroom') {
        to.meta.keepAlive = false
        this.$destroy()
      } else {
        to.meta.keepAlive = true
        this.$destroy()
      }
      next()
    },
    methods: {
      inputBlur () {
        if (this.LiveRoomForm.vd_id.length > 0 && isNaN(this.LiveRoomForm.vd_id)) {
          this.$message({
            message: '威度ID格式不正确，请重新输入',
            type: 'warning'
          })
          this.LiveRoomForm.vd_id = ''
        }
      },
      submitForm (formData) {
        this.loading = true
        this.$refs[formData].validate((valid) => {
          if (valid) {
            let params = {}
            let vm = this
            params = this.LiveRoomForm
            params.type = 1
            teacherClassApi.createLiveRoom(params).then(res => {
              this.loading = false
              if (res.ok) {
                vm.$router.back()
              }
            })
          } else {
            this.loading = false
            return false
          }
        })
      },
      SelectArea (data) {
        this.$set(this.LiveRoomForm, 'area_id', data)
        this.$refs['LiveRoomForm'].validate((valid) => {
          if (valid) {
            console.log('submit!')
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      cancel () {
        this.$router.back()
      }
    }
  }
</script>
<style lang="less">
.createTeacherClass {
  text-align: left;
  .createForm {
    &>p {
      font-size: 20px;
      font-weight: bold;
      height: 28px;
      line-height: 28px;
      margin: 30px 0;
    }
    .el-form-item {
      width: 620px;
      .el-input, input {
        width: 100%;
        height: 50px;
      }
      .el-select {
        margin-right: 6px;
      }
      .el-select:last-of-type {
        margin-right: 0;
      }
    }
    .describeForm {
      width: 770px;
      textarea {
        min-height: 50px;
      }
    }
    .el-form-item__label {
      font-size: 13px;
      height: 28px;
      line-height: 28px;
      color: #7A808D;
    }
  }
  .bottom {
    padding-top: 30px;
  }
}
</style>
