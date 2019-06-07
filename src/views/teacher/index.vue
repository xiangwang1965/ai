<template>
    <div id="teacherView">
    <div class="row-bg">
        <h3>教师档案</h3>
         <div>
             <div style="margin-top: 15px;">
                <el-input placeholder="搜索姓名/ID" v-model="params.searchVal" prefix-icon="el-icon-search">
                    <el-button slot="append" type="warning">搜索</el-button>
                </el-input>
            </div>
          </div>
    </div>
     <div class="row-bg">
          <h3>教师信息</h3>
     </div>
     </div>
</template>
<script>
import teacher from '@/services/teacher'
export default {
  data () {
    return {
      tslit: [],
      dateOption: {
        disabledDate: (time) => {
          return time.getTime() > Date.now()
        }
      },
      params: {
        searchVal: '',
      },
      rules: {
        campus_id: [
          { required: true, message: '请选择校区', trigger: 'change' }
        ],
        name: [
          { required: true, message: '请输入学生姓名', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        telephone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[0-9][0-9]\d{8}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ],
        parent_telephone: [
          { pattern: /^1[0-9][0-9]\d{8}$/, message: '手机号码格式不正确', trigger: 'blur' }
        ]
      },
    }
  },
  created () {
      var params = {};
    teacher.querylist(params).then(res => {
        console.log(res);
    //   if (res.ok) {
    //     this.campusList = res.data.options.campus
    //   }
    })
    // if (this.status === 'edit') {
    //   this.getStudent()
    // }
    // this.getOptionsList()
    // this.getGradeList()
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/student') {
      to.meta.keepAlive = false
      this.$destroy()
    } else {
      to.meta.keepAlive = true
      this.$destroy()
    }
    next()
  },
  methods: {
    getOptionsList () {
      receptionApi.getOptionsList().then(res => {
        this.optionGrade = res.data.grade
      })
    },
    getGradeList () {
      let params = {
        school_id: this.schoolId
      }
      courseApi.getGradeList(params).then(res => {
        this.optionGrade = res
      })
    },
    getStudent () {
      let params = {
        'student_id': this.student_id
      }
      studentApi.queryDetail(params).then(res => {
        if (res.ok) {
          this.params = res.data
          this.params.telephone = Number(this.params.telephone)
          // 家长电话只为数字类型
          this.params.parent_telephone = this.params.parent_telephone === '' ? '' : Number(this.params.parent_telephone)
          // gender后台返回0时显示未知
          !this.params.gender && (this.params.gender = 3)
        }
      })
    },
    handleAllDate (val) {
    },
    handleAddClass () {
      this.$dialog.open('classTypeChoose')
    },
    handleDelete (index, row) {
      this.$confirm('是否确定删除该学生?', '提示', {
        confirmButtonText: '确 定',
        confirmButtonClass: 'cac-button-one dialog_confirm_button is-round',
        cancelButtonText: '取 消',
        cancelButtonClass: 'cac-button-two dialog_cancel_button is-round'
      }).then(() => {
        this.tableData.splice(index, 1)
        this.$message({
          type: 'success',
          message: '删除成功!',
          center: true
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除',
          center: true
        })
      })
    },
    doCreate (formName) {
      if (this.canSubmit) {
        this.canSubmit = false
        this.loading = true
        this.$refs[formName].validate((valid) => {
          if (valid) {
            let params = this.params
            if (this.status === 'create') {
              let loadingInstance = this.$loading({
                text: '创建中...',
                target: '.appMain'
              })
              studentApi.create(params).then(res => {
                setTimeout(() => {
                  loadingInstance.close()
                }, 500)
                this.canSubmit = true
                this.loading = false
                if (res.ok) {
                  this.$router.back()
                }
              })
            } else {
              params.student_id = this.student_id
              let loadingInstance = this.$loading({
                text: '修改中...',
                target: '.appMain'
              })
              studentApi.update(params).then(res => {
                setTimeout(() => {
                  loadingInstance.close()
                }, 500)
                this.canSubmit = true
                this.loading = false
                if (res.ok) {
                  this.$router.back()
                }
              })
            }
          } else {
            this.canSubmit = true
            this.loading = false
            return false
          }
        })
      }
    },
    doCancle () {
      this.$router.back()
    }
  }
}
</script>
<style lang="less">
    #teacherView {
        width:100vw;
        height:100vh;
    }
   #teacherView .row-bg{
        float:left;
        height:100vh
    }
   #teacherView .row-bg:first-child{
        width:50%;
    }
   #teacherView .row-bg:last-child{
        width:50%;
    }
  .el-row{
      float:left;
      height:100%;
      background-color:red;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>