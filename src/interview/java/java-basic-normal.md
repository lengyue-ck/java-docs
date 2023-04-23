# Java基础 - 常见考点

## == 和 equals 的区别
在Java中，"=="是一个运算符，用于比较两个变量是否引用同一个对象，而"equals"是Object类中的一个方法，用于比较两个对象是否相等。它们的区别如下
- "=="比较的是两个变量的引用是否指向同一个对象，即比较它们的地址是否相同。而"equals"比较的是两个对象的内容是否相同，即比较它们的值是否相等。
- "=="适用于所有的数据类型，包括基本数据类型和引用数据类型；而"equals"方法只适用于引用类型的比较。
- "=="比较的是两个变量的值是否相等，而"equals"比较的是两个对象的"" 值是 ""否相等。
- 对于基本数据类型，"=="比较的是它们的值是否相等，而对于引用数据类型，比较的是它们的地址是否相等。
```java
vbnetCopy codeString str1 = new String("hello");
String str2 = new String("hello");

System.out.println(str1 == str2); // false
System.out.println(str1.equals(str2)); // true
```
在上面的代码中，"=="比较的是str1和str2的地址是否相同，因为str1和str2是两个不同的对象，所以返回false。而"equals"比较的是str1和str2的值是否相等，因为它们的值都是"hello"，所以返回true。

综上所述，"=="比较的是变量的引用是否指向同一个对象，而"equals"比较的是两个对象的内容是否相同。在使用时需要根据实际情况选择适当的比较方法。

## 两个对象的 hashCode() 相同，则 equals() 也一定为 true 吗
==不一定==

hashCode() 方法是Object类中的一个方法，用于获取对象的哈希码值，这个哈希码值可以用于在散列表等数据结构中进行快速查找和比较。equals()方法也是Object类中的一个方法，用于比较两个对象是否相等。在Java中，如果两个对象的equals()方法返回true，则它们的哈希码值（hashCode()）必须相同；但是，如果两个对象的哈希码值相同，它们的equals()方法不一定返回true。

这是因为，哈希码值相同只能说明这两个对象所处的哈希桶相同，但不一定表示它们相等。因为哈希冲突是不可避免的，可能会有多个不同的对象具有相同的哈希码值。在这种情况下，equals()方法会进一步比较它们的属性值是否相等，以确定它们是否相等。

## 为什么重写 equals() 就一定要重写 hashCode() 方法
在Java中，对象的hashCode()方法返回一个整数，用于表示该对象的哈希码。哈希码是根据对象的内部状态（例如对象的属性值）计算得出的一个数值。hashCode()方法是Object类的一个方法，因此所有Java对象都具有hashCode()方法。

hashCode()方法的作用是为了让这个对象能够被放入到哈希表等基于哈希算法的数据结构中，从而提高查找效率。例如，当我们使用HashMap、HashSet等集合类时，它们都是基于哈希表实现的。在这些集合中，如果两个对象的hashCode()值相等，它们会被认为是相等的对象。

因此，如果我们重写了一个类的equals()方法，就应该同时重写hashCode()方法，以确保相等的对象具有相同的哈希码。如果不重写hashCode()方法，可能会导致哈希表等数据结构无法正常工作，例如当我们把对象添加到HashSet集合中时，可能会出现不正确的结果，即HashSet中可能会出现相等的对象。

## switch 语句能否作用在 byte 上，能否作用在 long 上，能否作用在 String 上
在Java中，switch语句可以作用在byte、short、int、char、枚举类型（JDK5.0后）以及String类型（JDK7.0后）上，但不能作用在long类型上。

在使用switch语句时，需要注意以下几点：

- switch语句的表达式必须是一个可以被整数类型（byte、short、int、char）或枚举类型表示的值，或者是一个String类型的值。
- case标签中的值必须是一个常量表达式，即在编译时就能确定的值，不能是变量或者非常量表达式。
- 在case语句中，如果没有使用break或return语句，会继续执行下一个case语句，直到遇到break或return语句或者执行到switch语句结束为止。
- 如果所有的case语句都不匹配，那么会执行default语句，如果没有default语句，那么switch语句就不做任何操作。

因此，可以在byte、short、int、char、枚举类型和String类型上使用switch语句，但不能在long类型上使用。

## & 和 && 的区别
&是按位与运算符，无论第一个操作数的值是什么，都会计算第二个操作数的值。而&&是逻辑与运算符，只有在第一个操作数为true时才会计算第二个操作数的值，从而可以提高程序的效率。
## Java 中的参数传递时传值呢？还是传引用
在Java中，参数传递时是按值传递（pass by value），也就是说，方法接收到的是参数值的一个副本，而不是参数本身。这意味着，在方法内部对参数值的任何修改都不会影响到方法外部原始参数的值。

