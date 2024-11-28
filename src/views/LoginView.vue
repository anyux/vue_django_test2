<script>
export default {
  data() {
    return {
      // 用户密码
      loginForm: {
        username: '',
        password: ''
      },
      // 用户表单规则
      loginRules: {
        username: [
          {
            // 表示必须项
            required: true,
            // 错误提示
            message: "用户名不能为空",
            // 触发方式,blur表示失去焦点触发
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "密码不能为空",
            trigger: "blur"
          }
        ]
      },
    }
  },
  methods: {
    // 登录方法
    // 异步方法,设置async
    async loginSubmit() {
      //  接收响应
      const response = await this.$api.login(this.loginForm)
      console.log(response)
      if (response.data.status === 200) {
        this.$message({
          type: 'success',
          message: response.data.msg
        })
        // 路由跳转
        this.$router.push('/home')
      }else{
        this.$message({
          type: 'warning',
          message: response.data.msg
        })
      }
    },
    // 表单预检查
    clickLogin() {
      // 获取表单对象,检查表单信息
      this.$refs['loginRef'].validate(res =>{
        if (res) {
          // 发送登录请求
          this.loginSubmit()
        }
      })
    },
  }
}

</script>

<template>
  <div class="box">
    <div class="title">
      登 录
    </div>
    <el-form :rules="loginRules" :model="loginForm" ref="loginRef">
      <el-form-item prop="username">
<!--        # 数据双向绑定username-->
        <el-input
            v-model="loginForm.username"
            prefix-icon="User"
            placeholder="请输入账号"
        />
      </el-form-item>
      <el-form-item prop="password">
<!--        # 数据双向绑定password-->
        <el-input
            v-model="loginForm.password"
            prefix-icon="Lock"
            placeholder="请输入密码"
        />
      </el-form-item>
      <el-form-item>
<!--        # 绑定登录方法通过表单预检查发送登录信息-->
        <el-button
            @click="clickLogin"
        >登录
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style scoped>
.box {
  width: 500px;
  height: 350px;
  /*
  让box上下左右垂直居中
   */
  margin: calc((100vh - 350px) / 2) auto;
  box-shadow: 0 0 5px #000;
  border-radius: 20px;
}

.title {
  color: #0af;
  height: 80px;
  font: bold 28px/80px "微软雅黑,sans-serif";
  text-align: center;
}

/*
设置表单输入框的按钮
 */
.el-form {
  margin: 20px;
}

/*
设置按钮宽度
 */
.box .el-button {
  width: 100%;
}
</style>