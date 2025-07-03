---
title: Html5 Canvas 扫雷
date: 2011-03-14 12:27:26 + 0080
category: [Web开发]
tags: [Web, Design, GUI, Software Development, 大制作]
image: /assets/attachments/2011/03/14_122354_c02fgame.gif
---


扫雷是一个非常经典的游戏，记得在第一次接触的 **Windows 3.22** 上就有扫雷了，到现在的 **Win7**，依然保留着这个经典的游戏，结合 `Html5` `Canvas`，模仿 Win7 的 UI，将老板扫雷进行了升级。在 `FireFox`, `Chrome`, 和 `IE9` 下测试通过。  

### 设计的类
 `CellInfo`, `MineInfo`, `InfoProcess`, `CellRender`, `MineArea`, `GameInfo`, `GameStatus`, `Game`, `StorageInfo`, `GameStorage。`  


### 游戏模式  
1. Beginner 初级设置 Width:7 Height:7 Mine:10。  
1. Intermediate 中级设置 Width:15 Height:15 Mine:40。  
1. Expert 高级设置 Width:30 Height:15 Mine:99。  
1. Random 随机模式。  

### 自定义设置
1. Width 宽  
1. Height高  
1. Mine 雷的数量   

### 性能测试  
测试游戏在浏览器上的性能。  

### 游戏记录
存档和恢复游戏记录。  

### 游戏控制
1. Pause 暂停游戏。  
1. Save 存盘游戏。  

当点击 `Save` 存盘后,在 `GameStorage` 下面会记录当前游戏的缩略图。鼠标进入存盘缩略图,当前缩略图高亮一个小红边,点击左键恢复存盘点,点击右键删除存盘点.  

[**在线试玩**](/assets/playground/canvas-mine-sweeper/canvas-mine-sweeper.html){:target="_blank"}    
[**源代码**](/assets/attachments/2011/03/14_122602_2yq5MineSweeper.zip) 