然而，在Java中，对于对象类型的参数，方法接收到的是对象引用的一个副本，而不是对象本身。这个对象引用指向的是在堆内存中分配的实际对象。因此，在方法内部对对象的任何修改都会影响到实际对象，并且这些修改在方法外部也是可见的。这可能会导致一些人误认为Java是按引用传递的，但实际上Java还是按值传递的。

为了更好地理解这个问题，可以将对象引用看作是一个地址，而实际对象则是保存在该地址指向的内存单元中的数据。当我们将一个对象引用作为参数传递给方法时，方法接收到的是这个地址的副本。因此，虽然方法内部的代码可以通过这个地址来修改实际对象的数据，但是方法外部的代码并没有修改这个地址，因此原始对象的引用仍然指向同一个内存单元。

综上所述，Java中的参数传递是按值传递的，对于对象类型的参数，实际上是传递了对象引用的值

## Integer 和 int 的区别
在Java中，Integer是一个类，而int是一种基本数据类型。下面是Integer和int之间的区别:
- ```可空性```：Integer可以为null，而int不能为null。
- ```存储空间```：Integer是一个对象，需要分配内存空间存储对象本身和额外的对象头信息，而int是一个原始数据类型，只需要分配固定大小的内存空间。
- ```自动装箱和拆箱```：当需要将一个int类型的变量传递给一个需要Integer类型参数的方法时，Java会自动将int类型的值装箱成对应的Integer对象；当需要从一个Integer对象中获取int类型的值时，Java会自动将Integer对象拆箱成int类型的值。
- ```性能```：由于Integer是一个对象，所以在进行运算和比较等操作时，需要进行额外的对象创建、拆箱、装箱和垃圾回收等操作，所以性能不如int类型。

Integer和int各有自己的特点和用途，需要根据具体的应用场景和设计需求进行选择。在一般情况下，建议使用int类型来进行数值计算和比较等操作，而在需要支持null值的情况下，可以考虑使用Integer。

## 装箱和拆箱的区别
在Java中，装箱（Boxing）和拆箱（Unboxing）是指将基本数据类型转换成对应的包装类型对象和将包装类型对象转换成基本数据类型的过程。

自动装箱和自动拆箱可以使代码更加简洁易读，但在大量数据操作时，可能会带来性能问题，因为每次装箱和拆箱都会涉及到对象的创建和销毁。因此，在需要频繁进行数据操作时，建议直接使用基本数据类型。

## String 为什么要设计为不可变类
- 安全性：字符串经常用于表示敏感信息，如密码等，如果 String 是可变类，那么它们的值可以在不知情的情况下被更改，这可能会导致安全漏洞。通过设计 String 为不可变类，可以避免这个问题。
- 线程安全性：多个线程并发地访问可变对象可能导致不一致的结果，如果 String 是可变类，那么在多线程环境下会存在安全隐患。通过设计 String 为不可变类，可以避免这个问题。
- 效率：在 Java 中，字符串常量池是一块特殊的内存区域，它存储了所有的字符串常量，如果 String 是可变类，那么每次修改字符串时都需要创建一个新的字符串对象，这将导致频繁的对象创建和垃圾回收，影响性能。通过设计 String 为不可变类，可以避免这个问题。
  
因此，String 类被设计为不可变类，它的值在创建之后不能被修改。如果需要修改字符串，可以使用 StringBuilder 或 StringBuffer 类，它们是可变的字符串类，可以有效地解决字符串频繁修改的问题。

## String 类的常用方法都有那些
String 类是 Java 中非常常用的字符串类，提供了丰富的方法来操作字符串。以下是 String 类的一些常用方法：

    charAt(int index)：返回字符串指定索引位置的字符。
    concat(String str)：将指定的字符串连接到该字符串的末尾。
    contains(CharSequence s)：判断该字符串是否包含指定的字符序列。
    endsWith(String suffix)：判断该字符串是否以指定的后缀结束。
    equals(Object anObject)：比较该字符串与指定对象是否相等。
    equalsIgnoreCase(String anotherString)：比较该字符串与指定字符串是否相等（忽略大小写）。
    getBytes()：将字符串转换为字节数组。
    indexOf(int ch)：返回指定字符在该字符串中第一次出现的索引。
    isEmpty()：判断该字符串是否为空字符串。
    length()：返回该字符串的长度。
    replace(char oldChar, char newChar)：用指定的新字符替换该字符串中所有的旧字符。
    split(String regex)：根据指定的正则表达式将该字符串拆分为字符串数组。
    startsWith(String prefix)：判断该字符串是否以指定的前缀开始。
    substring(int beginIndex)：返回从指定索引开始到字符串结尾的子字符串。
    toLowerCase()：将该字符串中的所有字符转换为小写字母。
    toUpperCase()：将该字符串中的所有字符转换为大写字母。
    trim()：返回去除该字符串两端空格后的字符串。

这些方法只是 String 类提供的一部分常用方法，还有很多其他的方法可以在 Java 官方文档中查看。


