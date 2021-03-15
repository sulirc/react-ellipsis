import React, { useState } from "react";
import TextEllipsis from "./lib/TextEllipsis";
import {
  Text,
  LINES,
  defaultLineHeight,
  defaultLineType,
  defaultTextType,
} from "./config";
import "./App.scss";

function App() {
  const [lines, setLines] = useState(LINES[defaultLineType]);
  const [text, setText] = useState(Text[defaultTextType]);
  const [lineHeight, setLineHeight] = useState(defaultLineHeight);
  const handleOnElliResult = (status) => console.log(status);

  return (
    <>
      <div className="select-cantainer">
        <div className="select choose-lines">
          <label htmlFor="line">选择行数</label>
          <select
            name="line"
            defaultValue={defaultLineType}
            onChange={(e) => setLines(LINES[e.target.value])}
          >
            {Object.keys(LINES).map((type) => (
              <option key={type} value={type}>
                {LINES[type]}
              </option>
            ))}
          </select>
        </div>
        <div className="select choose-text">
          <label htmlFor="text">选择文本</label>
          <select
            name="text"
            defaultValue={defaultTextType}
            onChange={(e) => setText(Text[e.target.value])}
          >
            {Object.keys(Text).map((type) => (
              <option key={type} value={type}>
                {type.toUpperCase()}
              </option>
            ))}
          </select>
        </div>

        <div className="select choose-lineheight">
          <label htmlFor="lineHeight">选择行高</label>
          <input
            type="range"
            id="lineHeight"
            name="line-height"
            min="18"
            max="24"
            defaultValue={defaultLineHeight}
            step="1"
            onChange={(e) => setLineHeight(e.target.value)}
          />
        </div>
      </div>
      <div className="box">
        <div className="count-wrapper">
          <span className="count">line-height: {lineHeight}px</span>
        </div>
        <TextEllipsis
          className="ellipsis-demo"
          lines={lines}
          onElliResult={handleOnElliResult}
          lineHeight={lineHeight + "px"}
          ellipsisChar="... "
          showMoreJsx={<div className="my-more-action">👇 展开看更多</div>}
          showLessJsx={<div className="my-less-action">👏 收起来更美</div>}
        >
          {text}
        </TextEllipsis>
      </div>
    </>
  );
}

export default App;
