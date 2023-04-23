# Map进阶 - HashMap 源码解析

## HashMap 概述
Hashmap 底层是 **数组+链表+红黑树**
HashMap 继承 AbstractMap，实现Map接口。允许放入Key或Value为null的元素。HashMap线程不安全，不保证元素顺序，put元素可能会发生Hash碰撞。
:::tip 思考一下？
1：线程不安全如何解决？
2：如何保证元素顺序？
3：Hash碰撞如何解决？
:::

## 静态常量理解
```java
// 默认的初始容量：16-必须是二的幂。 
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // 16
// 最大容量：如果其中一个带有参数的构造函数隐式指定了更高的值，则使用该容量
static final int MAXIMUM_CAPACITY = 1 << 30;//
// 负载系数：在构造函数中未指定时使用的负载系数 
static final float DEFAULT_LOAD_FACTOR = 0.75f;
// 最小树容量计算阀值：使用树形结构而不是列表作为储存计算阀值。
// 当至少有这么多节点，再次添加元素时才会调用树形方法（并不一定转换为树形结构，需要满足桶大小大于MIN_TREEIFY_CAPACITY）。
// 该值必须大于2至少为8
static final int TREEIFY_THRESHOLD = 8;
// 用于取消对（拆分）垃圾箱的搜索的垃圾箱计数阈值(即树形结构转为列表结构的长度)
static final int UNTREEIFY_THRESHOLD = 6;
// 树型阈值：可以将存储箱树化的最小表容量(即桶大小 大于此值才会转换为树形结构)
static final int MIN_TREEIFY_CAPACITY = 64;
```
## 构造函数理解
```java
// 默认构造函数。
public HashMap() {
    this.loadFactor = DEFAULT_LOAD_FACTOR; // all   other fields defaulted
 }

 // 包含另一个“Map”的构造函数
 public HashMap(Map<? extends K, ? extends V> m) {
     this.loadFactor = DEFAULT_LOAD_FACTOR;
     putMapEntries(m, false);//下面会分析到这个方法
 }

 // 指定“容量大小”的构造函数
 public HashMap(int initialCapacity) {
     this(initialCapacity, DEFAULT_LOAD_FACTOR);
 }

 // 指定“容量大小”和“负载因子”的构造函数
 public HashMap(int initialCapacity, float loadFactor) {
     if (initialCapacity < 0)
         throw new IllegalArgumentException("Illegal initial capacity: " + initialCapacity);
     if (initialCapacity > MAXIMUM_CAPACITY)
         initialCapacity = MAXIMUM_CAPACITY;
     if (loadFactor <= 0 || Float.isNaN(loadFactor))
         throw new IllegalArgumentException("Illegal load factor: " + loadFactor);
     this.loadFactor = loadFactor;
     this.threshold = tableSizeFor(initialCapacity);
 }

```
## put 过程分析

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}
//put调用putVal方法
//onlyIfAbsent：如果为真，那么该值不允许被覆盖，即不存在该key时候才put
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
    boolean evict) {
    Node < K, V > [];
    Node < K, V > p;
    int n, i;
    // 第一次put时候要对表进行初始化，调用resize方法。第一次扩容是将表由空初始化为默认大小16或者自定义的容量
    if ((tab = table) == null || (n = tab.length) == 0)
        n = (tab = resize()).length;
    // 找到具体的数组下标，如果该下标没有值，直接初始化node放入这个位置
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {//数组该位置有数据
        Node < K, V > e;
        K k;
        //判断这个位置的数据是否是我们想要插入的数据，即key是否相等，如果相等取出这个数据
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            e = p;
        //如果这个位置的数据是红黑树
        else if (p instanceof TreeNode)
            //调用红黑树的插值方法
            e = ((TreeNode < K, V > ) p).putTreeVal(this, tab, hash, key, value);
        else {
            // 这个位置的数据是链表
            for (int binCount = 0;; ++binCount) {
                // 插入到链表的最后面
                if ((e = p.next) == null) {
                    // 初始化node放入链表的最后面
                    p.next = newNode(hash, key, value, null);
                    // TREEIFY_THRESHOLD 默认值为 8，所以，如果新插入的值是链表中的第 8 个
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                        // 调用 treeifyBin 方法，也就是将链表转换为红黑树的方法
                        // 注意：调用treeifyBin 方法并不是说一定会将链表转为红黑树
                        /**
                         * treeifyBin源码如下
                         * 表长度大于 MIN_TREEIFY_CAPACITY 即默认大小64 才会进行转换红黑树的操作，否则只进行扩容。
                         * if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
                         *      resize();
                         * else if ((e = tab[index = (n - 1) & hash]) != null) //才会进行转换红黑树
                         */
                        treeifyBin(tab, hash);
                        break;
                    }
                // 如果在该链表中找到了"相等"的 key
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    // 此时跳出循环，那么 e 为链表中与要插入的新值的 key 相等的 node
                    break;
                p = e;
            }
        }
        // e不为空，即说明旧值的key与要插入的key"相等"，然后进行值覆盖，返回旧值
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            // 这个put方法传入的onlyIfAbsent为false即可以覆盖值
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    // 如果 HashMap 由于新插入这个值导致 size 已经超过了阀值（负载因子*默认大小），需要进行扩容
    if (++size > threshold)
        resize();
    afterNodeInsertion(evict);
    return null;
}
```


## get 过程分析
- 计算key的hash值，根据hash值找到对应的数组下标
- 如果该位置的元素是我们想要的元素直接返回，否则继续
- 判断该元素类型是否是红黑树类型，如果是用红黑树方法取数据，否则继续
- 遍历链表，直到找到相等的key返回其value
```java
public V get(Object key) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}

