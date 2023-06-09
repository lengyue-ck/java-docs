# Mysql 进阶 - 索引
## 为什么要建立索引
在非常大的表中进行查询，如果数据库进行全表遍历的话那么速度是会非常慢的，而我们的索引则可以建立一个b+树的结构，可以**自上而下的去进行查询（有点像二分查找），可以在一定程度避免走全表查询**，这样查询的速度是非常快的；

- 一般情况下扫描索引的速度是远远大于扫描全表的速度的；
- 索引是天然有序的，具备B+树的快速检索（类似二分查找）
- 索引天然聚合（存储的数据是去重了的），在一些操作(分组，排序等)中不会再产生中间表；



## MySQL有哪几种索引类型
BTree索引（B-Tree或B+Tree索引），Hash索引，full-index全文索引，R-Tree索引

- `BTree索引:`BTree即B+树索引，INnoDB存储引擎默认的索引，支持排序、分组、范围查询、模糊查询等，并且性能稳定。
- `Hash索引:`Hash即哈希索引，哈希索引多用于等值查询，时间复杂夫为o(1)，效率非常高，但不支持排序、范围查询及模糊查询等。
- `full-index全文索引:`full-index即全文索引，MyISAM存储引擎和InnoDB存储引擎在MySQL5.6.4以上版本支持全文索引，一般用于查找文本中的关键字，而不是直接比较是否相等，多在CHAR，VARCHAR，TAXT等数据类型上创建全文索引。全文索引主要是用来解决WHERE name LIKE "%zhang%"等针对文本的模糊查询效率低的问题。
- `R-Tree索引:`R-Tree即空间数据索引，多用于地理数据的存储，相比于其他索引，空间数据索引的优势在于范围查找




## 哪些情况适合建立索引
- 1：频繁作为where条件语句查询的字段
这是因为在频繁查询的字段列创建索引可以避免查询数据的时候走全表扫描，这样查询的速度就会大大增加；
- 2：排序字段可以建立索引
这是因为b+树结构的索引是天然有序的！
- 3：统计字段可以建立索引，例如count(),max()
这是因为索引是天然聚合的，就是存放在b+树的数据是已经去重的数据了，存储的数据还是比较紧凑的，那么通过B+树的双向指针可以更快的找到要统计的数据，而且在加了索引的列的统计的时候MySQL是不会产生中间表来专门去重了，可以减少不必要的性能开销；（在没有索引的列的统计，分组 的SQL语句中，MySQL都是会创建临时表来存储数据的）
- 3：组字段可以建立索引
因为分组的前提是排序



## 哪些情况下不适合建索引
- 1：频繁更新的字段不适合建立索引
因为数据比较大的表的索引的创建是非常耗时的，而且如果一个字段被频繁更新那么我们还需要频繁的维护这个树的结构，这个开销是非常大的
- 2：参与列计算的列不适合建索引
因为计算后的列的值最后不一定是有序的，不有序那么就会导致索引会失效
- 3：表数据可以确定比较少的不需要建索引
- 4：数据重复且分布比较均匀的的字段不适合建索引
因为说不定你对这种索引字段的查询的速度还没有全表扫描快，例如性别，真假值
- 5：where条件中用不到的字段不适合建立索引
因为索引是可以帮助我们在查询的时候大大的提高查询效率，但是在增加，删除操作确实异常消耗性能的，因为需要不断的维护B+树的结构（有序你就需要维护）



## 说一说索引的底层实现
-  `Hash索引`
基于哈希表实现，只有精确匹配索引所有列的查询才有效，对于每一行数据，存储引擎都会对所有的索引列计算一个哈希码（hash code），并且Hash索引将所有的哈希码存储在索引中，同时在索引表中保存指向每个数据行的指针。
-  `B-Tree索引（MySQL使用B+Tree）`
B-Tree能加快数据的访问速度，因为存储引擎不再需要进行全表扫描来获取数据，数据分布在各个节点之中。
- `B+Tree索引`
是B-Tree的改进版本，同时也是数据库索引索引所采用的存储结构。数据都在叶子节点上，并且增加了顺序访问指针，每个叶子节点都指向相邻的叶子节点的地址。相比B-Tree来说，进行范围查找时只需要查找两个节点，进行遍历即可。而B-Tree需要获取所有节点，相比之下B+Tree效率更高。

