<!-- 创建校区 -->
<template>
  <div class='createCampus' v-loading="loading">
    <div class="cac-bread-bar">
      <el-breadcrumb separator="/">
        <router-link :to="{ path: '/campus' }">校区管理</router-link>
        <el-breadcrumb-item>{{$route.query.type === 'edit' ? '编辑' : '创建'}}校区</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="createCampusContent">
      <p>基本信息</p>
      <el-form
        class="demo-createForm"
        :model="createForm"
        :rules="createFormRules"
        ref="createForm"
        label-width="100px"
        label-position="top"
        size="mini">
        <el-form-item label="校区名称" prop="name">
          <el-input v-model="createForm.name" :maxlength="20" width="200px" placeholder="请输入20个字符以内"></el-input>
        </el-form-item>
        <el-form-item class="area__select" prop="area_id" label="校区地区">
          <el-form-item>
            <el-select v-model="createForm.provice" placeholder="请选择省" filterable @change="selectCity">
              <el-option v-for="(item,i) in proviceOption" :key='i' :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="createForm.city" placeholder="请选择市" filterable @change="selectArea">
              <el-option v-for="(item,i) in cityOption" :key='i' :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="createForm.area" placeholder="请选择区" filterable @change="getAreaId">
              <el-option v-for="(item,i) in areaOption" :key='i' :label="item.name" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <input type="hidden" v-model="createForm.area_id" />
        </el-form-item>
        <el-form-item label="详细地址" prop="address">
          <el-input v-model="createForm.address" :maxlength="20" placeholder="请输入20个字符以内"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="bottom createForm__bottom">
      <el-button style="margin-top:30px;" type="primary" size="small" class="cac-button-two cancel-button cancel_button" round @click="cancel">取 消</el-button>
      <el-button style="margin-top:30px;" type="primary" size="small" @click="createCampus('createForm')" class="cac-button-one confirm_button" round>{{type === 'create' ? '创 建' : '确 定'}}</el-button>
    </div>
  </div>
</template>

<script>
// import BasicApI from '@/services/basic'
import campusApi from '@/services/internal/campus'
import Area from '../../../static/area.json'
export default {
  data () {
    return {
      dialogTableVisible: false,
      loading: false,
      proviceOption: {},
      cityOption: {},
      areaOption: {},
      type: this.$route.query.type || 'create',
      createForm: {
        name: '',
        area: '',
        address: '',
        area_id: ''
      },
      createFormRules: {
        name: [
          { required: true, message: '请输入校区名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入详细地址', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        area_id: [
          { required: true, message: '请选择校区地址', trigger: 'change' }
        ]
      }
    }
  },
  beforeRouteLeave (to, from, next) {
    if (to.path === '/campus') {
      to.meta.keepAlive = false
      this.$destroy()
    } else {
      to.meta.keepAlive = true
      this.$destroy()
    }
    next()
  },
  created () {
    this.getArea()
    if (this.type === 'edit') {
      this.createForm = JSON.parse(window.localStorage.getItem('editConfig'))
      this.setConfigArea()
    }
  },
  methods: {
    // 创建
    createCampus (createForm) {
      this.$refs[createForm].validate((valid) => {
        if (valid) {
          this.loading = true
          let params = {
            'name': this.createForm.name,
            'area_id': this.createForm.area,
            'address': this.createForm.address
          }
          if (this.$route.query.type && this.type === 'edit') {
            params.campus_id = this.createForm.id
            campusApi.editCampus(params).then(res => {
              this.loading = false
              if (res.ok) {
                this.$router.push({ path: '/campus' })
                this.createForm = {
                  name: '',
                  area: '',
                  address: '',
                  area_id: ''
                }
              }
            })
          } else {
            campusApi.createCampus(params).then(res => {
              this.loading = false
              if (res.ok) {
                this.$router.push({ path: '/campus' })
                this.createForm = {
                  name: '',
                  area: '',
                  address: '',
                  area_id: ''
                }
              }
            })
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    doCancle () {
      this.$emit('close', true)
    },
    // 选择地区
    getArea () {
      // 后端接口
      // let params = {}
      // BasicApI.queryArea(params).then(res => {
      //   this.proviceOption = res.data
      // })
      // 本地地区
      this.proviceOption = Area
    },
    setConfigArea () {
      var path = this.createForm.area.path.split(',')
      path.forEach((item, index) => {
        item = Number(item)
        switch (index) {
          case 0:
            this.createForm.provice = item
            Area.forEach(city => {
              if (city.id === item) {
                this.cityOption = city.children
              }
            })
            break
          case 1:
            this.createForm.city = item
            this.cityOption.forEach(area => {
              if (area.id === item) {
                this.areaOption = area.children
              }
            })
            break
          case 2:
            this.createForm.area = item
            break
        }
      })
    },
    // 获取城市
    selectCity (value) {
      this.cityOption = {}
      this.areaOption = {}
      this.createForm.city = ''
      this.createForm.area = ''
      this.createForm.area_id = ''
      this.proviceOption.forEach(item => {
        if (item.id === value) {
          this.cityOption = item.children
        }
      })
    },
    //  获取区
    selectArea (value) {
      this.areaOption = {}
      this.createForm.area = ''
      this.cityOption.forEach(item => {
        if (item.id === value) {
          this.areaOption = item.children
        }
      })
    },
    // hidden 校验
    getAreaId (value) {
      this.createForm.area_id = value
      this.$refs['createForm'].validate((valid) => {
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
.createCampus {
  text-align: left;
  .createCampusContent {
    &>p {
      height: 28px;
      line-height: 28px;
      color: #3E434C;
      font-weight: bold;
      font-size: 20px;
      margin: 30px 0 20px;
    }
    .el-form {
      .el-form-item {
        width: 620px;
        .el-form-item {
          margin-bottom: 0;
        }
        .el-form-item__label {
          color: #7A808D;
        }
        .el-select,.el-input {
          width: 100%;
          height: 50px;
          input {
            height: 100%;
          }
        }
        .el-select {
          width: 200px;
          margin-right: 10px;
        }
      }
    }
  }
  .createForm__bottom {
    margin-top: 20px;
    .el-button {
      width: 110px;
      height: 40px;
    }
  }
}
</style>
