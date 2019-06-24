<template>
  <div class="appSideWrap">
    <div class="content_left">
      <img class="person" :src="person">
      <div class="teacher_box">
        <img :src="avatar?avatar:logoImg" alt class="photo">
         <input type="file" ref="avatarInput" class="upload__input" @change="addImg">
        <p class="name">{{tInfo.name}}</p>
        <p class="id">ID:{{tInfo.id}}</p>
        <span class="grade">Level{{tInfo.level}}</span>
        <div class="statistics">
            <div class="item">
              <p class="num">{{tInfo.totalStu}}</p>
              <p class="txt">培训学生总数</p>
            </div>
            <div class="item">
              <p class="num">{{tInfo.totalCourse}}</p>
              <p class="txt">培训课程总数</p>
            </div>
            <div class="item">
              <p class="num">{{tInfo.totalDay}}</p>
              <p class="txt">上课总天数</p>
            </div>
          </div>
       <div class="lesson_lock">
            <div :class="item.class" class="lock_row" :key="i" v-for="(item,i) in levelsData">
              <div class="name">{{item.tit}}</div>
              <div class="lock_level">
                <div class="lock_item" :class="l.activeClass" :key="t" v-for="(l,t) in item.list">
                  <img :src="item.icon" v-if="tInfo.level < l.level" class="lock">
                  <p>Leverl {{l.level}}</p>
                  <p>{{l.name}}</p>
                </div>
              </div>
            </div>
          </div>
      </div>
      <div class="btn_124 out_login" @click="logout">退出登录</div>
    </div>
  </div>
</template>
<script>
import authUtils from "@/services/auth/utils";
import authApi from "@/services/auth";
import teacherApi from "@/services/teacher";
import eventHub from "@/utils/eventHub";
import { getObjectURL, deleteArray, RndNumber } from '@/utils'
import { readFileAsBase64 } from '@/utils/file'
export default {
  data() {
    return {
      menuList: [],
      logoImg: require("../../static/image/person_background.png"),
      person: require('../../static/image/person_photo1.png'),
      levelsData: [
        {
          tit: "SCRATCH",
          icon: require("../../static/image/lock_yellow.png"),
          class:'lock_row_y',
          list: [
            {
              level: 1,
              name: "初级编程",
              activeClass:'unlock_y',
            },
            {
              level: 2,
              name: "初级编程",
              activeClass:'unlock_y',
            }
          ]
        },
        {
          tit: "PYTHON",
           icon: require("../../static/image/lock_blue.png"),
           class:'lock_row_b',
          list: [
            {
              activeClass:'unlock_blue',
              level: 3,
              name: "初级编程"
            },
            {
              activeClass:'unlock_blue',
              level: 4,
              name: "初级编程"
            },
            {
              level: 5,
              name: "初级编程"
            }
          ]
        },
        {
          tit: "NOIP",
          icon: require("../../static/image/lock_red.png"),
          class:'lock_row_r',

          list: [
            {
                activeClass:'unlock_red',
              level: 6,
              name: "初级编程"
            },
            {
                activeClass:'unlock_red',
              level: 7,
              name: "初级编程"
            },
            {
                activeClass:'unlock_red',
              level: 8,
              name: "初级编程"
            }
          ]
        },
        {
          tit: "AI",
          icon: require("../../static/image/lock_purple.png"),
          class:'lock_row_p',

          list: [
            {
                activeClass:'unlock_purple',
              level: 9,
              name: "初级编程"
            },
            {
                activeClass:'unlock_purple',
              level: 10,
              name: "初级编程"
            },
            {
                activeClass:'unlock_purple',
              level: 11,
              name: "初级编程"
            },
            {
                activeClass:'unlock_purple',
              level: 12,
              name: "初级编程"
            }
          ]
        }
      ],
      temp: [],
      userInfo:{},
      tInfo:{},
      imgUrls:[],
      avatar:this.userInfo.image,
    };
  },
   // props: ['images', 'type', 'store', 'placeholder', 'role'],
  props: {
    images: { required: false },
    type: { required: false },
    store: { required: false },
    placeholder: { required: false },
    role: { required: false },
    size: { type: Number, default: 2 }
  },
  computed: {
    defaultActive() {
      let index = this.routes.indexOf("/" + this.$route.path.split("/")[1]);
      if (index !== -1) {
        return this.routes[index];
      }
      return "";
    },
    hasFaceTeaching() {
      let num = 0;
      this.faceTeachingBrand.map(v => {
        if (authUtils.getUser().brands.indexOf(v) >= 0) {
          num++;
        }
      });
      if (num === 0) {
        return false;
      }
      return true;
    }
  },
  created() {
    this.temp = this.menuList;
    this.getUser()
    eventHub.$on("updateUser", this.getUser);
  },
  methods: {
    getUser() {
      console.log(authUtils.getUser());
      this.userInfo = authUtils.getUser();
      if (this.userInfo.id) {
          this.queryTeacherInfo(this.userInfo.id);
      } else {
          this.$message({
              message:'教师id不存在，请确认用户身份',
              type:'error'
          })
      }
    },
    go(item) {},
    logout() {
        authApi.logout().then(res=>{
            this.$router.push({
                name:'auth',
                query:{
                    showLogin:true
                }
            })
        });
    },
     queryTeacherInfo(id) {
      var p = {};
      p.teacherId = id || "1";
      teacherApi.queryTeacherInfo(p).then(res => {
        if (res.code === "001") {
          this.tInfo = res.data;
          if (this.tInfo.level) {
              this.levelsData.forEach((item,i)=>{
                  item.list.forEach((it,t)=>{
                      if (this.tInfo.level < it.level) {
                          this.levelsData[i].list[t].activeClass = '';
                      }
                  })
              })
          }
        }
      });
    },
     // 上传图像的格式
    beforeImgUpload (file) {
      const isIMG = file.type === 'image/jpeg' || file.type === 'image/png'
      // const isLt2M = file.size / 1024 / 1024 < 2
      const isLt2M = file.size / 1024 / 1024 < this.size
      if (!isIMG) {
        this.$message({
          type: 'warning',
          message: '上传图片必须是 JPG/PNG 格式',
          center: true
        })
      }
      if (!isLt2M) {
        this.$message({
          type: 'warning',
          // message: '上传图片大小不能超过 2MB',
          message: `上传图片大小不能超过 ${this.size}MB`,
          center: true
        })
      }
      return isIMG && isLt2M
    },
    // 上传图片到服务器
    addImg (e) {
      this.file = e.target.files[0]
      if (this.beforeImgUpload(this.file)) {
        this.visible = false
        // let loadingInstance = this.$loading({
        //   text: '上传图片中...'
        // })
        if(this.file) {
            let reader = new FileReader()
            let that = this
            reader.readAsDataURL(this.file)
            reader.onload= function(e){
                // 这里的this 指向reader
                that.avatar = this.result
            }
        }

         let files = this.$refs.avatarInput.files
          let fileData = {}
          if(files instanceof Array) {
            fileData = files[0]
          } else {
            fileData = this.file
          }
          let data = new FormData()
          data.append('multfile', fileData)
          data.append('operaType', this.uploadType)
          data.append('userId', this.userInfo.id)

        // let params = new FormData();
        //         params.append('file',this.file,this.file.name); //append 向form表单添加数据


            authApi.uploadAvatar(data).then(res=>{
                console.log(res);
                if (res.code === '001' && res.data) {
                    let { id, name, user_type, username, class_id,image,school_id } = res.data
                    authUtils.setUser({
                    id,
                    name,
                    user_type,
                    username,
                    class_id,
                    image,
                    school_id
                    })
                }
            })
      }
    },
  }
};
</script>

