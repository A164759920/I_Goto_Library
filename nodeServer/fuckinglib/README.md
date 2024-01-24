# 🔨V1.4.5

**COMMING...**

- ⭐ 支持配置多座位(用栈实现...)
- 添加 serverless 部署前端的 yml
- 通过部署到个人公众号来解决 Oauth 的问题？

# 🔨v1.4.4 补丁

- 服务器新增保存数据功能，存放于**data.json**中
  - saveLibData/saveLibDataAsync 函数实现，可供手动调用或在服务器重启时自动保存

# 🔨v1.4.3 补丁

- **ws**在某些情况下会出现**获取用户信息失败**的问题，解决该问题补丁如下 **【已测试通过】**：
  - **Event**添加**fail**事件
    - 当**cookie**无效时自动关闭
  - **Event**添加**resetWs**事件
    - 当**ws**出现**获取用户信息失败**时自动重连，
      - 此时**code**:1000,**data**:undefined

# 🔨v1.4.2 补丁

- 现在所有请求必须加上**App-Version**请求头标明版本号，若缺失该项则无法返回**userAuth**
  - **2023/8/24**测试时，该请求头的数值并不校验版本号的**合法性**，只校验**存在性**，当前版本号为**2.0.14**

# 🔨v1.4.1 补丁

- 支持异步获取**所有场馆列表**
  - **_asyncgetLibListController_** **异步获取，调真实接口获取列表，每次需要活 cookie**
  - **_syncgetLibListController_** **同步获取，手动抓取一次，后端写死，之后免 cookie**

# 🔨v1.4 新功能

- 新增在线换座位接口

# 🔨v1.3

- 更新坐标信息
- ⭕⭕⭕ 弃用**node-cron**造成的**内存泄露**,换用**croner**
  **DEBUG 记录**:https://blog.csdn.net/SCY164759920/article/details/131459026?spm=1001.2014.3001.5501

# 🔨v1.2

- 修复了 cookie 无法刷新的 bug
- 修复了 success 事件的 bug

# fuckingLib V1.1

- 反防刷更新
- 接口坐标添加小数点
