<script>
import {reactive} from "vue";

import { ElMessage,ElMessageBox } from 'element-plus'


export default {
  data() {
    return {
      //存储图书列表
      books: reactive([]),
      // 是否显示添加图书窗口
      dlgAddIsShow: false,
      // 是否显示借阅图书窗口
      dlgBorrowIsShow: false,
      // 是否显示归还图书窗口
      dlgRestoreIsShow: false,
      // 添加图书书籍
      addData: {
        id: "",
        name: "",
      },
      // 借阅图书书籍
      borrowData: {
        id: "",
        name: "",
      },
      // 归还图书书籍
      restoreData: {
        id: "",
        name: "",
      },
    }
  },
  methods: {
    // 异步获取图书
    async getAllBook()
    {
      const response = await this.$api.getBooks()
      this.books = response.data.data
    },
    async logout()
    {
      // 异步退出登录
      const response = await this.$api.logout()
      console.log(response.data);
      if (response.data.status === 200){
        ElMessage({
          type: 'success',
          message: response.data.msg,
        })
        // 重定向到首页
        this.$router.push('/')
      }else{
        ElMessage({
          type: 'error',
          message: "error",
        })
      }
    },
    // 异步删除图书方法,调用后端接口
    async delBook(bookid){
      const response = await this.$api.deleteBook(bookid)
      if (response.data.code === 1000){
        ElMessage({
          type: 'success',
          message: "删除成功"
        })
      //   更新前端数据
        this.getAllBook()
      }else{
        // 删除失败的提示
        ElMessage({
          type: 'error',
          message: response.data.message
        })
      }
    },
    // 点击删除图书
    clickDel(bookid){
    //   确认提示
      ElMessageBox.confirm(
          // 提示内容
          '是否删除,请确认',
          '提示',
          {
            confirmButtonText: '确认',
            cancelButtonText: '取消',
            type: 'warning',
          }
      )
          .then(() => {
            // 确认删除执行
            // 调用删除方法
            this.delBook(bookid)
          })
          .catch(() => {
            // 取消删除执行
            ElMessage({
              type: 'info',
              message: '已取消删除操作',
            })
          })
    },
    // 异步新增图书
    async saveAddData(){
      const response = await this.$api.addBook(this.addData)
      if (response.data.code === 1000){
        ElMessage({
          type: 'success',
          message: response.data.message
        })
        // 对话框隐藏
        this.dlgAddIsShow = false
        // 清空数据
        this.addData={}
        // 重新加载数据
        await this.getAllBook()
      }else{
        ElMessage({
          type: 'error',
          message: response.data.message
        })
      }
    },
    // 点击借阅图书
    clickBorrow(body){
      this.dlgBorrowIsShow = true
      this.borrowData = body
    },
    // 异步借阅图书
    async borrowBook(){
      // 获取借阅图书信息
      const body = {}
      body.book=this.borrowData.id
      body.name=this.borrowData.name
      // 调用后端借阅图书
      const response = await this.$api.lendBook(body)
      if (response.data.code === 1000){
        ElMessage({
          type: 'success',
          message: response.data.message
        })
        // 关闭对话框
        this.dlgBorrowIsShow = false
        // 将借阅较图书信息设置为空
        this.borrowData = {}
        // 重新拉取图书列表
        this.getAllBook()
      }else {
        ElMessage({
          type: 'error',
          message: response.data.message
        })
      }
    },
    // 点击归还图书
    clickRestore(body){
      this.dlgRestoreIsShow = true
      this.restoreData = body
    },
    // 异步归还图书
    async restoreBook(){
      const body = {}

      body.book=this.restoreData.id
      body.name="admin"
      const response = await this.$api.restoreBook(body)
      if (response.data.code === 1000){
        ElMessage({
          type: 'success',
          message: response.data.message
        })
        // 关闭归还图书对话框
        this.dlgRestoreIsShow = false
        // 设置归还数据为空
        this.restoreData = {}
        // 重新刷新页面
        await this.getAllBook()
      }else {
        ElMessage({
          type: 'error',
          message: response.data.message
        })
      }

    },
  },
  created(){
    // 调用后端接口获取信息
    setTimeout(()=>{
      this.getAllBook()
    },800)
  }
}

</script>

<template>
  <el-container>
    <!--
    顶部菜单
    -->
    <el-header style="padding: 0">
      <el-menu
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false"
      >
        <el-menu-item index="0">
        </el-menu-item>
        <el-menu-item index="1">管理</el-menu-item>
        <el-sub-menu index="2">
          <template #title> Admin</template>
          <el-menu-item index="2-1" href="/user/logout" @click="logout">退出登录</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-header>
    <!--
    主体内容
    -->
    <el-main>
      <el-button
      type="primary"
      icon="plus"
      size="default"
      @click="dlgAddIsShow = true"
      plain
      >
      添加图书
      </el-button>
      <el-card>
        <el-table :data="books" style="width: 100%">
          <el-table-column label="图书编号" prop="id" />
          <el-table-column label="书名" prop="name" />
          <el-table-column />
          <!--    针对已借出未借出进行格式化显示      -->
          <el-table-column label="是否借出">
            <template #default="scope">
              <el-tag v-if="scope.row.status">
                已借出
              </el-tag>
              <el-tag v-else type="success">
                未借出
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="scope">
              <el-button size="small" type="primary" @click="clickBorrow(scope.row)"> 出借 </el-button>
              <el-button size="small" type="primary" @click="clickRestore(scope.row)"> 归还 </el-button>
              <el-button @click="clickDel(scope.row.id)" icon="Delete" size="small" type="danger"> Delete</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-card>
    </el-main>
  </el-container>

  <!-- 点击增加显示的对话框 -->
  <el-dialog v-model="dlgAddIsShow" title="添加图书" >
    <el-form :model="addData" >
      <el-form-item label="书籍编号" >
        <el-input v-model="addData.id" autocomplete="off" />
      </el-form-item>
      <el-form-item label="书籍名称" >
        <el-input v-model="addData.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dlgAddIsShow = false">取消</el-button>
        <el-button type="primary" @click="saveAddData">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 点击借阅显示的对话框 -->
  <el-dialog v-model="dlgBorrowIsShow" title="借阅图书" >
    <el-form :model="borrowData" >
      <el-form-item label="书籍编号" >
        <el-input v-model="borrowData.id" autocomplete="off" />
      </el-form-item>
      <el-form-item label="书籍名称" >
        <el-input v-model="borrowData.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dlgBorrowIsShow = false">取消</el-button>
        <el-button type="primary" @click="borrowBook">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
  <!-- 点击归还图书显示的对话框 -->
  <el-dialog v-model="dlgRestoreIsShow" title="归还图书" >
    <el-form :model="restoreData" >
      <el-form-item label="书籍编号" >
        <el-input v-model="restoreData.id" autocomplete="off" />
      </el-form-item>
      <el-form-item label="书籍名称" >
        <el-input v-model="restoreData.name" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="dlgRestoreIsShow = false">取消</el-button>
        <el-button type="primary" @click="restoreBook">
          确认
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<style scoped>

</style>