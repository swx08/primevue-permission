<template>
    <div class="container" :style="{ backgroundImage: Setting.loginBgColor }">
        <div class="left">
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
                            <InputText id="username" v-model="user.username" />
                            <label for="username">用户名</label>
                        </FloatLabel>
                        <FloatLabel>
                            <Password @keyup.enter="handlerDoLogin" promptLabel="密码强度" weakLabel="轻" mediumLabel="中"
                                strongLabel="强" v-model="user.password" toggleMask inputId="password" />
                            <label for="password">密码</label>
                        </FloatLabel>
                        <div class="forget">
                            <div style="display: flex;align-items: center;">
                                <Checkbox v-model="user.checked" :binary="true" />
                                <span style="cursor: pointer;margin-left: 8px;">记住密码</span>
                            </div>
                            <span style="cursor: pointer;">忘记密码</span>
                        </div>
                        <Toast />
                        <Button :loading="loading" class="input" @click="handlerDoLogin" label="立即登录"
                            severity="success" />
                    </div>
                </div>
            </div>
        </div>
        <div class="right">
            <svg-icon name="bg" width="100%" height="95%" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Setting from "@/setting";
import { toast } from "vue3-toastify";
import useUserStore from "@/stores/models/user/user.js";
import router from "@/router";

const loading = ref(false);
const userStore = useUserStore();
const user = ref({
    username: '',
    password: '',
    checked: true,
});
onMounted(() => { })


const handlerDoLogin = async () => {
    loading.value = true;
    try {
        //进到这里说明已经登录成功
        await userStore.handlerLogin(user.value);
        loading.value = false;
        toast.success("登录成功！");
        router.push({ path: "/" });
    } catch (error) {
        console.log("登录失败");
    }
}
</script>
<style scoped lang='scss'>
.container {
    height: 100vh;
    width: 100%;
    display: flex;

    .left {
        height: 100%;
        width: 30%;

        .form-container {
            height: 100%;
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;

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
                    color: #5c5c5c;
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

    .right {
        height: 100%;
        width: 70%;
    }
}

:deep(.p-inputtext) {
    width: 320px;
    height: 45px;
    padding: 10px;
}
</style>