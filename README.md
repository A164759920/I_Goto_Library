# 我去图书馆 自动化辅助预约

# ❗❗❗ 声明

- 1.本人无意侵犯任何组织或个人的权益, 并非针对"我去图书馆"系统和其公司，**仅作学习交流**
- 2.本项目**完全免费，且不接收任何形式的资助**，若在使用过程中发现程序中存在的任何问题，欢迎提**issue**
- 3.此项目遵循 MIT 开源许可证，您可以随意修改源代码、版权并自主选择是否闭源，但衷心建议不要二次修改此项目用来收费盈利，由此造成的后果由修改者个人自己承担。

# 1.🔉 说明:

## 1.1 功能:

- 实现 **我去图书馆公众号** **定时**自动预约**第二天指定座位**功能
  (从 2023 年 3 月维护至此仓库创建时，此项目已根据公众号更新的各种机制：**websocket 排队/SERVERID 校验/防刷判定/版本号判定**等更新了相对应的补丁， 所有功能目前均能正常使用)

  补丁日志: https://github.com/A164759920/I_Goto_Library/blob/main/nodeServer/fuckinglib

## 1.2 使用方法:

- **step1:** **_抓包获取 Cookie_**
  在开启明日预约前的一小时内，通过抓包软件(如 httpCanary)抓取 Cookie
  https://github.com/A164759920/I_Goto_Library/blob/main/images/getCookie.png

- **step2:** **_设置 Cookie_**

  - **_1.通过仓库配套的前端页面设置(推荐)⭐⭐⭐:_**
    https://github.com/A164759920/I_Goto_Library/blob/main/images/setCookie.png

  - **_2.手动调用后端接口设置_**
    参考的接口文档中的 **/lib/setCookie** 接口

- (**step3:**) **_获取可选场馆列表_**（首次使用时执行一次即可）**_【需要 Cookie 有效】_**
  操作后服务器会自动抓取你所在学校图书馆可供预约的所有场馆信息，并存入服务器中

  - **_1.通过配套前端页面设置(推荐)⭐⭐⭐:_**
    https://github.com/A164759920/I_Goto_Library/blob/main/images/refreshButton.png

  - **_2.手动调用后端接口设置_**
    参考的接口文档中的 **/lib/getLibList2** 接口

- (**step4:**) **_选择场馆 + 设置座位号_** **_【需要 Cookie 有效】_**
  设置过一次后，**服务器将记住你此时的选择**，下次再进入页面时，若不换座位，则此步骤**无需再执行**

  - **_1.通过配套前端页面设置(推荐)⭐⭐⭐:_**
    设置时输入座位上的座位编号即可再点击 **"修改座位"** 即可，若选择场馆存在该座位号，则服务器将自动匹配座位的**key**并设置,节省大家手动匹配的繁琐过程
    https://github.com/A164759920/I_Goto_Library/blob/main/images/changeSeat.png

  - **_2.手动调用后端接口设置_**
    参考的接口文档中的 **/lib/changeSeat** 接口

## 1.2 所用技术:

查看 **GITHUB** 上相关项目 ISSUE 区后发现，此类项目大多存在许多使用者部署项目困难的问题，因此本项目提供了多种部署方式，最终可实现在手机上完成所有操作，且编写了较为详细的部署步骤，希望能帮助到大家

### 1.2.1 关于 Cookie

由于新版我去图书馆采用的 **_Cookie_** 有时限，仍需要借助 **_抓包工具_** 抓取 token，其余部分均已实现了自动化

    推荐手机端使用httpCanary,较为方便

### 1.2.2 关于技术栈

**该项目基于 node.js + Vue2.js 并提供以下功能方便操作：**</br>

- 自动生成的**服务器接口文档**: https://a164759920.github.io/I_Goto_Library/
- 配套前端页面(已适配手机/电脑)，简化操作
- **docker-compose** 一键 调试 + 部署
- **nginx** 的 **_conf_** 文件配置示例

# 2.环境配置

- node 建议 v14.0.0+ 及以上版本
- npm
- docker **(选装,本地运行可忽略)**
- docker-compose v2.18.1 **(选装,本地运行可忽略)**

# 3 项目部署

## 3.1 node 服务器部署