final Node<K,V> getNode(int hash, Object key) {
    Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & hash]) != null) {
        // 判断第一个节点是否是我们想要的
        if (first.hash == hash && // always check first node
            ((k = first.key) == key || (key != null && key.equals(k))))
            return first;
        // 继续往下找
        if ((e = first.next) != null) {
            //节点是红黑树
            if (first instanceof TreeNode)
                //调用红黑树取值方法
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);
            //遍历链表
            do {
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    //返回链表中的key与我们的key相等的元素
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
}
```

## resize 扩容分析
```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    int oldCap = (oldTab == null) ? 0 : oldTab.length;//原本桶容量，默认为16或者自己设置的大小容量
    int oldThr = threshold;//原本桶阀值，默认为桶容量*负载因子即 16*0.75 = 12
    int newCap, newThr = 0;
    if (oldCap > 0) {
        //如果扩容之前的容量大于等于指定的最大容量 1>>30
        if (oldCap >= MAXIMUM_CAPACITY) {
            //将桶的阀值设置为最大整形但并没有扩容
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        // 将数组大小扩大一倍
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            newThr = oldThr << 1; // double threshold
    }
    // 创建对象时，已经指定了容量大小；
    else if (oldThr > 0) // initial capacity was placed in threshold
        newCap = oldThr;
    else {               // zero initial threshold signifies using defaults
        // 创建对象没有指定容量大小的情况下 初始化时newCap = 16；newThr = 16 * 0.75 = 12；
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    // 设置新阈值newThr
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;//新桶容量 * 负载因子
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    threshold = newThr;
    @SuppressWarnings({"rawtypes","unchecked"})
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    table = newTab;
    //将oldTab的数据复制到newTab中
    if (oldTab != null) {
        for (int j = 0; j < oldCap; ++j) {//从下标 0 开始迁移数据
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {//判断下标  i 位置上是否有数据
                oldTab[j] = null;
                //这个位置上没有形成Node链表，只有一个Node节点
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
                else if (e instanceof TreeNode)
                    //红黑树
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // preserve order
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    do {//循环遍历Node链表，分离出2条链表：loTail是坐标不变的链表表头；hiTail是下标为 i + n的表头；
                        next = e.next;
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        else {
                            // 分别将loTail ，hiTail 插入到新数组
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```
