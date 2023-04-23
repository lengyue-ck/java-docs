# Map基础 - 详解
## Map 接口概览
Map接口主要存放键值对。从顺序上可以分为有序Map和无序Map，从安全性上可以分为线程安全Map和非线程安全Map。

## 无序Map和有序Map
- 无序Map：```HashMap```，```HashTable```，`ConcurrentHashMap`,`ThreadLocalMap`
- 有序Map：```TreeMap```，````LinkedHashMap````，```ConcurrentSkipListMap```

## 线程安全Map和线程不安全Map
- 线程安全Map：```HashTable```，```ConcurrentHashMap```，```ConcurrentSkipListMap```
- 线程不安全Map：```HashMaap```，````TreeMap````，`ThreadLocalMap`，`LinkedHashMap`


## 实现Map接口有哪些类？
| 类       | 线程安全 | 有序性 |底层数据结构 | 初始容量 | 负载因子 |实例化方式|
|---------|---------|-----|----------------|------|------|--|
| HashMap | 不安全  | 无序  | 数组+链表+红黑树 | 16   | 0.75 | 懒加载|
| HashTable | 安全  | 无序  | 数组+链表 | 11   | 0.75 | 初始化创建|
| ThreadLocalMap | 不安全  | 无序  | 数组 | 16   | 0.75 | 懒创建|
| TreeMap | 不安全  | 有序(左小右大)  | 红黑树 | -   | - | -|
| LinkedHashMap | 不安全  | 有序(插入顺序)  | 数组+单双向链表 | -  | - | -|
| ConcurrentHashMap | 安全  | 无序  | 数组+链表+红黑树 | 16  | 0.75 | 懒加载|
| ConcurrentSkipListMap | 安全  | 有序(左小右大)  | 跳跃表 | -  | - | -|

## HashMap和HashTable的区别
- `线程安全`：HashMap线程不安全，HashTable线程安全。
- `效率`：因为HashTable内部使用了**synchornized**关键字进行同步，所以效率低于HashMap。（HashTable基本被淘汰，如果要使用线程安全Map推荐使用ConcurrentHashMap）
- `有序性`：HashMap和HashTable都无序。
- `Null的支持`：HashMap允许Null的键值对，只能有一个Null的Key，但是允许有多个Null的Value。HashTable不允许有Null键值对。
- `初始化`：HashMap默认初始化大小为16，HashTable默认初始化大小为11。

## HashMap和TreeMap 区别·
- `有序性`：**HashMap无序，TreeMap有序**。HashMap是通过hash值进行快速查找的；HashMap中的元素是没有顺序的；TreeMap中所有的元素都是以自然顺序（升序）排序，如果需要得到一个有序的结果，就应该使用TreeMap
- `线程安全`：**HashMap和TreeMap线程都不安全**。
- `效率`：hashMap底层是数组，在添加查找删除等方面速度比较快。TreeMap底层是Tree接口，速度比较慢。但是HashMap要保存一个Array，会造成空间浪费，而TreeMap只保存要保留的节点，占用空间较小。
- `Null的支持`：HashMap允许Null的键值对，只能有一个Null的Key，但是允许有多个Null的Value。TreeMap不允许有Null的Key但是允许有多个Null的Value
- `比较键`：HashMap使用Object类的equals()方法比较键。 Map类的equals()方法将其覆盖。HashTable使用compareTo()方法比较键。

## HashMap与ConcurrentHashMap 的区别是什么
- `线程安全`：HashMap线程不安全，ConcurrentHashMap线程安全
## ConcurrentHashMap和HashTable的区别
- `底层数据结构`：JDK1.8采用的数据结构和JDK1.8的HashMap结构一样，都是**数组+链表+红黑树**。HashTable和JDK1.8之前的HashMap的底层数据结构类似，都是**数组+链表**。链表是为了解决哈希冲突的问题。
- `实现线程安全的方式`： 
  - JDK1.7时，ConcurrentHashMap对整个哈希桶进行分段切割。每一段都有一把锁，多线程访问容器里不同的数据段数据的时候，就不会存在竞争，提高了并发访问率。
  - JDK1.8之后ConcurrentHashMap撅弃了分段锁的概念。直接使用**数组+链表+红黑树**的数据结构实现。并发控制使用synchronized和CAS来操作。
  - HashTable使用的是同一把锁，使用synchronized来保证线程安全，效率比较低下，当一个线程put元素的时候，其他线程不能put，高并发下竞争激烈，不推荐使用。

## JDK1.7和JDK1.8ConcurrentHashMap有什么不同
- `实现线程安全的方式`：1.7的ConcurrentHashMap底层使用**分段数组+链表**实现，JDK1.8采用的数据结构和JDK1.8的HashMap结构一样，都是**数组+链表+红黑树**
- `并发度`：1.7之前的最大并发数为分段锁的数量(16)，1.8之后最大并发数为Node数组的大小，并发数更大
- `Hash冲突解决方案`：1.7采用拉链法，1.8采用拉链法+红黑树（链表和数组长度超过一定阈值后将链表转为红黑树）


## HashMap长度为什么是2的幂
- HashMap的长度为2的幂次方的原因是为了减少Hash碰撞，尽量使Hash算法的结果均匀分布
- 扩容迁移的时候不需要再重新通过哈希定位新的位置了。扩容后，元素新的位置，要么在原脚标位，要么在原脚标位+扩容长度这么一个位置

## HashMap 的 get 方法能否判断某个元素是否在 map 中
`不可以`，因为HashMap的Key和Value都可以为null，使用get方法并不能确定是真正意义上的null还是此元素就是null。如果要判断某个元素是否在map中，应该使用`containsKey`

## LinkedHashMap 的实现原理
LinkedHashMap继承hashMap，可以理解为HashMap的增强体。HashMap因为底层数据结构，导致了她的无序性， LinkedHashMap使用了一对双向链表来记录添加元素的顺序。
LinkedHashMap的put存放元素其实是调用的HashMap的put方法。LinkedHashMap的重写了get()方法







