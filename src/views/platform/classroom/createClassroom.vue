<template>
  <div class="createClassroom" id="createClassroomPage" v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/classroom' }">教室管理</router-link>
        <el-breadcrumb-item>创建教室</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="radiogroup">
      <el-form
        class="createClassroomForm"
        :model="LiveRoomForm"
        :rules="LiveRoomRules"
        ref="LiveRoomForm"
        size="mini"
        label-width="160px"
        label-position="top">
        <el-form-item label="教室用途" prop="vd_id">
          <el-checkbox-group v-model="typeList">
            <el-checkbox label="normal_course">普通课程</el-checkbox>
            <el-checkbox label="live_course" v-if="isClassLive">双师课程</el-checkbox>
          </el-checkbox-group>
          <el-input :maxlength="10" v-if="typeList.indexOf('live_course') !== -1" v-model.trim="LiveRoomForm.vd_id" placeholder="请输入威渡ID" @blur="inputBlur"></el-input>
        </el-form-item>
        <!-- <el-form-item label="机构地区：" prop="area_id">
          <el-input v-show="false" v-model.trim="LiveRoomForm.area_id"></el-input>
          <AreaSelect :address="address" v-on:select="SelectArea"></AreaSelect>
        </el-form-item> -->
        <el-form-item label="教室名称" prop="name">
          <el-input v-model.trim="LiveRoomForm.name" :maxlength="15" placeholder="请输入15个字符以内"></el-input>
        </el-form-item>
        <el-form-item label="校区名称" prop="campus_id">
          <el-select v-model="LiveRoomForm.campus_id" placeholder="请选择校区" @visible-change="getCampusList">
            <el-option
              v-for="item in campusList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input type="textarea" :maxlength="50" autosize v-model.trim="LiveRoomForm.address" placeholder="请输入50个字符以内"></el-input>
        </el-form-item>
        <!-- <el-form-item label="教室描述：" prop="describe">
          <el-input type="textarea" autosize v-model.trim="LiveRoomForm.describe"></el-input>
        </el-form-item> -->
      </el-form>
      <div class="bottom">
        <el-button type="primary" size="small" round @click="cancel" class="cac-button-two cancel-button cancel_button">取消</el-button>
        <el-button type="primary" size="small" round @click="submitForm('LiveRoomForm')" class="cac-button-one confirm_button">创建</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import teacherClassApi from '@/services/platform/teacher_class'
  import staffApi from '@/services/internal/staff'
  import newClassroomApi from '@/services/internal/classroom'
  import AreaSelect from '@/components/platform/area'
  import authUtils from '@/services/auth/utils'

  export default {
    props: [ 'source' ],
    data () {
      var validatePass2 = (rule, value, callback) => {
        // 判断是否勾选
        if (this.typeList.length > 0) {
          // 判断是否勾选双师课程
          if (this.typeList.indexOf('live_course') === -1) {
            // 没有勾选双师课程
//            delete this.LiveRoomForm.vd_id
            delete this.LiveRoomForm.live_course
            this.LiveRoomForm.normal_course = 1
            callback()
          } else {
            // 是否填写vd_id
            if (!this.LiveRoomForm.vd_id) {
              callback(new Error('请填写教室用途'))
            }
            this.LiveRoomForm.live_course = 1
            if (this.typeList.length === 2) {
              this.LiveRoomForm.normal_course = 1
            }
            callback()
          }
        } else {
          callback(new Error('请填写教室用途'))
        }
      }
      return {
        loading: false,
        address: {
        },
        typeList: [],
        campusList: [],
        LiveRoomForm: {
          vd_id: '',
          area_id: '',
          address: '',
          name: '',
          describe: '',
          campus_id: ''
        },
        LiveRoomRules: {
          campus_id: [
            { required: true, message: '请选择校区', trigger: 'change' }
          ],
          vd_id: [
            { max: 10, validator: validatePass2, trigger: 'blur change' }
          ],
          area_id: [
            { required: true, message: '请选择机构地区', trigger: 'blur' }
          ],
          address: [
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ],
          name: [
            { required: true, message: '请输入教室名称', trigger: 'blur' }
          ]
        },
        isClassLive: authUtils.getUser().is_self_live
      }
    },
    beforeRouteLeave (to, from, next) {
      if (to.path === '/classroom') {
        to.meta.keepAlive = false
        this.$destroy()
      } else {
        to.meta.keepAlive = true
        this.$destroy()
      }
      next()
    },
    components: {
      AreaSelect
    },
    watch: {
      typeList: function () {
//        this.clearValidate()
      }
    },
    created () {
      if (!this.isClassLive) {
        this.typeList.push('normal_course')
      }
    },
    mounted () {
    },
    methods: {
      getCampusList (val) {
        if (val) {
          staffApi.getCampusList({status: 1}).then(res => {
            this.campusList = res
          })
        }
      },
      clearValidate () {
        this.$refs['LiveRoomForm'].clearValidate()
        if (this.typeList.length > 0) {
          if (this.typeList.indexOf('live_course') === -1) {
            this.LiveRoomRules.vd_id[0].message = ''
            this.LiveRoomRules.vd_id[0].required = false
            delete this.LiveRoomForm.live_course
          } else {
            this.LiveRoomRules.vd_id[0].required = true
            this.LiveRoomRules.vd_id[0].message = '请输入威渡ID'
          }
          this.typeList.map((v, i) => {
            this.LiveRoomForm[v] = 1
          })
        } else {
          if (this.typeList.indexOf('live_course') === 1) {
            this.LiveRoomRules.vd_id[0].required = false
            this.LiveRoomRules.vd_id[0].message = ''
          } else {
            this.LiveRoomRules.vd_id[0].required = true
            this.LiveRoomRules.vd_id[0].message = '请选择教室用途'
          }
        }
        this.$refs['LiveRoomForm'].validate((valid) => {
          if (valid) {
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
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
        if (this.typeList.length > 0) {
          if (this.typeList.indexOf('live_course') === -1) {
            this.LiveRoomRules.vd_id[0].message = ''
            this.LiveRoomRules.vd_id[0].required = false
          } else {
            this.LiveRoomRules.vd_id[0].required = true
            this.LiveRoomRules.vd_id[0].message = '请填写教室用途'
          }
          this.typeList.map((v, i) => {
            this.LiveRoomForm[v] = 1
          })
        } else {
          this.LiveRoomRules.vd_id[0].required = true
          this.LiveRoomRules.vd_id[0].message = '请填写教室用途'
        }
        this.$refs[formData].validate((valid) => {
          if (valid) {
            let params = {}
            let vm = this
            for (var p in this.LiveRoomForm) {
              if (p !== 'vd_id') {
                params[p] = this.LiveRoomForm[p]
              }
            }
            if (this.LiveRoomRules.vd_id[0].required) {
              params.vd_id = this.LiveRoomForm.vd_id
            }
            params.type = 2
            this.loading = true
            if (this.source === 'classroom') {
              newClassroomApi.createClassroom(params).then(res => {
                this.loading = false
                if (res.ok) {
                  vm.$router.back()
                }
              })
            } else {
              teacherClassApi.createLiveRoom(params).then(res => {
                this.loading = false
                if (res.ok) {
                  vm.$router.back()
                }
              })
            }
          } else {
            console.log('error submit!!')
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
.createClassroom {
  .createClassroomForm {
    .el-form-item__label {
      height: 28px;
      color: #7A808D;
    }
    .el-form-item__label::before {
      content: '*';
      color: #f56c6c;
      margin-right: 4px;
    }
    .el-checkbox__label {
      color: #3E434C;
    }
    input {
      width: 340px;
      height: 50px;
    }
    textarea {
      width: 340px;
      padding: 15px;
      min-height: 50px !important;
      font-size: 12px;
      border-color: #dcdfe6;
    }
  }
  .radiogroup {
    text-align: left;
    background-color: #fff;
    padding: 15px 30px;
    margin-top: 20px;
  }

  .bottom {
    padding-top: 30px;
  }
}
</style>
