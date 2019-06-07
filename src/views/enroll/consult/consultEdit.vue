<!--咨询本创建修改页面-->
<template>
  <div class="edit-consult-wrap" ref="editConsult" v-loading="loading">
    <div class="breadcrumb cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/enroll' }">咨询本</router-link>
        <el-breadcrumb-item>编辑信息</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 编辑咨询本 -->
    <div class="edit-consult-container">
      <el-form
        :model="consultForm"
        label-position="top"
        :rules="consultFormRules"
        ref="consultForm"
        label-width="120px"
        size="mini">

        <!-- 咨询本基本信息数据 -->
        <div class="basic-info">
          <p>基本信息</p>
          <div class="left">
             <el-form-item label="学生头像" prop="student_name">
              <div class="avatar">
                <img :src="consultForm.image" alt="">
              </div>
            </el-form-item>
            <div class="edit-form-item">
              <el-form-item label="学生姓名" prop="student_name" class="edit-form-item-first">
                <el-input v-model.trim="consultForm.student_name" :maxlength="8" placeholder="请输入姓名"></el-input>
              </el-form-item>
              <el-form-item label="性别" prop="sex">
                <el-radio-group v-model.trim="consultForm.sex">
                  <el-radio :label="1">男</el-radio>
                  <el-radio :label="2">女</el-radio>
                </el-radio-group>
              </el-form-item>
            </div>
            <div class="edit-form-item">
              <el-form-item label="身份状态" prop="student_status" class="edit-form-item-first">
                <el-input v-model="consultForm.student_status" disabled></el-input>
              </el-form-item>
              <el-form-item label="微信昵称" prop="name">
                <el-input v-model="defaultConsultForm.name" disabled></el-input>
              </el-form-item>
            </div>
            <div class="edit-form-item">
              <el-form-item label="机构名称" class="edit-form-item-first">
                <el-input v-model="consultForm.school_name" disabled></el-input>
              </el-form-item>
              <el-form-item label="参与活动次数">
                <el-input v-model="defaultConsultForm.times"  disabled></el-input>
              </el-form-item>
            </div>
            <div class="edit-form-item">
              <el-form-item prop="tel" label="学生联系人电话" class="edit-form-item-second-width">
                <el-input v-model="consultForm.tel" disabled></el-input>
              </el-form-item>
              <el-form-item label="联系人关系" class="hidden-label edit-form-item-second-margin">
                <el-select v-model="consultForm.tel_relation" placeholder="与学生关系">
                  <el-option
                    v-for="item in relationList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="edit-form-item">
              <el-form-item label="紧急联系人电话" prop="mobile" class="edit-form-item-second-width">
                <el-input v-model="consultForm.mobile" :maxlength="11" placeholder="请输入紧急联系人电话"></el-input>
              </el-form-item>
              <el-form-item label="与学生关系" class="hidden-label edit-form-item-second-margin">
                <el-select v-model="consultForm.mobile_relation" placeholder="与学生关系">
                  <el-option
                    v-for="item in relationList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="姓名" prop="mobile_name" class="hidden-label edit-form-item-second-margin">
                <el-input v-model.trim="consultForm.mobile_name" :maxlength="8" placeholder="紧急联系人姓名"></el-input>
              </el-form-item>
            </div>
          </div>

          <!-- 咨询本显示更多数据 -->
          <div class="more-info">
             <div class="more-info-form" v-show="!iconDown">
              <p style="margin-top:30px;">其他信息</p>
              <div class="edit-form-item">
                <el-form-item label="民族" class="edit-form-item-first">
                  <el-select v-model="consultForm.nationality" placeholder="请选择民族">
                    <el-option
                      v-for="item in nationList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.name">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="出生日期" style="width:340px;">
                  <el-date-picker :picker-options="{disabledDate: handleDisableDate}" type="date" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" placeholder="请选择出生日期" v-model="consultForm.brith_date" style="width:340px;"></el-date-picker>
                </el-form-item>
              </div>
              <div class="edit-form-item">
                <el-form-item label="年级" class="edit-form-item-first">
                  <el-select v-model="consultForm.grade_id" placeholder="请选择年级">
                    <el-option
                      v-for="item in options.grade"
                      :key="item.grade_id"
                      :label="item.grade_name"
                      :value="item.grade_id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="学校名称" prop="school">
                  <el-input v-model.trim="consultForm.school" :maxlength="30" placeholder="请填写学校名称"></el-input>
                </el-form-item>
              </div>
              <div class="edit-form-item">
                <el-form-item label="家庭住址" class="addres-item">
                  <el-select v-model="address.provice" placeholder="请选择省" filterable @change="selectCity">
                    <el-option v-for="(item) in proviceOption" :key='item.name' :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="城市" class="hidden-label addres-item">
                  <el-select v-model="address.city" placeholder="请选择市" filterable @change="selectArea">
                    <el-option v-for="(item) in cityOption" :key='item.name' :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="县" class="hidden-label addres-item">
                  <el-select v-model="address.area" placeholder="请选择区" filterable>
                    <el-option v-for="(item) in areaOption" :key='item.name' :label="item.name" :value="item.name"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="地址" class="hidden-label">
                  <el-input v-model.trim="address.fullAdd" :maxlength="30" placeholder="请输入地址" style="width:310px;"></el-input>
                </el-form-item>
              </div>
            </div>
            <div class="more-info-title">
              <div @click.stop.prevent="iconDown=!iconDown" class="more-info-button">
                <span class="more-info-item" v-if="iconDown">显示更多</span>
                <span class="more-info-item" v-else>收起更多</span>
                <i :class="[iconDown ? 'icon-down-active el-icon-arrow-down' : 'icon-up-active el-icon-arrow-down']" style="font-size:14px;color:#fff;"></i>
              </div>
            </div>
          </div>
        </div>

        <!-- 咨询本跟进信息数据 -->
        <div class="follow-info">
          <p>跟进信息</p>
          <div class="edit-form-item">
            <el-form-item label="沟通人" prop="teacher_name" class="edit-form-item-first">
              <el-input v-model="consultForm.teacher_name" disabled></el-input>
            </el-form-item>
            <el-form-item label="咨询方式" prop="type">
              <el-radio-group v-model="consultForm.type" style="line-height:1">
                <el-radio :label="1">电话</el-radio>
                <el-radio :label="2">微信</el-radio>
                <el-radio :label="3">线下来访</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="edit-form-item">
            <el-form-item label="意向课程" class="edit-form-item-second-width">
              <el-select v-model="consultForm.subject_id" placeholder="请选择学科">
                <el-option
                  v-for="item in options.subject"
                  :key="item.subject_id"
                  :label="item.subject_name"
                  :value="item.subject_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="年级" class="edit-form-item-second-margin hidden-label">
              <el-select v-model="consultForm.grade" placeholder="请选择年级">
                <el-option
                  v-for="item in options.grade"
                  :key="item.grade_id"
                  :label="item.grade_name"
                  :value="item.grade_id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="班级" class="edit-form-item-second-margin hidden-label">
              <el-select v-model="consultForm.class_id" placeholder="请选择班级类型">
                <el-option
                  v-for="item in options.class_type"
                  :key="item.class_level_id"
                  :label="item.class_level_name"
                  :value="item.class_level_id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="edit-form-item">
            <el-form-item label="沟通日期" class="edit-form-item-date">
              <el-date-picker :picker-options="{disabledDate: handleDisableDate}" type="date" :editable="false" :clearable="false" value-format="yyyy-MM-dd" placeholder="请选择日期" v-model="consultForm.communication_date">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="跟进状态">
              <el-select v-model="consultForm.status" placeholder="请选择跟进状态">
                <el-option
                  v-for="item in statusOption"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <el-form-item label="标签备注" prop="tag" style="width:760px;">
            <el-input type="textarea" :maxlength="50" placeholder="请输入 50 个字符以内" :rows="2" v-model.trim="consultForm.tag"></el-input>
          </el-form-item>
          <el-form-item label="沟通记录" prop="communication_record" style="width:760px;">
            <el-input type="textarea" :maxlength="300" placeholder="请输入 300 个字符以内" :rows="4" v-model.trim="consultForm.communication_record"></el-input>
          </el-form-item>
        </div>

        <div class="communication-info" v-if="!defaultConsultForm.isFirst">
          <p>沟通详情</p>
          <div style="padding-right:60px;">
            <el-table
              :data="adviceData"
              height="400">
              <el-table-column
                prop="order"
                label="顺序"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="communication_date"
                label="沟通日期"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="type_name"
                label="咨询方式"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="lesson"
                label="意向课程"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="status_name"
                label="跟进状态"
                show-overflow-tooltip
                align="center">
              </el-table-column>
              <el-table-column
                prop="tag"
                label="标签备注"
                align="center"
                :resizable="false"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="communication_record"
                label="沟通记录"
                align="center"
                show-overflow-tooltip>
              </el-table-column>
              <el-table-column
                prop="teacher_name"
                label="沟通人"
                show-overflow-tooltip
                align="center">
              </el-table-column>
            </el-table>
          </div>
        </div>
      </el-form>
    </div>

    <div class="consultForm-bottom">
      <el-button type="primary" size="small" @click="handleCancel" class="cac-button-two cancel-button cancel_button" round>取 消</el-button>
      <el-button type="primary" size="small" @click='handleSubmit("consultForm")' class="cac-button-one confirm_button" round>{{addtype===true?'保存':'确 定'}}</el-button>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
