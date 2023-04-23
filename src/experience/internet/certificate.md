# Https证书 常见问题

## pfx格式转p12格式

转换前后需要 源密码与新密码一致并且大于6位，如果源密码小于6位，可以参考下面方案重新设置密码。
```shell
# original.pfx 源pfx文件
# new.p12 新的p12文件
keytool -importkeystore -destkeystore new.p12 -deststoretype pkcs12 -srckeystore original.pfx
```
## pfx格式密钥库修改密码
有时候我们从阿里云或者腾讯云下载出来的证书的密码默认是4位，但是我们转换p12格式的时候，需要重新设置密码，如果重新设置的密码和源密码不一样，将会报错，并且最低要求我们重新设置6位密码。


1.pfx格式的密钥库不能直接用keytool修改私钥密码，需要先转成keystore

```shell
# test.pfx:源文件
# keystore.jks:新文件
keytool -importkeystore -srckeystore test.pfx -srcstoretype PKCS12 -deststoretype JKS -destkeystore keystore.jks
```
2.修改私钥密码，下边的库密码是上边转成的keystore.jks的库密码

```shell
# 原密码:不符合要求的密码，即最开始下载出来证书的密码
# 新密码:我们要重新设置成符合规则的密码(大于6位)
# 库密码:我们上一步转keystore时候设置的密码
# bieming: 证书别名，默认大概率为域名例如：xxx.com,如果不知道就填写域名试一下，不行就问云厂商
keytool -keypasswd -alias bieming -keypass 原密码 -new 新密码 -storepass 库密码  -keystore keystore.jks
```

3.上一步结束后就是把库里的私钥密码修改了。最后把keystore转成pfx重新设置库密码即可(一般设置库密码和私钥密码一致)

```shell
# new.pfx:改完密码的新 pfx文件
# keystore.jks:步骤一转换的文件
keytool -importkeystore -srckeystore keystore.jks -srcstoretype JKS -deststoretype PKCS12 -destkeystore new.pfx
```