## final 修饰 StringBuffer 后还可以 append 吗

可以。使用 final 修饰 StringBuffer 对象，表示该对象的引用不能被改变，即不能让该引用指向另一个 StringBuffer 对象，但是仍然可以通过该引用调用该对象的方法，例如 append 方法。

final 关键字的作用是使得变量、方法、类等不能被修改或继承。在这里，final 修饰的是 StringBuffer 对象的引用，而非该对象本身，因此并不影响该对象的方法调用。

## final、finally、finalize 的区别
- final：final关键字用于修饰变量、方法和类，表示不可修改、不可继承和不可重写。对于变量，一旦被赋值就不能再被修改；对于方法，不能被子类重写；对于类，不能被继承。
- finally：finally是一个关键字，用于定义在try语句块中的一个代码块，在程序执行完try和catch块后无论是否发生异常，finally块中的代码都会被执行。通常用于释放资源、关闭文件等操作。
- finalize：finalize()是Object类中的一个方法，是垃圾回收机制在对象被回收之前调用的方法。finalize()方法可以被子类重写，用于在对象被回收之前执行一些清理操作。但是，由于垃圾回收机制的不确定性，finalize()方法并不保证一定会被执行，因此不建议在程序中过度依赖它。
## 创建对象的几种方式
- 使用 new 关键字：使用 new 关键字可以在堆内存中为一个类创建一个新的对象实例。例如，下面的代码创建了一个String类的对象
```java
String str = new String("abc")
```
- 使用 Class 类的 newInstance() 方法：使用 Class 类的 newInstance() 方法可以动态地创建一个类的对象，该方法调用的是类的默认构造方法。例如，下面的代码创建了一个String类的对象
```java
String str = String.class.newInstance();
```

- 使用 Constructor 类的 newInstance() 方法：使用 Constructor 类的 newInstance() 方法可以根据传入的参数创建一个类的对象，该方法可以调用指定的构造方法。例如，下面的代码创建了一个String类的对象
```java
Constructor<String> constructor = String.class.getConstructor(String.class);
String str = constructor.newInstance("Hello World");
```
- 使用 clone() 方法：使用 clone() 方法可以复制一个已有的对象，创建一个新的对象。要使用该方法，需要保证被复制的对象实现了 Cloneable 接口。例如，下面的代码创建了一个String类的对象：
```java
String str = new String("Hello World");
String str2 = (String) str.clone();
```
- 使用反序列化：使用反序列化可以从文件或网络中读取一个对象的二进制表示，并转换成一个对象。要使用该方法，需要保证被读取的类实现了 Serializable 接口。例如，下面的代码创建了一个String类的对象
```java
String str = "Hello World";
ObjectOutputStream out = new ObjectOutputStream(new FileOutputStream("test.txt"));
out.writeObject(str);

ObjectInputStream in = new ObjectInputStream(new FileInputStream("test.txt"));
String str2 = (String) in.readObject();
```

## 什么是 Java 的序列化
ava的序列化是指将Java对象转换成二进制数据，以便在网络上传输或保存到磁盘上，这个过程叫做序列化。反序列化是指将这些二进制数据转换成Java对象。

Java的序列化机制需要实现Serializable接口，这个接口没有任何方法，只是起到一个标记作用，表示这个类可以进行序列化。实现了Serializable接口的类中，可以将需要序列化的成员变量标记为transient关键字，这样在进行序列化时，这个变量就不会被序列化。

Java提供了两种序列化方式：基于对象的序列化和基于字节流的序列化。基于对象的序列化是指将一个对象序列化为一个字节数组，再将这个字节数组写入到文件或通过网络传输给其他程序。基于字节流的序列化是指将对象的属性一个一个写入输出流，每个属性都包含一个属性名和属性值。

## 如何实现 Java 的序列化
- 创建一个实现Serializable接口的Java类。
- 通过ObjectOutputStream将Java对象转换成字节数组，或者通过ObjectInputStream将字节数组反序列化成Java对象。
- 如果需要对序列化的对象进行自定义处理，可以重写writeObject()和readObject()方法。
- 如果需要保证序列化后的对象版本兼容性，可以使用serialVersionUID来指定版本号。

## 什么情况下需要序列化
- ```对象需要在网络中进行传输```：在分布式应用程序中，可以将Java对象序列化并通过网络传输给远程应用程序。
- ```对象需要被持久化```：Java对象可以被序列化并存储在磁盘上，以便在需要时可以重新加载。
- ```对象需要被缓存```：Java对象可以被序列化并缓存在内存中，以提高程序的性能。
- ```对象需要进行深度复制```：在某些情况下，需要创建对象的副本，这时可以通过将对象序列化然后反序列化的方式实现深度复制。
- ```对象需要在进程之间共享```：在Java应用程序中，可以将Java对象序列化并通过消息队列或共享内存等方式共享给不同的进程。
