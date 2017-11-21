import moment from 'common/moment.core'

const date = moment
date.locale('en', {
  monthsShort: ['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二'],
  weekdays: ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
  weekdaysShort: ['日', '一', '二', '三', '四', '五', '六']
})

export default date
