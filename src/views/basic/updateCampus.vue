<!-- 创建校区 -->
<template>
  <div id='updatePage'>
    <el-form
      :model="updateForm"
      :rules="updateFormRules"
      ref="updateForm"
      label-width="100px"
      class="demo-updateForm"
      size="mini"
      label-position="top">
      <el-form-item label="校区名称：" prop="name">
        <el-input v-model="updateForm.name" :maxlength="20" width="200px"></el-input>
      </el-form-item>
      <el-form-item class="area__select" prop="area_id">
        <el-form-item label="省：" prop="provice">
          <el-select v-model="updateForm.provice" placeholder="请选择省" filterable @change="selectCity">
            <el-option v-for="(item,i) in proviceOption" :key='i' :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="市：">
          <el-select v-model="updateForm.city" placeholder="请选择市" filterable @change="selectArea">
            <el-option v-for="(item,i) in cityOption" :key='i' :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="区：">
          <el-select v-model="updateForm.area" placeholder="请选择区" filterable @change="getAreaId">
            <el-option v-for="(item,i) in areaOption" :key='i' :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <input type="hidden" v-model="updateForm.area_id" />
      </el-form-item>
      <el-form-item label="详细：" prop="address">
        <el-input v-model="updateForm.address"></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="small" @click="doCancle" class="cancal-button cac-button-two cancel-button cancel_button" round>取 消</el-button>
    <el-button type="primary" size="small" @click="doUpdateCampus('updateForm')" class="cac-button-one confirm_button" round>确 定</el-button>
  </div>
</template>

<script>
import BasicApI from '@/services/basic'
import Area from '../../../static/area.json'
export default {
  data () {
    return {
      dialogTableVisible: false,
      proviceOption: [],
      cityOption: [],
      areaOption: [],
      updateForm: {
        name: '',
        area: '',
        address: '',
        area_id: ''
      },
      updateFormRules: {
        name: [
          { required: true, message: '请输入校区名称', trigger: 'blur' },
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ],
        area_id: [
          { required: true, message: '请选择地区', trigger: 'change' }
        ],
        address: [
          { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  props: ['UpdateCampus'],
  created () {
    for (var key in this.UpdateCampus) {
      this.updateForm[key] = this.UpdateCampus[key]
    }
    this.getArea()
  },
  watch: {
    UpdateCampus () {
      for (var key in this.UpdateCampus) {
        this.updateForm[key] = this.UpdateCampus[key]
      }
      this.getArea()
    }
  },
  methods: {
    // 创建
    doUpdateCampus (updateForm) {
      this.$refs[updateForm].validate((valid) => {
        if (valid) {
          let params = {
            'name': this.updateForm.name,
            'area_id': this.updateForm.area,
            'address': this.updateForm.address,
            'campus_id': this.UpdateCampus.id
          }
          let loadingInstance = this.$loading({
            text: '修改中...'
          })
          BasicApI.update(params).then(res => {
            setTimeout(() => {
              loadingInstance.close()
            }, 500)
            if (res.ok) {
              this.$emit('close', 'success')
            }
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    // 取消
    doCancle () {
      this.$emit('close', true)
    },
    // 选择地区
    getArea () {
      this.proviceOption = Area
      var path = this.updateForm.area.path.split(',')
      path.forEach((item, index) => {
        item = Number(item)
        switch (index) {
          case 0:
            this.updateForm.provice = item
            Area.forEach(city => {
              if (city.id === item) {
                this.cityOption = city.children
              }
            })
            break
          case 1:
            this.updateForm.city = item
            this.cityOption.forEach(area => {
              if (area.id === item) {
                this.areaOption = area.children
              }
            })
            break
          case 2:
            this.updateForm.area = item
            break
        }
      })
    },
    // 获取城市
    selectCity (value) {
      this.cityOption = {}
      this.areaOption = {}
      this.updateForm.city = ''
      this.updateForm.area = ''
      this.proviceOption.forEach(item => {
        if (item.id === value) {
          this.cityOption = item.children
        }
      })
    },
    //  获取区
    selectArea (value) {
      this.areaOption = {}
      this.updateForm.area = ''
      this.cityOption.forEach(item => {
        if (item.id === value) {
          this.areaOption = item.children
        }
      })
    },
    // hidden 校验
    getAreaId (value) {
      this.updateForm.area_id = value
      this.$refs['updateForm'].validate((valid) => {
        if (valid) {
          console.log('submit!')
        } else {
          console.log('error submit!!')
          return false
        }
      })
    }
  }
}
</script>
<style scoped>
.el-form-item {
  text-align: left;
}
.select_label {
  display: inline-block;
}
.el-input {
  width: 200px;
}
.cancal-button {
  width: 100px;
}
.el-select{
  width: 200px;
}
</style>
