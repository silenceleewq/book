# chapter2
![Alt text](1560999346127.png)
## 2.1 信息储存
字节 (byte): 8位的块, 最小的可寻址的内存单位.每次寻址至少是一个字节, 多则4个字节, 8个字节等.

虚拟内存(virtual memory): 机器级程序将内存视为一个非常大的字节数组, 这就叫做虚拟内存.(内存本身不是字节数组, 所以这个非常大的字节数组被称为虚拟的.)

地址 (address): 内存的每个字节都由一个唯一的数字来标识, 称为地址.

虚拟地址空间 (virtual address space): 所有的地址 (address) 的集合就称为 虚拟地址空间.

程序对象 (program object): 程序数据, 指令和控制信息.


## 2.1.1 十六进制表示法

十六进制数 (hexadecimal): 以 16 为基数, 满16进1. 因为二进制太冗长, 十进制与位模式的互相转换太麻烦, 所以用Hex. 0~9 A~F, 以 0X 或 0x 开头的数字.

练习题:

A. 将 0x39A7F8 转换为二进制    
B. 将二进制 1100100101111011 转换为十六进制.  
C. 将 0xD5E4C 转换为二进制.  
D. 将二进制 1001101110011110110101 转换为十六机制.  

解:    
A. 0x39A7F8 -> 0011 1001 1010 0111 1111 1000   
B. 1100 1001 0111 1011 -> 0xC97B  
C. 0xD5E4C -> 1101 0101 1110 0100 1100  
D. 10 0110 1110 0111 1011 0101 -> 0x26E7B5



当值 _x_ 是 2 的非负整数 _n_ 次幂时, 可以写成 n = i + 4j 的形式, 0 ≤ i ≤ 3, 可以把 _x_ 写成开头为16进制数: 1(i=0), 2(i=1), 4(i=2), 8(i=3), 后面跟着 _j_ 十六进制的0. 比如: _x_ = 2048 = 2<sup>11</sup>, n = 11 = 3 + 4 · 2. 从而得到十六进制: 0x800.
> 个人理解: 因为十六进制的1位需要用4位二进制来表示. 所以当 _j_ 为 1 的时候, 意味着有4个0, j 为 2的时候, 有8个0, i 只有4种情况, 0001, 0010, 0100, 1000, 分别对应了, 1, 2, 4, 8, 所以, i 只能取 0 到 3 之间. 因为 2<sup>0-3</sup> = [1, 2, 4, 8].  大致就是这个原理.

练习题:  
| n |  2 <sup>n</sup> (十进制) | 2 <sup>n</sup> (十六进制) |   
| --| -- | -- |