## 为什么索引是使用B+树？
- B树适用于随机检索，而B+树适用于随机检索和顺序检索
- B+树的空间利用率更高，因为B树每个节点要存储键和值，而B+树的内部节点只存储键，这样B+树的一个节点就可以存储更多的索引，从而使树的高度变低，减少了I/O次数，使得数据检索速度更快
- B+树的叶子节点都是连接在一起的，所以范围查找，顺序查找更加方便
- B+树的性能更加稳定，因为在B+树中，每次查询都是从根节点到叶子节点，而在B树中，要查询的值可能不在叶子节点，在内部节点就已经找到。


## mysql索引失效的情况
### 1：like通配符可能导致索引失效
并不是用了like通配符，索引一定失效，而是like查询是以%开头，才会导致索引失效。
```sql
select * from xxx where name like '%xx' #失效
select * from xxx where name like '%xx%' #失效
select * from xxx where name like 'xx%' #不失效
select name from xxx where name like '%xx%' #不失效(覆盖索引)
```
### 2：or语句前后没有同时使用索引。
```sql
select * from xxx where age = 1 or user_id = 2
```
当or左右查询字段只有一个是索引，该索引失效，只有当or左右查询字段均为索引时，才会生效

对于or+没有索引的age这种情况，假设它走了userId的索引，但是走到age查询条件时，它还得全表扫描，也就是需要三步过程： 全表扫描+索引扫描+合并
如果它一开始就走全表扫描，直接一遍扫描就完事。
mysql是有优化器的，处于效率与成本，遇到or条件，索引可能失效，看起来也合情合理。


### 3：is null,is not null可能会导致索引失效
如果字段不允许为空，则is null 和 is not null这两种情况索引都会失效

如果字段允许为空，则is null走 ref 类型的索引，而is not null走 range 类型的索引(**千万注意，如果返回数据量过大，也会索引失效**)

### 4：索引列上有计算,函数
```sql
#索引有计算
explain  select * from xxx where  height+1 =7;
#索引有函数
explain  select * from xxx where  SUBSTR(height,1,1)=8;
```

### 5：隐式类型转换导致索引失效
```sql
#不会使用name的索引
explain select * from xxx where name=123;
#使用到索引
explain select * from xxx where name='123';
```
name字段是VARCAHR类型的，但是比较的值是INT类型的，name的值会被隐式的转换为INT类型再比较，中间相当于有一个将字符串转为INT类型的函数。

### 6：不等于(!=,<>)，not in可能造成索引失效
```sql
#name字段为主键，索引不失效(range索引)
explain select * from xxx where name!='123';
explain select * from xxx where name not in (7,8);

#age字段不是主键，即使age字段设索引也会失效
explain select * from xxx where age!='18';
explain select * from xxx where age not in (7,8);
```
需要特别说明的是mysql5.7和5.8不同的版本效果不一样，5.7中这种情况sql执行结果是全表扫描，而5.8中使用了 range 类型索引。5.7中如果想使用索引该怎么办呢？答案：使用大于和小于代替不等于。(**千万注意，如果返回数据量过大，也会索引失效**)

### 7：联合索引不满足最左匹配原则
例如创建了联合索引 age,name,height,不满足最左匹配原则时，索引失效
:::tip 什么是最左匹配原则
从最左的索引开始匹配，遇到范围查询就会让后面范围列后的索引失效
例如你建立一个索引：idx_code_age_name( code , age , name )联合索引
```sql
#where 条件后的字段包含了联合索引的所有索引字段，并且顺序是按照： code 、 age 、name
explain  select * from test1 where code='001' and age=18  and  name='张飞'
#可以看出已经走了联合索引idx_code_name_age,索引是使用充分的，索引使用效率最佳

#where 条件后的字段包含了联合索引的所有索引字段，顺序是不按照： code 、 age 、name。
explain  select * from test1 where code='001' and  name='张飞' and age=18
#可以看出执行结果跟第一种情况一样。注意：这种情况比较特殊，在查询之前mysql会自动优化顺序

#where 条件后的字段包含了联合索引中的： code 字段
explain  select * from test1 where code='001'
#也走了索引，但是索引长度有所变化，现在变成了 92 ， 92 = 30*3 + 2 ，只用到了一个索引字段code，索引使用不充分

#where 条件后的字段包含了联合索引中的： age 字段 或者 name 字段
explain  select * from test1 where age=18
explain  select * from test1 where name='张飞';
#全表扫描，所有的索引都失效了

#where 条件后的字段包含了联合索引中的： code 和 age 字段
explain  select * from test1 where code='001' and age=18;
#走了索引，但是索引长度变成了： 96 ， 96 = 30*3 + 2 + 4 ，只用到了两个索引字段code和age，索引使用也不充分。

#where 条件后的字段包含了联合索引中的： code 和 name 字段
explain  select * from test1 where code='001' and  name='张飞';
#索引长度跟第3种情况一样，长度也是 92 。也就是说只用到了一个索引字段 code ，而 age 字段的索引失效了

#where条件后的字段包含了联合索引中的：age 和 name 字段
explain  select * from test1 where age=18  and  name='张飞';
#全表扫描，所有的索引都失效了
```
:::


