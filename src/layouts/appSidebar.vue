<template>
  <div class="appSideWrap">
    <div class="userInfo">
        <div style="position:relative;z-index:1">
      <img :src="avatar?avatar:photo" alt class="photo">
        <input type="file" ref="avatarInput" class="upload__input" @change="addImg">
        </div>
      <p class="userName">{{userInfo.name}}</p>
      <p class="userID">ID:{{userInfo.id}}</p>
    </div>
    <el-aside class="menu">
      <el-menu
        ref="sideBar"
        mode="vertical"
        :default-active="defaultActive"
        text-color="#FFFFFF"
        text-align="left"
        :router="true"
        unique-opened
      >
        <el-menu-item
          v-for="item in liveList"
          style="background-color:transparent;"
          @click.stop.native="go(item)"
          :key="item.path"
          :index="item.path"
        >
          <template slot="title">
            <i :class="item.icon"></i>
            <span>{{item.title}}{{item.hidden}}</span>
          </template>
        </el-menu-item>
      </el-menu>
      <!-- 侧栏下部纹理 -->
    </el-aside>
    <div class="contact">
      <p @click="gofeeback">联系客服</p>
    </div>
    <div class="btn_124 out_login" @click="logout">退出登录</div>
  </div>
</template>
<script>
import authUtils from "@/services/auth/utils";
import authApi from "@/services/auth";
import eventHub from "@/utils/eventHub";
import { IMS_URL, API_URL} from "@/config";
export default {
  data() {
    return {
      menuList: [],
      logoImg: require("../../static/img/logo-white.png"),
      photo: require("../../static/image/photo_t.png"),
      liveList: [
        {
          path: "/class",
          title: "班级管理",
          icon: "icon-cac-reception",
          child: [{ path: "/", title: "classroom" }]
        },
        {
          path: "/teacher",
          title: "教师档案",
          icon: "icon-cac-platform"
        },
        {
          path: "/buy",
          title: "课程盒子",
          icon: "icon-cac-magic"
        },
        {
          path: "/course",
          title: "课程订单",
          icon: "icon-cac-wisroom"
        },
        {
          path: "/report",
          title: "数据魔方",
          icon: "icon-cac-platform"
        }
      ],
      routes: ["/class", "/teacher", "/buy", "/course", "/classroom"],
      is_live: 1,
      temp: [],
      phoneBoxShow: false,
      userInfo: {},
      avatar:'',
    };
  },
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
    }
  },
  created() {
    this.getUser();
    //this.handleSelect(this.$route.path)
    eventHub.$on("updateUser", this.getUser);
  },
  methods: {
    phonBoxHandle() {
      this.phoneBoxShow = true;
    },
    getUser() {
      this.userInfo = authUtils.getUser();
      this.$store.state.userInfo = this.userInfo;
      if (this.userInfo.image) {
          this.avatar =  API_URL+this.userInfo.image;
      }
    },
    go(item) {},
    gofeeback() {
        this.$router.push('/feedback')
    },
    logout() {
      authApi.logout().then(res => {
        this.$router.push({
          name: "auth",
          query: {
            showLogin: true
          }
        });
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
.phone {
  margin-left: 1rem;
}
.appSideWrap {
  width: 3.62rem;
  height: 100%;
  background-image: url("../../static/image/contentLeftBg.png");
  background-size: 100%;
  position: relative;
  .userInfo {
    margin: 0.83rem 0 0 0.64rem;
    text-align: left;
    padding-left: 0.5rem;
    .photo {
      width: 0.68rem;
      height: 0.68rem;
      border-radius: 0.34rem;
    }
    .userName {
      padding-top: 0.11rem;
      font-size: 0.2rem;
      color: #ffffff;
    }
    .userID {
      font-size: 0.16rem;
      color: #ffffff;
      opacity: 0.8;
    }
  }
  .menu {
    margin: 0.4rem 0 0 0.53rem;
    padding-bottom: 0.16rem;
    background-color: transparent;
    .el-menu {
      width: 100%;
      border-right: none;
      height: 100%;
      background-color: transparent !important;
      box-shadow: none;
      .el-menu-item {
        height: 0.5rem;
        line-height: 0.5rem;
        font-size: 0.18rem;
        color: #ffffff;
        cursor: pointer;
        background-color: transparent !important;
        border-left: 2px solid transparent;
        padding-left: 0px;
        text-align: left;
      }
      .el-menu-item.is-active {
        border-left: 2px solid #fff;
        color: #fff !important;
        opacity: 1;
      }
      li {
        border-bottom: none;
      }
    }
  }
  .contact {
    margin: 0 0 0 0.53rem;
    border-top: 0.005rem solid #fff;
    width: 2.5rem;
    text-align: left;
    p {
      color: #fff;
      font-size: 0.18rem;
      padding-top: 0.14rem;
      cursor: pointer;
      padding-left: 20px;
    }
  }
  .out_login {
    position: absolute;
    border: 1px solid #fff;
    bottom: 0.42rem;
    left: 1.19rem;
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
    z-index:200;
  }
}
</style>
