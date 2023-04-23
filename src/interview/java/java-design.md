# Java进阶 - 设计模式

## 单例模式
### 场景
多个程序都要使用同一个配置文件中的数据，而且要实现数据共享和交换。必须要将多个数据封装到一个对象中，而且多个程序操作的是一个对象。必须保证这个配置文件的唯一性。
### 思考
1：一个类只要提供了构造函数，就可以产生多个对象，完全无法保证唯一<br>
既然数量不可控，不让其他程序建立对象即可。

2：不让其他程序创建，对象何在？<br>
自己在本类中创建一个对象，这样的好处是什么？可控。

3：创建完成后，是不是要给其他程序提供访问的方式？<br>
自己封装一个函数返回该对象

4：怎么就能不让其他程序创建对象呢？<br>
直接私有化构造函数，不让其他程序创建对象初始化。



```java
//饿汉式(非常饿，上来就创建对象,吃饱！)
//在类创建的同时就实例化一个静态对象出来，不管之后会不会使用这个单例，都会占据一定的内存，但是相应的，在第一次调用时速度也会更快，因为其资源已经初始化完成
class Single{
    //1:私有化构造函数
    private Single(){}

    //2:创建一个本类对象
    private static final Single s = new Single();//你可以解释为什么需要用private,static,final,private,修饰吗？

    //3:定义一个方法返回这个对象
    public static Single getInstance(){
        return s;
    }
}
//懒汉式-单例延迟加载模式(啥时候用啥时候创建对象，懒惰)
//会延迟加载，在第一次使用该单例的时候才会实例化对象出来，第一次调用时要做初始化，如果要做的工作比较多，性能上会有些延迟，之后就和饿汉式一样了
class Single2{
    //1:私有化构造函数
    private Single2(){}

    //2:创建一个本类对象，但是赋值null啥时候用啥时候new
    private static Single2 s2 = null;

    //3:定义一个方法返回这个对象，加入判断，不为空才创建对象
    public static Single2 getInstance(){
        if (s2 == null)
            s2 = new Single2();
        return s2;
    }
}

class SingleDemo{
    public static void main(String[] args) {
        //要获取Single对象，调用getInstance方法，无法通过对象调用，只能通过类名调用
        Single s = Single.getInstance();
        Single s2 = Single2.getInstance();
    }
}
```
### 懒汉式线程不安全，如何改进？

并发环境下很可能出现多个Singlet实例，要实现线程安全，有以下三种方式，都是对getInstance这个方法改造，保证了懒汉式单例的线程安全

**1：在getInstance方法上加同步**
```java
public static synchronized Single getInstance() {
    if (s == null) {
        s = new Single();
    }
    return s;
}
//在方法调用上加了同步，虽然线程安全了，但是每次都要同步，会影响性能，毕竟99%的情况下是不需要同步的
```

**2：双重检查锁定**
```java
public static Single getInstance() {
    if (s == null) {
        synchronized (Single.class) {
            if (s == null)
                s = new Single();
        }
    }
    return s;
  }
//在getInstance中做了两次null检查，确保了只有第一次调用单例的时候才会做同步，这样也是线程安全的，同时避免了每次都同步的性能损耗
```
**3：静态内部类**
```java
public class Singleton {
    private static class LazyHolder {
       private static final Singleton INSTANCE = new Singleton();
    }
    private Singleton (){}
    public static final Singleton getInstance() {
       return LazyHolder.INSTANCE;
    }
//利用了classloader的机制来保证初始化instance时只有一个线程，所以也是线程安全的，同时没有性能损耗，所以一般我倾向于使用这一种
}
```
这种比上面1、2都好一些，既实现了线程安全，又避免了同步带来的性能影响

### 结论
单例模式为一个面向对象的应用程序提供了对象惟一的访问点，不管它实现何种功能，整个应用程序都会同享一个实例对象