:::tip 如果中间出现断层，如： code、name ，只会走第一个索引code，从断层后的索引都会失效
SQL语句中字段的顺序不需要和联合索引中定义的字段顺序一致，查询优化器会自己调整顺序，mysql查询优化器会判断纠正这条sql语句该以什么样的顺序执行效率最高，最后才生成真正的执行计划。所以，当然是我们能尽量的利用到索引时的查询顺序效率最高咯，所以mysql查询优化器会最终以这种顺序进行查询执行
:::
### 8：查询数据量过大
mysql 通过索引扫描的行记录数超过全表的10%~30% 左右，优化器也可能不会走索引，自动变成全表扫描。
### 9：字符集不统一
字符集如果不同，会存在隐式的转换，索引也会失效，所有应该使用相同的字符集，防止这种情况发生。

### 10：范围索引列没有放到最后
例如联合索引 name,age,height 其中 age需要范围查询（14-18）岁的学生，这时候，要把age放到联合索引列的最后（**范围查询放最后，指的是联合索引中的范围列放在最后，不是指where条件中的范围列放最后。如果联合索引中的范围列放在最后了，即使where条件中的范围列没放最后也能正常走到索引**）

## Mysql索引调优
- 1：优先使用唯一索引
- 2：为常用查询字段建立索引
- 3：为排序，分组和联合字段建立索引
- 4：一张表的索引数量不超过5个
- 5：表数据量少，可以不用建立索引
- 6：尽量使用占用空间小的字段建立索引
- 7：删除没用的索引
- 8：在可以使用主键id的表中，尽量使用自增主键id，这样可以避免页分裂
  - 主键最好不要使用uuid，因为uuid的值太过离散，不适合排序且可能出现新增加记录的uuid，会插入在索引树中间的位置，出现页分裂（比如之前的索引已经紧凑的排列在一起了，你此时需要在已经紧凑排列好的数据中插入数据就会导致前面已经排好序的索引出现松动和重构排序，但是使用自增id就不会出现这种情况了），导致索引树调整复杂度变大，消耗更多的时间和资源。但是使用自增主键就可以避免出现页分裂，因为自增主键后面的主键值是要比前面的大， 那后来的数据直接放在后面就行；

  - 聚簇索引的数据的物理存放顺序与索引顺序是一致的，即：只要索引是相邻的，那么对应的数据一定也是相邻地存放在磁盘上的。如果主键不是自增id，它会不断地调整数据的物理地址、分页，当然也有其他一些措施来减少这些操作，但却无法彻底避免。但如果是自增的id，它只需要一 页一页地写，索引结构相对紧凑，磁盘碎片少，效率也高。

- 9：查询的时候尽量不要使用select * ，这样可以避免大量的回表
- 10：尽量少使用子查询，能使用外连接就使用外连接，这样可以避免产生笛卡尔集
- 11：能使用短索引就是用短索引，这样可以在非叶子节点存储更多的索引列降低树的层高，并且减少空间的开销；
- 12：频繁更新的字段不适合建立索引
因为数据比较大的表的索引的创建是非常耗时的，而且如果一个字段被频繁更新那么我们还需要频繁的维护这个树的结构，这个开销是非常大的
- 13：适当使用前缀索引
对于 BLOB、TEXT 和 VARCHAR 类型的列，可以使用前缀索引，只索引开始的部分字符。 对于前缀长度的选取需要根据索引选择性来确定。

## explain的type类型的理解

| type类型 | 解释                                                             |
|--------|----------------------------------------------------------------|
| const  | 查找主键索引，返回的数据至多一条（0或者1条），属于精确查找                                 |
| eq_ref | 查找唯一性索引，返回的数据至多一条（0或者1条），属于精确查找                                |
| ref    | 查找非唯一性索引，返回匹配某一条件的多条数据，数据返回可能是多条，属于精确查找                        |
| range  | 查找某个索引的部分索引，一般在where子句中使用 < 、>、in、between等关键词，只检索给定范围的行，属于范围查找 |
| index  | 查找所有的索引树，比ALL要快的多，因为索引文件要比数据文件小的多，ALL不使用任何索引，进行全表扫描，性能最差       |
| all    | 全表扫描                                                           |
| null   | -                                                              |

参考：
https://blog.csdn.net/weixin_42039228/article/details/123255722
