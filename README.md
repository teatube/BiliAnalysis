# BiliAnalysis
用于获取哔哩哔哩视频直链的tampermonkey脚本

[原教程地址](https://www.bilibili.com/video/BV1AP411x7YW)

# 基于原脚本的调整:
## 视频
- 按钮变大
- 支持了打开有活动（festival）页面当中，地址栏有bvid的视频的解析
    > 在页面内点击切换视频时，因为地址栏并没有改变，所以不会动
    > 直接打开活动页面时，地址栏没有bvid的值，所以不会动
    > 可能日后会随心情完善
## 直播
- 打开无后缀链接时也可以解析
  > 例如 https://live.bilibili.com/945677
- 展示所有可能的解析（点击展开/收回）
  > format 有 ts 和 fmp4 两种，根据直播间人数多少，解析链接数量会变多/变少；
  > 特别少的人的直播间只有 ts （对应原画），特别特别多的人的直播间只有 fmp4（阿b降本增效）；
  > 部分人（比如我）在 VRChat 内播放 fmp4 的解析链接时，会有声音不连贯的现象；而 ts 的解析链接对任何人都没有这个现象
- 有海报的直播间也可以正常显示按钮
  > 部分海报页首是主站而非直播的，原脚本对这种直播间没有做适配
