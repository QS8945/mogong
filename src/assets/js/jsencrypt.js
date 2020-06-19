import JsEncrypt from 'jsencrypt'

// let jse = this.$jsEncrypt
// console.log('jse', jse)
JsEncrypt.prototype.setPublicKey(`c9b86776b53d777509cef0fc5924b572143664b727ed8fd91744991496dd5b192f65801c2025337c9045e1279cc46fa26bd1ac78d0e8437d2afa648ce407b535a032d9b8e64757ac4b5ec0c97fd39d2bed6489b40022152c833a4a133eba4323fd3121ba06abc075e188798477c66432b56ee125b65cf8168d7ef23e810a2c5b`, '10001')

JsEncrypt.prototype.setPrivateKey(`-----BEGIN PRIVATE KEY-----
MIICeAIBADANBgkqhkiG9w0BAQEFAASCAmIwggJeAgEAAoGBAMm4Z3a1PXd1Cc7w/FkktXIUNmS3J+2P2RdEmRSW3VsZL2WAHCAlM3yQReEnnMRvomvRrHjQ6EN9KvpkjOQHtTWgMtm45kdXrEtewMl/050r7WSJtAAiFSyDOkoTPrpDI/0xIboGq8B14Yh5hHfGZDK1buEltlz4Fo1+8j6BCixbAgMBAAECgYA1dUE2HGHlvoaS6Rp3JVtQmDqyBjf2pSCLIgrPggu3kL0W0RSjEDjM0g8y1CSfilYo7LAgdHyZJhq1sOAFrmU/EF6bC+7lwwdUiHSwPbkAv6NeTb1qVU4g9VOln/RMODLuN3umxhQhfsQ7zROe8kg5o1wZQ2jTrQf2qmjX3HaJgQJBAO041gi9JqbPy63UXoTIbvV84fKKMO2rPeR/YuFkHLumKKKRGnXGh80gAircFouGXFYrHS0wdQfvO+4I/5go5EkCQQDZsCW6oG+MtA8zUqR9NPIu1QGwlCucw7F80dqGQUKqhpRfuVSpnYiQncH0V0+SuklKEqS60jZimSxE3Hok7IODAkEA5Ay+njoQ3U5oVR0THH1/RhqfMEYvUVxNLMxVp65RfQf4iogKMuz/gm/iBYf9WHZ7cA8UhmvOJimTqHsYFBRDmQJBANF2ukci21NjawDyc4565NKFadPUL0bv0pgNgZ0PrKtTRe/57+opyF+HPTr0zH+eOqlI2TNe1K/5PWyhTfK7lisCQQCZCHpsMLEEd8I+iLt/1czUNDuTUXMHdStLjr4804XPBwPWDUHt6wW/dVmXHRwckx+2MrYy1bKW7vGkEoqESqxS
-----END PRIVATE KEY-----`)

// 加密
export function encrypt (data) {
  return JsEncrypt.prototype.encrypt(data)
}

// 解密
export function decrypt (data) {
  return JsEncrypt.prototype.decrypt(data)
}

export default {
  encrypt,
  decrypt
}