<style lang="less" scoped>
.appSideWrap {
    width:4.5rem;
    height: 100%;
    background: url("../../static/image/personalcenter_bg.png");
    background-size: 100%;
    position: relative;
    .content_left{
        .person {
            position: absolute;
            top: 0.1rem;
            left: 0.1rem;
            width: 1rem;
        }
        .teacher_box {
            .name {
                color:#fff
            }
            .id {
                color:#fff
            }
            .lesson_lock {
                margin-top:0.3rem;
            }
        }
        .out_login{
            position: absolute;
            border:1px solid #fff;
            bottom: 0.42rem;
            left:1.19rem;
        }
    }
  .images {
    height: 140px;
  }
  .images__item__wrap {
    border: 1px dashed #c0ccda;
    background-color: #fbfdff;
    border-radius: 5px;
    width: 140px;
    height: 140px;
    position: relative;
    float: left;
    margin-right: 10px;
    input {
      width: 100%;
      height: 100% !important;
    }
    .upload__wrap {
      color: #ABB9C6;
      position: absolute;
      left: 50%;
      top: 50%;
      text-align: center;
      transform: translateX(-50%) translateY(-50%);
      -ms-transform: translateX(-50%) translateY(-50%);
      -moz-transform: translateX(-50%) translateY(-50%);
      -webkit-transform: translateX(-50%) translateY(-50%);
      -o-transform: translateX(-50%) translateY(-50%);
      i {
        display: block;
        font-size: 30px;
      }
      span {
        font-size: 12px;
      }
    }
  }
  .images__item__wrap.img:hover {
    background-color: #000;
  }
  .images__item__wrap.upload:hover {
    border: 1px dashed rgba(32, 117, 255, 0.815);
  }
  .images__item {
    width: 100%;
    height: 100%;
  }
  .images__item__edit {
    text-align: center;
    position: absolute;
    width: 100%;
    height: 100%;
    font-size: 24px;
    color: rgba(32, 117, 255, 0.815);
    background-color: rgba(0, 0, 0, 0.7);
    padding-top: 40px;
  }
  .images__item__edit i {
    cursor: pointer;
  }
  .upload__input {
    opacity: 0;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    cursor: pointer;
  }
}
</style>