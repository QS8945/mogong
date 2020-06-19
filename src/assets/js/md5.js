import md5 from 'js-md5'

export function CalcuMD5 (pwd) {
  // pwd = pwd.toUpperCase()
  pwd = md5(pwd)
  return pwd
}

export default {
  CalcuMD5
}