⭕ **(该方式部署的 vue 为 dev 版)**

API 文档:https://a164759920.github.io/I_Goto_Library/

### 3.1.1 手动部署

- **a.依赖安装**

```
    cd ./nodeServer
    npm install
```

- **b.启动服务器** (提供**三种**可选方式)

  - 直接启动

  ```
    node index.js
  ```

  - 使用 **nodemon** 热更新启动

  ```
    npm install nodemon -g
    npm run dev
  ```

  - ⚡ 使用 **pm2** 部署启动(上云服务器时，推荐该种方法)

  ```
    npm install pm2 -g
    npm run build
  ```

### 3.1.2 docker 部署(Linux 为例)

⭕ 确保已安装**docker** + **docker-compose**

- **a.配置 docker 网络**
  如果只需部署**node 服务器**，请将**docker-compose.yml**文件中的**vue**部分注释

```
    docker network create --driver bridge --subnet 172.22.9.0/24 --gateway 172.22.9.1 mynet
```

- **b.一键部署**

```
    docker-compose up -d
```

## 3.2 vue 前端页面部署

### 3.2.1 手动 dev 版前端部署

- **a.依赖安装**

```
    cd ./vue
    npm install vue2 @vue/cli -g
    npm install
```

- **b.启动 vue 开发服务器**

```
    npm run serve
```

- **c.浏览器访问**

```
    http://IPV4地址:端口号(VUE_PORT)
    eg：
    http://127.0.0.1:8080
```

### 3.2.2 docker dev 版前端部署

⭕ 确保已安装**docker** + **docker-compose**

- **a.配置 docker 网络**
  如果只需部署**vue dev 版前端**，请将**docker-compose.yml**文件中的**node**部分注释

```
    docker network create --driver bridge --subnet 172.22.9.0/24 --gateway 172.22.9.1 mynet
```

- **b.一键部署**

```
    docker-compose up -d
```

## 3.2.3 手动 上云 prod 版部署

- **a.修改配置文件**
  修改**vue/package.json** 的如下代码，使用自己服务器的**用户名 + IP 地址**替换原 scp 命令的参数</br>
  eg: dragon@192.168.1.22 (表示 用户名 dragon IP 地址:192.168.1.22)

```
 "push": "npm run build && scp -r dist/* dragon@192.168.1.22:/home/dragon/dist"
```

- **b.安装 + 配置 nginx** ⭐

  参考:**https://github.com/A164759920/I_Goto_Library/blob/main/nginx**

- **c.打包部署**

```
cd ./vue
npm run push
```

## 3.3 参数说明

### 3.3.1 node 服务器配置参数

详见:https://github.com/A164759920/I_Goto_Library/blob/main/nodeServer

### 3.3.2 vue 配置参数

将 **/vue/src/components/HelloWorld.vue** 的 **data** 中的 **DOMAIN** 配置为自己服务器的域名

```
  data: function () {
      return {
          DOMAIN: "https://test.api.baidu.top",
          newCookie: "",
          ....
  },
```

### 3.3.3 docker 配置参数

**.env**文件中即为 **docker-compose** 所需参数：

- **NODE_PORT** = "8899" # 服务器的端口号
- **VUE_PORT** = "8080" # dev 开发环境下 vue 的端口号
- **IS_HTTPS** = "off" # "on" 开启 HTTPS / "off" 关闭 HTTPS
  - **开启 HTTPS 后**，SSL 证书的配置参考**nodeServer**和**vue**文件夹下的说明

# 4.补充说明

## 4.1 关于是否能抢到预约座位?

作者在部署和维护运行项目的七八个月内，基本都能准时抢到座位，但是**遇到特别热门的座位**，实际测试情况下手动抢可能更快(当然你也可以手动调快程序的速度再试一试)，本项目更多只作为辅助.

## 4.2 关于部署的问题？

如果自己并没有已备案的域名或云服务器来部署配套前端页面和 Node 服务器，可以试一试使用**腾讯云**的**serverless**,通过配置 yml 文件一键部署，可省去域名备案和繁琐的配置，直接部署可公网访问的网站，有需求的可与我取得联系

**若在部署过程中遇到其他任何问题，欢迎与我取得联系.**
