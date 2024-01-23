<template>
    <div class="container">
        <div class="body">
            <div class="cutline">图书馆预约抢座插件v1.4</div>
            <CustomInputVue v-model="newCookie" class="myinput" placeholder="Cookie" custom="outline"></CustomInputVue>
            <button class="button-31" role="button" @click="setCookie">设置Cookie</button>
            <el-cascader class="mycascader" popper-class="custom-popper" :options="libList" v-model="selectedOptions"
                @change="handleChange">
            </el-cascader>
            <CustomInputVue v-model="seatName" class="myinput" id="seatInput" placeholder="seatNumber" custom="outline">
            </CustomInputVue>
            <button class="button-31" role="button" @click="changeSeat">修改座位</button>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import CustomInputVue from "./CusInput"
export default {
    data: function () {
        return {
            DOMAIN: "https://test.api.roadrunner2002.top",
            newCookie: "",
            libList: [],
            libId: "",
            seatName: "",
            selectedOptions: [1, 2],
        }
    },
    components: {
        CustomInputVue
    },
    methods: {
        handleChange(value) {
            this.libId = value[0]
        },
        handLibList(libList) {
            const processedLibList = libList.map(item => {
                return {
                    label: `${item.lib_floor} ${item.lib_name}`,
                    value: item.lib_id
                };
            });
            return processedLibList
        },
        setCookie: async function () {
            if (this.newCookie) {
                try {
                    const res = await axios.post(`${this.DOMAIN}/lib/setCookie`, {
                        newCookie: this.newCookie
                    })
                    const { code, msg } = res.data
                    if (code === 0) {
                        alert("✅set Cookie Successfully!")
                    } else {
                        alert("❌Please refresh your Cookie")
                    }
                } catch (error) {
                    console.log("[1001]", error)
                }
            } else {
                alert("Cookicde为空")
            }

        },
        changeSeat: async function () {
            if (this.libId && this.seatName) {
                try {
                    const res = await axios.post(`${this.DOMAIN}/lib/changeSeat`, {
                        libId: this.libId,
                        seatName: this.seatName
                    })
                    const { code, data } = res.data
                    if (code === 0) {
                        const { libId, seatName, seatKey } = data
                        console.log(seatKey)
                        alert("✅change Seat Successfully!")
                        this.libId = libId;
                        this.seatName = seatName;
                        this.selectedOptions[0] = libId
                    } else {
                        alert("❌change Seat failed")
                    }
                } catch (error) {
                    console.log("[1002]", error)
                }
            } else {
                console.log("❗Please select an area and a seat First")
            }
        },
        getLibandSeatInfo: async function () {
            try {
                const res = await axios.get(`${this.DOMAIN}/lib/getLibList`)
                const { code, data } = res.data
                if (code === 0) {
                    const { libId, seatName, libList } = data
                    this.libId = libId
                    this.seatName = seatName
                    this.libList = this.handLibList(libList)
                    this.selectedOptions[0] = libId
                }
                else {
                    console.log("[1003]获取渲染信息失败")
                }
            } catch (error) {
                console.log("[1004]", error)
            }
        },

    },
    mounted: async function () {
        axios.get(`${this.DOMAIN}/test`).then((res) => {
            console.log("测试接口成功", res.data)
        }, (req) => {
            console.log("测试接口失败", req)
        })
        await this.getLibandSeatInfo();

    }
}
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 100%;

    .cutline {
        color: rgb(84, 92, 100);
        font-weight: bolder;
        margin: 20px;
        width: 300px;
        text-align: center;
    }

    .body {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
        background-color: whitesmoke;

        .myinput {
            width: 80%;
            margin-bottom: 30px;
        }

        .urlinput {
            width: 300px;
            margin-bottom: 10px;
        }

        .mycascader {
            margin-top: 20px;
            margin-bottom: 20px;
        }

        #seatInput {
            width: 220px;
        }
    }

    .footer {
        height: 100px;
        background-color: #e8e8e8;
        padding-top: 20px;

        .footerLine {
            width: 90%;
            background-color: lightgray;
            height: 5px;
            margin: 0 auto;
        }

        .footerInfo {
            display: flex;
            width: 90%;
            margin: 0 auto;
            justify-content: center;

            .Avatar {
                width: 50px;
                height: 50px;

            }

            .webInfo {
                font-family: Russo One, Arial, sans-serif;
                color: gray;
                height: 50px;
                line-height: 50px;
            }

        }

    }

    $scrollHeightMid: 350px;
    $scrollHeightMin: 250px;

    @media screen and (min-width:577px) and (max-width:768px) {
        .body {
            padding-left: 10px;
            padding-right: 10px;
        }

        .scroll {
            height: $scrollHeightMid;

            .scroll-left {
                display: none;
            }

            .el-carousel {
                height: $scrollHeightMid;
            }

            .el-carousel__item.is-active.is-animating {
                height: $scrollHeightMid;
            }

            .el-carousel__item.is-animating {
                height: $scrollHeightMid;
            }
        }

        .scrollBottom {
            background-color: rgb(84 92 100);
            display: block;
            font-size: 16px;
            font-weight: 600;
            font-family: Russo One, Arial, sans-serif;
            padding: 10px;
        }

        .wrapper {
            columns: 4;
            column-gap: 2px;
        }

    }

    @media screen and (max-width:576px) {

        .body {
            padding-left: 5px;
            padding-right: 5px;
        }

        .scroll {
            height: $scrollHeightMin;

            .scroll-left {
                display: none;
            }

            .el-carousel {
                height: $scrollHeightMin;
            }

            .el-carousel__item.is-active.is-animating {
                height: $scrollHeightMin;
            }

            .el-carousel__item.is-animating {
                height: $scrollHeightMin;
            }
        }

        .scrollBottom {
            background-color: rgb(84 92 100);
            display: block;
            font-size: 14px;
            font-weight: 600;
            font-family: Russo One, Arial, sans-serif;
            padding: 5px;
        }

        .wrapper {
            columns: 2;
            column-gap: 2px;
        }

    }
}

.button-31 {
    width: 250px;
    background-color: rgb(84 92 100);
    border-radius: 4px;
    border-style: none;
    box-sizing: border-box;
    color: rgb(255 208 75);
    cursor: pointer;
    display: inline-block;
    font-family: "Farfetch Basis", "Helvetica Neue", Arial, sans-serif;
    font-size: 16px;
    font-weight: 700;
    line-height: 1.5;
    margin: 0;
    max-width: none;
    min-height: 44px;
    min-width: 10px;
    outline: none;
    overflow: hidden;
    padding: 9px 20px 8px;
    position: relative;
    text-align: center;
    text-transform: none;
    user-select: none;
    -webkit-user-select: none;
    touch-action: manipulation;
}

.button-31:hover,
.button-31:focus {
    opacity: .75;
}
</style>

<style>
.custom-popper {

    .el-cascader-node.in-active-path,
    .el-cascader-node.is-active,
    .el-cascader-node.is-selectable.in-checked-path {
        color: #ffd04b;
    }
}

.el-input.el-input,
.el-input.el-input--suffix.is-focus,
.el-input.is-focus .el-input__inner {
    border-color: #ffd04b !important;
}
</style>