import Vue from 'vue'
import VueI18n from 'vue-i18n'
import enLocale from 'element-ui/lib/locale/lang/en'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
// 引入各个语言配置文件
import zh from './config/zh'
import en from './config/en'
import locale from 'element-ui/lib/locale'
Vue.use(VueI18n)
// 创建vue-i18n实例i18n
const messages = {
  en: {
    ...en,
    ...enLocale // 或者用 Object.assign(en, enLocale)
  },
  zh: {
    ...zh,
    ...zhLocale // 或者用 Object.assign(zh, zhLocale)
  }
}

const i18n = new VueI18n({
  // 设置默认语言
  locale: localStorage.getItem('localeLanguage') || 'zh', // 语言标识
  // 添加多语言（每一个语言标示对应一个语言文件）
  messages
})

let localeLanguage = localStorage.getItem('localeLanguage') || 'zh'
if (localeLanguage === 'zh') {
  locale.use(zhLocale)
} else if (localeLanguage === 'en') {
  locale.use(enLocale)
}
export default i18n
