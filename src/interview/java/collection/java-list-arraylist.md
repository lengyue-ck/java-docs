# List 进阶 - ArrayList 源码解析
## ArrayList 概述
底层是Object数组，也叫做动态数组，因为普通的数组在初始化的时候必须指定数组长度，ArrayList则不需要，并且会自动扩容。

## 静态常量理解
```java
//初始容量的大小
private static final int DEFAULT_CAPACITY = 10;

//空数组，创建实例的时候指定initialCapacity为0的时候elementData = EMPTY_ELEMENTDATA;
private static final Object[] EMPTY_ELEMENTDATA = {};

//无参构造时，Obeject数组elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
private static final Object[] DEFAULTCAPACITY_EMPTY_ELEMENTDATA = {};

//保存ArrayList数据的数组
transient Object[] elementData; // non-private to simplify nested class access

//ArrayList 所包含的元素个数
private int size;
```


## 构造函数理解
```java
//最为普通的无参构造，直接将elementData赋值为默认的空数组。
public ArrayList() {
    this.elementData = DEFAULTCAPACITY_EMPTY_ELEMENTDATA;
}
```


```java
//指定了初始化长度的构造函数。
public ArrayList(int initialCapacity) {
    if (initialCapacity > 0) {
        this.elementData = new Object[initialCapacity];
    } else if (initialCapacity == 0) {
        this.elementData = EMPTY_ELEMENTDATA;
    } else {
        throw new IllegalArgumentException("Illegal Capacity: "+
                                           initialCapacity);
    }
}
```
```java
// 构造一个包含指定集合的元素的列表
public ArrayList(Collection<? extends E> c) {
    Object[] a = c.toArray();
    if ((size = a.length) != 0) {
        // 如果elementData不是Object类型数据（c.toArray可能返回的不是Object类型的数组所以加上下面的语句用于判断）
        if (c.getClass() == ArrayList.class) {
            elementData = a;
        } else {
        //将原来不是Object类型的elementData数组的内容，赋值给新的Object类型的elementData数组
            elementData = Arrays.copyOf(a, size, Object[].class);
        }
    } else {
        // replace with empty array.
        elementData = EMPTY_ELEMENTDATA;
    }
}
```
## 扩容机制分析
### 什么时候扩容？
```java
// 在添加元素的时候进行扩容，调用ensureCapacityInternal方法检查是否需要扩容
public boolean add(E e) {
    ensureCapacityInternal(size + 1);  // Increments modCount!!
    elementData[size++] = e;
    return true;
}
```
### ensureCapacityInternal方法是什么？
```java
private void ensureCapacityInternal(int minCapacity) {
    ensureExplicitCapacity(calculateCapacity(elementData, minCapacity));
}

private void ensureExplicitCapacity(int minCapacity) {
    modCount++;

    // 如果minCapacity小于elementData.length则进行真正意义上的扩容
    if (minCapacity - elementData.length > 0)
        grow(minCapacity);
}
```
### grow方法又是什么？
```java
private void grow(int minCapacity) {
    // minCapacity为所需最小容量，oldCapacity为旧容量，newCapacity为新容量
    int oldCapacity = elementData.length;
    // 新容量为 旧容量 + 旧容量的一半(其实就是原数组的1.5倍)
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    // 判断新容量是否满足最小容量
    if (newCapacity - minCapacity < 0)
        //新容量即为所需最小容量
        newCapacity = minCapacity;
    //判断新容量是否大于 所设最大数组容量
    if (newCapacity - MAX_ARRAY_SIZE > 0)
        //新数组容量为调用hugeCapacity后的结果
        newCapacity = hugeCapacity(minCapacity);
    // minCapacity is usually close to size, so this is a win:
    //开始Array复制,扩容    
    elementData = Arrays.copyOf(elementData, newCapacity);
}
private static int hugeCapacity(int minCapacity) {
    //所需最大容量整数溢出
    if (minCapacity < 0) // overflow
        throw new OutOfMemoryError();
    //最大 可能返回 Integer.MAX_VALUE
    return (minCapacity > MAX_ARRAY_SIZE) ? Integer.MAX_VALUE : MAX_ARRAY_SIZE;
}
```
### Arrays.copyOf 方法又是什么？
```java
//其实就是一个数组复制的方法。
//如果新长度大于源数组的长度，那么就会扩容，如果小于，那么就会截取数组。
public static <T,U> T[] copyOf(U[] original, int newLength, Class<? extends T[]> newType) {
    @SuppressWarnings("unchecked")
    T[] copy = ((Object)newType == (Object)Object[].class)
        ? (T[]) new Object[newLength]
        : (T[]) Array.newInstance(newType.getComponentType(), newLength);
    System.arraycopy(original, 0, copy, 0,
                     Math.min(original.length, newLength));
    return copy;
}
//最终调用本地方法
public static native void arraycopy(Object src,  int  srcPos,Object dest, int destPos,int length);
```
:::tip 总结扩容机制
- 当添加第一个元素时，ArrayList 容量为默认值10。
- 每次添加元素时，ArrayList 都会检查当前容量是否够用，如果不够用就需要进行扩容。
- 扩容的大小为原容量的一半，也就是说每次扩容容量会增加原来容量的50%。
- 扩容后需要将原数组中的元素复制到新数组中。
:::