import Nation from '../../../../static/nation.json'
import Area from '../../../../static/area.json'
import util from '@/services/auth/utils'
import { formatDay } from '@/utils'
// import courseApi from '@/services/platform/course'
import consultApi from '@/services/enroll/consult'

export default {
  data () {
    return {
      status: this.$route.query.type,
      addtype: true,
      loading: false,
      iconDown: true,
      editFlag: false,
      proviceOption: {},
      cityOption: {},
      areaOption: {},
      campusList: [],
      rolesList: [],
      permissionList: [],
      nationList: [],
      genderOptions: [{label: '男', value: 1}, {label: '女', value: 2}],
      gradeOptions: [],
      adviceData: [],
      userInfo: {},
      options: {
        class_type: [],
        grade: [],
        subject: []
      },
      address: {
        provice: '',
        city: '',
        area: '',
        fullAdd: ''
      },
      relationList: [
        {
          name: '父亲',
          id: '1'
        },
        {
          name: '母亲',
          id: '2'
        },
        {
          name: '本人',
          id: '3'
        }
      ],
      statusOption: [
        {
          name: '已沟通',
          id: 1
        },
        {
          name: '已邀请',
          id: 2
        },
        {
          name: '已试听',
          id: 3
        },
        {
          name: '已失效',
          id: 4
        }
      ],
      defaultConsultForm: {
        isFirst: false,
        status: '',
        name: '',
        times: ''
      },
      consultForm: {
        school_id: '',
        student_id: '',
        student_name: '',
        tel: '',
        image: '',
        sex: '',
        tel_relation: '',
        student_status: '',
        mobile: '',
        mobile_relation: '',
        mobile_name: '',
        nationality: '',
        brith_date: '',
        grade_id: '',
        school: '',
        school_name: '',
        home_address: '',
        type: 1,
        teacher_id: '',
        teacher_name: '',
        subject_id: '',
        grade: '',
        class_id: '',
        communication_date: formatDay((new Date()).getTime()),
        status: 1,
        tag: '',
        communication_record: ''
      },
      consultFormRules: {
        mobile: [
          { required: false, message: '请输入家长手机号', trigger: 'blur' },
          { pattern: /^1[0-9][0-9]\d{8}$/, message: '手机号格式不正确', trigger: 'blur' }
        ],
        tag: [
          { required: true, message: '请输入标签备注', trigger: 'blur' },
          { min: 0, max: 50, message: '超出字数限制，无法编辑', trigger: 'blur' }
        ],
        communication_record: [
          { required: true, message: '请输入沟通记录', trigger: 'blur' },
          { min: 0, max: 300, message: '超出字数限制，无法编辑', trigger: 'blur' }
        ]
      }
    }
  },
  filters: {
    statusFormat (val) {
      if (val === 1) {
        return '机构学生'
      }
    }
  },
  watch: {
    consultForm: {
      handler (oldVal, newVal) {
        this.editFlag = true
      },
      deep: true
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/enroll') {
      to.meta.keepAlive = false
      this.$destroy()
    } else {
      to.meta.keepAlive = true
      this.$destroy()
    }
    next()
  },
  created () {
    this.init()
  },
  methods: {
    // 初始化
    init () {
      // this.getDefaultData()
      this.getNation()
      this.getArea()
      this.getOptions()
    },
    // 获取默认数据
    getDefaultData () {
      let param = {}
      param.student_id = this.$route.query.stId
      param.school_id = this.$route.query.scId

      consultApi.getDefaultData(param).then((res) => {
        if (res.status_code === 200) {
          let data = res.data

          this.defaultConsultForm.isFirst = data.is_first
          this.defaultConsultForm.name = data.name
          this.defaultConsultForm.times = localStorage.getItem('times')
          for (let key in this.consultForm) {
            if (data[key]) {
              this.consultForm[key] = data[key]
            }
          }
          this.consultForm.teacher_name = this.userInfo.name
          this.consultForm.teacher_id = this.userInfo.id
          this.consultForm.status = 1
          this.consultForm.school_name = this.userInfo.school_name
          this.consultForm.school_id = this.userInfo.school_id
          this.addressShow(this.consultForm.home_address)

          switch (data.status) {
            case 1:
              this.consultForm.student_status = '机构学生'
              break
            case 2:
              this.consultForm.student_status = '非机构学生'
              break
            case 3:
              this.consultForm.student_status = '未知'
              break
            default:
              this.consultForm.student_status = '未知'
          }
          this.adviceData = data.advice.map((item, index) => {
            item.order = index + 1
            item.lesson = ''
            if (item.communication_date) {
              item.communication_date = item.communication_date.slice(0, 10)
            }
            if (item.class_id) {
              this.options.class_type.forEach(itemSub => {
                if (itemSub.class_level_id === item.class_id) {
                  item.class_name = itemSub.class_level_name
                }
              })
            }

            if (item.grade_id) {
              this.options.grade.forEach(itemSub => {
                if (itemSub.grade_id === item.grade_id) {
                  item.grade_name = itemSub.grade_name
                }
              })
            }

            if (item.subject_id) {
              this.options.subject.forEach(itemSub => {
                if (itemSub.subject_id === item.subject_id) {
                  item.subject_name = itemSub.subject_name
                }
              })
            }

            if (item.subject_name) {
              item.lesson += item.subject_name
            } if (item.grade_name) {
              item.lesson += '/' + item.grade_name
            } if (item.class_name) {
              item.lesson += '/' + item.class_name
            }
            for (let key in item) {
              if (!item[key]) {
                item[key] = '无'
              }
            }
            return item
          })
        }
      })
    },
    // 获取年级，班级类型，学科的下拉框数据
    getOptions () {
      let params = {}
      this.getUserInfo()
      // let userInfo = util.getUser()

      if (this.userInfo.third_part) {
        params.type = 4
      } else {
        params.type = this.userInfo.is_self_live === 0 ? 1 : 2
      }
      consultApi.getOptions(params).then(res => {
        if (res.status_code === 200) {
          this.options.class_type = res.data.class_type
          this.options.grade = res.data.grade
          this.options.subject = res.data.subject
          this.getDefaultData()
        }
      })
    },
    // 获取民族列表数据
    getNation () {
      this.nationList = Nation
    },
    // 选择地区
    getArea () {
      this.proviceOption = Area
    },
    // 获取城市
    selectCity (value) {
      this.cityOption = {}
      this.areaOption = {}
      this.address.city = ''
      this.address.area = ''
      this.consultForm.area_id = ''
      this.proviceOption.forEach(item => {
        if (item.name === value) {
          this.cityOption = item.children
        }
      })
    },
    // 获取区
    selectArea (value) {
      this.areaOption = {}
      this.address.area = ''
      this.cityOption.forEach(item => {
        if (item.name === value) {
          this.areaOption = item.children
        }
      })
    },
    // 地址提交前的处理
    addressFormat () {
      let address = ''
      if (this.address.provice) {
        address += '1' + this.address.provice
      } if (this.address.city) {
        address += '/2' + this.address.city
      } if (this.address.area) {
        address += '/3' + this.address.area
      } if (this.address.fullAdd) {
        address += '/4' + this.address.fullAdd
      }
      return address
    },
    // 地址回显的处理
    addressShow (val) {
      let ary

      if (val) {
        ary = val.split('/')
        for (let i = 0, len = ary.length; i < len; i++) {
          if (ary[i][0] === '1') {
            this.address.provice = ary[i].slice(1)
            this.proviceOption.forEach(item => {
              if (item.name === this.address.provice) {
                this.cityOption = item.children
              }
            })
            continue
          } if (ary[i][0] === '2') {
            this.address.city = ary[i].slice(1)
            this.cityOption.forEach(item => {
              if (item.name === this.address.city) {
                this.areaOption = item.children
              }
            })
            continue
          } if (ary[i][0] === '3') {
            this.address.area = ary[i].slice(1)
            continue
          } if (ary[i][0] === '4') {
            this.address.fullAdd = ary[i].slice(1)
            continue
          }
        }
      }
    },
    // 表单提交
    handleSubmit (consultForm) {
      this.$refs[consultForm].validate(valid => {
        if (valid) {
          if (this.editFlag) {
            this.$confirm('确定保存吗?', '', {
              confirmButtonText: '确定',
              confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
              cancelButtonText: '取消',
              cancelButtonClass: 'cac-button-two dialog_cancel_button is-round',
              center: true
            }).then(() => {
              // let params = {}
              this.loading = true
              this.consultForm.school_id = this.$route.query.scId
              this.consultForm.student_id = this.$route.query.stId
              this.consultForm.home_address = this.addressFormat()

              consultApi.updateConsult(this.consultForm).then((res) => {
                this.loading = false
                if (res.status_code === 200) {
                  this.$message({
                    type: 'success',
                    message: '保存成功!',
                    duration: '500',
                    onClose: () => {
                      this.$router.back()
                    }
                  })
                } else {
                  this.$message.error('保存失败, 请稍后重试!')
                }
              })
            })
          } else {
            this.$message({
              type: 'warning',
              message: '请先修改表单再点击确定按钮!'
            })
          }
        } else {
          this.canSubmit = true
          this.loading = false
        }
      })
    },
    // 取消
    handleCancel () {
      this.$router.back()
    },
    // 时间控件禁选大于当前日期
    handleDisableDate (time) {
      return time.getTime() > (new Date()).getTime()
    },
    // 图片加载错误处理
    error (e) {
      e.target.style.visibility = 'hidden'
    },
    // 获取用户信息
    getUserInfo () {
      this.userInfo = util.getUser()
    }
  }
}
</script>

