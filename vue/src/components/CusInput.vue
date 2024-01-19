<template>
    <div class="rr-input" :style="{ '--borderColor': borderColorVar }" :class="[
        {
            'rr-input-prefix': prefixIcon,
            'rr-input--suffix': suffixIcon || clearable
        }
    ]">
        <!-- 前置元素 -->
        <div class="rr-input__prepend" v-if="$slots.prepend">
            <slot name="prepend"></slot>
        </div>

        <!-- 前缀元素 -->
        <div class="rr-input__prefix" v-if="prefixIcon">
            <i class="rr-input__icon" :class="prefixIcon">
            </i>
        </div>


        <input v-on="inputListeners" class="rr-input-control" :value="value" :type="`${type}`" :key="dataId"
            :style="{ '--placeholderShown': placeholderShownVar }" :placeholder="`${placeholder}`" />
        <label :class=showLabel>{{ placeholder }}</label>


        <!-- 后缀元素 -->
        <div class="rr-input__suffix" v-if="getSuffixVisible">
            <i class="el-input__icon" v-if="!showClear" :class="suffixIcon">
            </i>
            <i v-if="showClear" class="el-input__icon el-icon-circle-close el-input__clear" @mousedown.prevent
                @click="clear"></i>
        </div>


    </div>
</template>
<script>

export default {
    name: 'CustomInputVue',
    props: {
        value: String,
        placeholder: String,
        prefixIcon: String,
        suffixIcon: String,
        type: {
            type: String,
            default: "text"
        },
        size: {
            type: String,
            default: "small"
        },
        custom: {
            type: String,
            default: "normal"
        },
        clearable: {
            type: Boolean,
            default: false
        }
    },
    data: function () {
        return {
            dataId: Date.now(),  //防止重新渲染
            focused: false,
            hovering: false,
            borderColorVar: "#d0d0d5", //最外边框颜色
            placeholderShownVar: ""// 空字符显示,transparent不显示
        }
    },
    methods: {
        clear: function () {
            this.$emit('input', '')  //关键事件,向父级报告为空
            this.$emit('change', '')
            this.$emit('clear')
        },
    },
    computed: {
        // 绑定监听事件
        inputListeners: function () {
            const that = this
            // console.log(that.$listeners)
            return Object.assign({},
                this.$listeners,
                {
                    input: function (event) {

                        that.$emit('input', event.target.value)
                    },
                    // 聚焦事件
                    focus: function (event) {
                        if (that.custom === 'outline') {
                            that.borderColorVar = "#ffd04b"
                        }
                        that.focused = true
                        that.$emit('focus', event)
                    },
                    // 失焦事件
                    blur: function (event) {
                        that.borderColorVar = "#d0d0d5"
                        if (that.value !== "") {
                            that.focused = true
                        } else {
                            that.focused = false
                        }
                        that.$emit('blur', event)
                    }
                }
            )
        },
        // 是否显示label
        showLabel() {
            //带前缀和不带前缀使用不同的css

            if (this.custom === 'outline') {
                //改变placeholder的显示方式为隐藏
                this.placeholderShownVar = 'transparent'
                if (this.prefixIcon) {
                    return `input-label-prefix`
                }
                else {
                    return `input-label`
                }
            } else {
                this.placeholderShownVar = ''
                return `input-label-off`
            }
        },
        //标识是否显示清除icon
        showClear() {
            return this.clearable && this.focused
        },
        //是否显示后缀
        getSuffixVisible() {
            return this.suffixIcon || this.clearable
        },
    },
    mounted() {
        // console.log(this.$slots.append)
    }
}

</script>

<style scoped>
/**
搜索框内前缀图标 
*/
.rr-input__prefix {
    text-align: center;
    margin-left: 5px;
    width: 25px;
    height: 100%;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

/**
搜索框内后缀图标
*/
.rr-input__suffix {
    text-align: center;
    margin-right: 5px;
    width: 25px;
    display: flex;
    justify-content: center;
    flex-direction: column;
}

/**
搜索框外前置按钮/图标
*/
.rr-input__prepend {
    width: 70px;
    background-color: #a2a9b6;
    border-right: #d0d0d5 solid 1px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
}

/**
搜索框外后置按钮/图标
*/
.rr-input__append {
    width: 70px;
    background-color: #a2a9b6;
    border-right: #d0d0d5 solid 1px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 4px;
}

/**
基础样式的input框
*/
.rr-input {
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    position: relative;
    border: 1px solid var(--borderColor);
    border-radius: 4px;
    transition: border-color .25s;
    height: 40px;
    display: flex;
    margin-left: 5px;
}

/**
outline样式的input框
*/
.rr-input-outline {
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    position: relative;
    border: 1px solid #d0d0d5;
    border-radius: 4px;
    transition: border-color .25s;
    height: 40px;
    display: flex;
}

/*  - 删除原生input样式 
        - 边框/聚焦效果等
    - 设置光标起始距离
*/
.rr-input-control {
    /* border: 0; */
    border: none;
    outline: none;
    background: none;
    padding-left: 5px;
    flex-grow: 1;
}


/**将原placeholder置为透明隐藏 */
.rr-input-control:placeholder-shown::placeholder {
    color: var(--placeholderShown);
}



/**
带prefix的outline类型label
*/
.input-label-prefix {
    position: absolute;
    font-size: 14px;
    line-height: 1.5;
    top: 10px;
    left: 33px;
    color: #a2a9b6;
    padding: 0 2px;
    transform-origin: 0 0;
    pointer-events: none;
    transition: all .25s;
}

.rr-input-control:not(:placeholder-shown)~.input-label-prefix,
.rr-input-control:focus~.input-label-prefix {
    color: #ffd04b;
    transform: scale(0.75) translate(-10px, -25px);
}

/**不带prefix的outline类型label */
.input-label {
    position: absolute;
    font-size: 14px;
    line-height: 1.5;
    top: 10px;
    left: 5px;
    color: #a2a9b6;
    padding: 0 2px;
    transform-origin: 0 0;
    pointer-events: none;
    transition: all .25s;
}

.rr-input-control:not(:placeholder-shown)~.input-label,
.rr-input-control:focus~.input-label {
    color: #ffd04b;
    transform: scale(0.75) translate(1px, -25px);
}

/**
normal类型的输入框 隐藏label
*/
.input-label-off {
    display: none;
}

/**
    用白背景挡住部分border
*/
.rr-input-control~.input-label-prefix,
.rr-input-control~.input-label {
    background-color: whitesmoke;
}
</style>