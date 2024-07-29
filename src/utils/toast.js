//封装Primevue的Toast，否则在request.js中无法全局使用
import app from '@/app'
const getToast = () => app.config.globalProperties.$toast
const toast = {
	add(param) {
		getToast().add(param)
	}
}
export default toast