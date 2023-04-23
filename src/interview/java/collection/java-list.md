# List 基础 - 详解
## List接口概述
储存的元素有序，可重复，数组的长度动态改变。实现List接口的常见类有 ArrayList 和 LinkedList
## ArrayList 与 LinkedList 区别
- `线程安全`：ArrayList和LinkedList线程都不安全。
- `底层数据结构`：ArrayList底层使用Object数组。LinkedList底层使用的是双向链表的数据结构。
- `是否支持随机访问`：ArrayList支持随机访问(get方法)。LinkedList不支持随机访问。
- `空间占用`：ArrayList在数组末尾可能会浪费空间，而LinkedList的每一个元素都要消耗比ArrayList更多空间(因为还有存放直接元素之间的联系)
- `插入删除是否受元素位置影响`：
  - ArrayList采用数组储存，在插入和删除的时候受元素位置影响。直接执行add方法会默认插入数组的尾部，但是如果指定了角标，还要将指定角标后的所有元素向后移动一位。
  - LinkedList采用链表储存，如果在头部或者尾部插入元素不受元素位置影响，但是如果指定位置插入元素，就要先移动到指定位置再插入。
## ArrayList 与 Vector 区别
- ArrayList和Vector底层都使用Object数组储存。
- ArrayList线程不安全，Vector线程安全。
- 
## ArrayList 实现 RandomAccess 接口有何作用
RandomAccess 是一种标记接口，表示支持快速随机访问集合类中的元素。例如ArrayList可以通过索引index进行快速访问，而LinkedList底层由链表实现，该类并没有实现 RandomAccess 接口。
`RandomAccess 接口就是用来标记能够随机访问的集合，即底层由数组实现的集合`

## for遍历和迭代器遍历有何区别
- 支持随机访问的集合使用 for 循环遍历效率优于迭代器；
- 支持顺序访问的集合使用迭代器遍历效率优于 for 循环遍历；
- 在进行集合遍历前可通过 instanceof RandomAccess 进行提前判断，从而选择不同的遍历方式，提升效率。

# Array和ArrayList 有何区别
- Array可以容纳基本数据类型和对象，而ArrayList只能容纳对象(对基本数据类型需要包装)
- Array是指定大小长度的，ArrayList的大小是动态的。而且也可以不指定大小。
- Array没有提供ArrayList的许多功能，比如addAll,removeAll
:::tip 什么时候更适合用 Array ？
- 列表的大小已经指定，并且不常改变，大部分情况是储存或者遍历他们。
- 使用多维数组，比使用List更容易
:::
