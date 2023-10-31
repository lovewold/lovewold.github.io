#  leetcode刷题日记做菜顺序

原题链接：[ 做菜顺序](https://leetcode.cn/problems/reducing-dishes/)

一个厨师收集了他 `n` 道菜的满意程度 `satisfaction` ，这个厨师做出每道菜的时间都是 1 单位时间。

一道菜的 「 **like-time 系数** 」定义为烹饪这道菜结束的时间（包含之前每道菜所花费的时间）乘以这道菜的满意程度，也就是 `time[i]`*`satisfaction[i]` 。

返回厨师在准备了一定数量的菜肴后可以获得的最大 **like-time 系数** 总和。

你可以按 **任意** 顺序安排做菜的顺序，你也可以选择放弃做某些菜来获得更大的总和。

**示例 1：**

```
输入：satisfaction = [-1,-8,0,5,-9]
输出：14
解释：去掉第二道和最后一道菜，最大的 like-time 系数和为 (-1*1 + 0*2 + 5*3 = 14) 。每道菜都需要花费 1 单位时间完成。
```

**示例 2：**

```
输入：satisfaction = [4,3,2]
输出：20
解释：可以按照任意顺序做菜 (2*1 + 3*2 + 4*3 = 20)
```

**示例 3：**

```
输入：satisfaction = [-1,-4,-5]
输出：0
解释：大家都不喜欢这些菜，所以不做任何菜就可以获得最大的 like-time 系数。
```

​	这道题首先看到时候直接看示例，题目中首先给出了做菜的顺序可以选择，还可以选择不做菜，即保证**like-time**的最大值。我们很容易就想到贪心，这道题也就是典型的保证最大值的贪心思维。

​	首先要理解第一个关键点，要保证like-time值最大首先要保证==最大值*最大系数==，最大系数也就是做菜的顺序，即保证like值最大的菜最后做，大大相乘保证最大，小小相乘保证最小。

​	第二个关键点，负like值菜会影响两个值的变化，一个是做菜数量的变化一个是做菜顺序的变化。即负like值先做会引起后面菜的顺序延后，系数增大。

​	因此对于这道题，我们首先要保证两个点，先去定一个较大值，在通过调整负like菜品的做菜顺序观察是否会引起like-time的增加，再逐步调整。

**第一步排序**：保证低like值在低位，高like值在高位

![image-20231026224100521](C:/Users/%E9%BB%8E%E7%A5%A5%E6%96%87/Desktop/leetcode-%E7%AC%94%E8%AE%B0/%E6%9C%AC%E5%9C%B0%E5%9B%BE%E5%BA%8A/image-20231026224100521.png)

**第二步划分**：有负值like才会通过增加负值like*低系数来增加做菜数目进而调整高位系数。==换句话说无负值like值按照排序了后进行做菜即能保证最大==

进行负数统计，在负值计入做菜后，要保证负值like*低位影响最小，需要按照排序了后的顺序依次向前模拟;

即==0\*1+5\*2 = 10==为第一次模拟，接着向前模拟，保证最大值的贪心进行模拟。此时假设最大值max=10;

==-1\*1+0\*2+5\*3=14==为第二次模拟，接着向前模拟，以保证能继续获得最大like-time。此时最大值max=14更新；

==-9\*1+-1\*2+0\*3+5\*4=9==为第三次模拟，接着就算继续向前模拟，也不能保证获得最大like-time。此时最大值14不更新。程序结束返回max;

**实现细节**：首先我们需要排序了后统计负值，统计负值的个数也就是正值出现的第一次下标。

```c
#include<stdlib.h>
#include<stdio.h>
#include<malloc.h>
int cmp(const void* a, const void* b)
{
    return (*(int*)a - *(int*)b);
}
int maxSatisfaction(int* satisfaction, int satisfactionSize)
{
    int* tmp = (int*)malloc(satisfactionSize*4);
    memcpy(&tmp, &satisfaction, sizeof(int));//开辟空间拷贝原数组
    qsort(tmp, satisfactionSize, 4, cmp);//排序了
    int i = 0;
    int flog = 0;
    int sum = 0;
    int like_time = 0;
    int max = 0;
    for (i = 0; i < satisfactionSize; i++)
    {
        if (satisfaction[i] < 0)
        {
            flog++;
        }
        else
        {
            break;
        }
    }
    for (int j = 1; j <= satisfactionSize - flog; j++)
    {
        sum += satisfaction[j + flog - 1] * j;
    }
    if (max < sum)
    {
        max = sum;
    }
    while (flog > 0)
    {
        flog--;
        for (int j = 1; j <= satisfactionSize - flog; j++)
        {
            like_time += satisfaction[j + flog - 1] * j;
        }
        if (like_time < max)
        {
            like_time = max;
            break;
        }
        else
        {
            max = like_time;
            like_time = 0;
        }
    }
    if (like_time < max)
    {
        like_time = max;
    }
    free(tmp);

    return max;
}
```

