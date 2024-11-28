//封装所有的后端接口请求
import axios from "axios";

// 1.全局配置
axios.defaults.baseURL = "http://127.0.0.1:8000";
// 允许axios跨域携带cookie
axios.defaults.withCredentials = true
// 2.封装接口请求

const api = {
    // 登录请求
    login(body){
        return axios.post("/user/login", body)
    },
    // 退出登录请求
    logout(){
        return axios.get("/user/logout")
    },
    // 获取图书
    getBooks(){
        return axios.get("/books")
    },
    // 新增图书
    addBook(body){
        return axios.post("/books", body)
    },
    // 删除图书
    deleteBook(bookid){
        return axios.delete("/books/",{
            params: {
                id: bookid
            }
        })
    },
    // 出借图书
    lendBook(body){
        return axios.post("/books/handler",body)
    },
    // 归还图书
    restoreBook(bookid,name){
        return axios.patch("/books/handler",{
            params: {
                id: bookid,
                name:name
            }
        })
    }

}

// 导出api
export default api