<style lang="less">
  .edit-consult-wrap {
    width: 100%;
    text-align: left;
    overflow: hidden;

    .edit-consult-container {
      width: 100%;
      margin-top: 30px;

      .edit-form-item {
        display: flex;

        .edit-form-item-first {
          margin-right: 80px;
        }
        .edit-form-item-second-width {
          width: 247px;
        }
        .edit-form-item-second-margin {
          width: 247px;
          margin-left: 10px;
        }
        .edit-form-item-date  {
          margin-right: 80px;

          .el-input {
            width: 340px;
          }
        }
        .addres-item {
          width: 140px;
          margin-right: 10px;
        }
      }
      .basic-info {
        padding-bottom: 60px;

        .avatar {
          width: 80px;
          height: 79px;
          background-image: url(../../../../static/img/default_avatar.png);
          background-size: cover;

          img {
            width: 80px;
            height: 79px;
            border-radius: 3px;
          }
        }
        p {
          font-size: 20px;
        }
    }
    .hidden-label .el-form-item__label {
      visibility: hidden !important;
    }
      p {
          font-size: 20px;
          font-weight: bold;
          height: 28px;
          line-height: 28px;
          margin-bottom: 30px;
        }
      .el-form {
        .left {
          display: inline-block;
          vertical-align: top;
          padding-bottom: 12px;
        }
        .left {
          margin-right: 80px;
        }
      }
      .icon-down {
        transition: transform .3s, -webkit-transform .3s;
      }
      .icon-down-active {
        transform: rotateZ(0);
      }
      .more-info-title {
        // padding-bottom: 6px;
        height: 34px;
        line-height: 34px;
        margin-bottom: 0;

        .more-info-button {
          width: 106px;
          height: 32px;
          border-radius: 20px;
          border: 1px solid rgba(238,238,238,1);
          cursor: pointer;
          text-align: center;
          line-height: 32px;
          background-color: #3c75f6;
          &:hover {
            background-color: #294FA5;
          }
        }
        .more-info-item {
          font-size:13px;
          color:#fff;
        }
      }
      .more-info-form {
        transition: display 2s;
        -webkit-transiton: display 2s;
      }
      .icon-up-active {
        transform: rotateZ(180deg);
      }
      .el-form-item--mini .el-form-item__content {
        line-height: 40px;
      }
      .el-select .el-input__inner {
        font-size: 12px;
      }
      .el-form-item {
        width: 340px;
        .el-form-item__label {
          font-size: 13px;
          color: #7A808D;
          margin-bottom: 6px;
          height: 40px;
          line-height: 40px;
        }
        .el-select {
          width: 100%;
        }
        input {
          height: 40px;
        }
        .campus_checkbox {
          margin-left: 0;
        }
        .roleContent {
          position: relative;
          .roleList {
            margin-top: 20px;
            & > P {
              color: #7A808D;
              font-size: 13px;
            }
          }
          .firstRoleList {
            margin-top: 0;
          }
          .buyClassWrap {
            width: 100%;
            padding: 24px;
            background-color: #F9FBFC;
            color: #ABB9C6;
            margin-bottom: 10px;
            .selfCourseContent {
              font-size: 14px;
              margin-bottom: 20px;
              .lessonName {
                height: 60px;
              }
              p {
                height: 30px;
                line-height: 30px;
              }
            }
          }
        }
      }
      .roleFormItem {
        width: 100%;
        .el-form-item__error {
          margin-top: -5px;
        }
      }
    }
    .consultForm-bottom {
      margin-top: 20px;
    }
    .tips {
      margin-bottom: 20px;
    }
    .campus_Content {
      padding: 30px;
      background-color: #F9FBFC;
    }
    .el-checkbox + .el-checkbox {
      padding-right: 30px;
      margin-left: 0;
    }
    .el-checkbox.el-checkbox {
      padding-right: 30px;
    }
    .area__select.el-form-item .el-form-item__content{
      width: 140px;
      margin-right: 10px;
    }
    .communication-info {
      padding-top: 40px;
    }
  }
  .clearfix {
    clear: both;
  }
  .el-tooltip__popper {
    max-width: 80%;
  }
</style>
