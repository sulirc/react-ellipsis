# react-ellipsis

一言以蔽之，为了应付常见的此类需求（**超出 5 行情况出现 see more，see more 保持在第五行行末尾，即段落右下角**），特意写了这个 Demo 🤣。

```jsx
<TextEllipsis
  className="ellipsis-demo"
  lines={LINES[defaultLines]}
  onElliResult={handleOnElliResult}
  lineHeight="20px"
  ellipsisChar="... "
  showMoreJsx={<div className="my-more-action">👇 展开看更多</div>}
  showLessJsx={<div className="my-less-action">👏 收起来更美</div>}
>
  {Text.zh}
</TextEllipsis>
```

效果：

<img src="./images/elli_intro.gif" />

<p align="right">
  <img width="88" src="./images/elli.png" />
</p>

这个组件并没有发布，如果想用，拷贝即可，无须客气。希望可以节省您的时间。
