# Set 进阶 - HashSet 源码解析
## HashSet 概述
HashSet实现Set接口，由哈希表（实际上是一个HashMap实例）支持。它不保证set 的迭代顺序；特别是它不保证该顺序恒久不变。此类允许使用null元素。

## 静态常量理解
```java
// 底层就是HashMap，Set中的元素就是HashMap的Key
private transient HashMap<E,Object> map;

// 默认的hashMap的Value就是一个空对象
private static final Object PRESENT = new Object();
```

## 构造函数理解
```java
//最为普通的无参构造
public HashSet() {
    map = new HashMap<>();
}

//可以传一个集合，并且初始化Map
public HashSet(Collection<? extends E> c) {
    //根据集合长度确定hashMap的大小
    map = new HashMap<>(Math.max((int) (c.size()/.75f) + 1, 16));
    addAll(c);
}

//初始化HashMap的 容量大小 和 负载因子
public HashSet(int initialCapacity, float loadFactor) {
    map = new HashMap<>(initialCapacity, loadFactor);
}

//初始化一个指定大小的HashMap
public HashSet(int initialCapacity) {
    map = new HashMap<>(initialCapacity);
}
```

## add方法分析
```java
// 就是执行HashMap 的put方法
public boolean add(E e) {
    return map.put(e, PRESENT)==null;
}
```
