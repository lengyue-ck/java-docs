# Set 基础 - 详解

存储的元素是无序的、不可重复的。
## 实现Set接口有哪些类？
- `HashSet(无序，唯一)`: 基于 HashMap 实现的，底层采用 HashMap 来保存元素
- `LinkedHashSet`: LinkedHashSet 是 HashSet 的子类，并且其内部是通过 LinkedHashMap 来实现的。
- `TreeSet(有序，唯一)`: 红黑树(自平衡的排序二叉树)#
## HashSet 实现原理
它是基于HashMap实现的，HashSet底层使用HashMap来保存所有元素，因此HashSet 的实现比较简单，相关HashSet的操作，基本上都是直接调用底层HashMap的相关方法来完成。

## HashSet怎么保证元素不重复的
HashSet的底层是HashMap。add元素的时候调用的是hashMap的put方法，HashMap的put方法是调用的HashMap的putVal方法，putVal方法会将传入的Key进行Hash计算。(hashCode()方法)。如果HashCode值相同，那么就会进行覆盖
如果不同将会添加元素。如果不是重复元素，put 方法最终会返回 null，也就是add方法是否调用成功。
