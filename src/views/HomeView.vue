<script>
import {reactive} from "vue";

export default {
  data() {
    return {
      //存储图书列表
      books: reactive([])
    }
  },
  methods: {
    async getAllBook()
    {
      const response = await this.$api.getBooks()
      this.books = response.data.data
      console.log(this.books)
    },
    async logout()
    {
      // 退出登录
      await this.$api.logout()
      // 重定向到首页
      this.$router.push('/')
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
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          :ellipsis="false"
          @select="handleSelect"
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
      <b>图书列表</b>
      <el-card>
        <el-table :data="books" style="width: 100%">
          <el-table-column label="图书编号" prop="id" />
          <el-table-column label="书名" prop="name" />
          <el-table-column />
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
          <el-table-column>
            <template #default="scope">
              <el-button size="small" > Edit </el-button>
              <el-button size="small" type="danger"> Delete</el-button>
            </template>
          </el-table-column>

        </el-table>
      </el-card>
    </el-main>
  </el-container>
</template>

<style scoped>

</style>