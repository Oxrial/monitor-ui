export function valueFormat(vRules, obj) {
  let flag = ''
  triggerFormat(vRules, obj, '', flag)
  return flag
}
// 依照trueKey匹配，若仅匹配key，改为includes(key)，trueKey不能校验数组中的值，因下标值是随机的
function triggerFormat(vRules = false, obj, preK, flag) {
  if (!vRules) return
  for (const k in obj) {
    const trueK = (preK ? preK + '.' : '') + k
    if (typeof obj[k] == 'string') {
      if (!obj[k]) {
        vRules.notNull.forEach((v) => {
          v === k && (flag += trueK + '值不为空；')
          key === 'for' && (obj[k] = null)
        })
      } else {
        vRules.notNumBoolean.includes(trueK) && !isNaN(obj[trueK]) && (flag += trueK + '值不为纯数字或布尔字符串；')
        // vRules.isBoolean值类型为布尔
        // vRules.isNum值类型为纯数字
      }
    } else if (Array.isArray(obj[k])) {
      if (vRules.isSArray.includes(trueK)) {
        obj[k].forEach((ai) => {
          const atemp = Object.prototype.toString.call(ai)
          atemp === '[object Object]' && triggerFormat(vRules, obj[k], trueK)
        })
      }
    } else {
      const temp = Object.prototype.toString.call(obj[k])
      // vRules.notNumBoolean值不为数字或布尔
      // vRules.isNum值类型为纯数字
      // vRules.isSArray值类型为数组
      if (temp === '[object Object]') triggerFormat(vRules, obj[k], trueK)
      // vRules.notNull值类型不为空
      else if (temp === '[object Null]') vRules.notNull
      // \!vRules.isBoolean值类型不为布尔
      else if (temp === '[object Boolean]') vRules.isBoolean
    }
  }
}
