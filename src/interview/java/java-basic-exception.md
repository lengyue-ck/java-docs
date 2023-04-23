# Java基础 - 异常机制

## try-catch-finally 如何使用？
**try块** ： 用于捕获异常。其后可接零个或多个 catch 块，如果没有 catch 块，则必须跟一个 finally 块。

**catch块** ： 用于处理 try 捕获到的异常。finally 块 ： 无论是否捕获或处理异常，

**finally块**里的语句都会被执行。当在 try 块或 catch 块中遇到 return 语句时，finally 语句块将在方法返回之前被执行。
