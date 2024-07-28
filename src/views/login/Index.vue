<template>
    <div class="container">
        <div class="form-container">
            <div class="form">
                <div class="title">
                    {{ Setting.title }}
                </div>
                <div class="tip">
                    Hi, Welcome Back!
                </div>
                <div class="content">
                    <FloatLabel>
                        <InputText id="username" v-model="user.userName" />
                        <label for="username">用户名</label>
                    </FloatLabel>
                    <FloatLabel>
                        <Password v-model="user.password" toggleMask inputId="password" />
                        <label for="password">密码</label>
                    </FloatLabel>
                    <div class="forget">
                        <div style="display: flex;align-items: center;">
                            <Checkbox v-model="checked" :binary="true" />
                            <Button label="记住密码" text />
                        </div>
                        <Button label="忘记密码" text />
                    </div>
                    <Button class="input" label="立即登录" severity="success" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Setting from "@/setting";

const checked = ref(false);
const user = ref({
    userName: '',
    password: ''
});
onMounted(() => { })

</script>
<style scoped lang='scss'>
.container {
    height: 100vh;
    width: 100%;
    background: url('https://pic.imgdb.cn/item/66a641b4d9c307b7e9ea1765.png');
    background-size: cover;

    .form-container {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        padding-left: 35px;

        .form {
            width: 320px;
            height: 500px;
            padding: 20px;

            .title {
                font-size: 30px;
                font-weight: bold;
                text-align: center;
            }

            .tip {
                font-size: 15px;
                color: #666;
                text-align: center;
                margin: 35px;
            }

            .content {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 40px;
            }

            .input {
                width: 320px;
                height: 45px;
            }

            .content .forget {
                display: flex;
                justify-content: space-between;
                width: 320px;
            }
        }
    }
}

:deep(.p-inputtext) {
    width: 320px;
    height: 45px;
    padding: 10px;
}
</style>