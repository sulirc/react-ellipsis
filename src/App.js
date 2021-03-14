import React, { useState, useEffect } from "react";
import TextEllipsis from "./lib/TextEllipsis";
import "./App.scss";

const Text = {
  zh: `JavaScript (簡稱 JS) 是具有一級函數 (First-class functions) 的輕量級、直譯式或即時編譯（JIT-compiled）的程式語言。它因為用作網頁的腳本語言而大為知名，但也用於許多非瀏覽器的環境，像是 node.js、Apache CouchDB。JavaScript 是一個基於原型的 (Prototype-based)、多範型的、動態語言，支援物件導向、指令式以及宣告式 (如函數式程式設計) 風格。 閱讀關於 JavaScript 以取得更多資訊。本章節主要說明 JavaScript，不涉及網頁特有項目或主機環境。有關網頁特有的 APIs ，請參考 Web API 和 DOM。JavaScript 所採用的標準是 ECMAScript，自 2012 年起，所有現代的瀏覽器均已全面支援 ECMAScript 5.1。較老舊的瀏覽器最少也會支援 ECMAScript 3。ECMA International 於 2015 年 6 月 17 日發布第六版的 ECMAScript，其正式名稱是 ECMAScript 2015，原先被稱作 ECMAScript 6 或 ES6。從那時起， ECMAScript 標準的發布週期是一年，本文件參考了最新的草稿版本，也就是目前的 ECMAScript 2017。`,
  en: `JavaScript (JS) is a lightweight, interpreted, or just-in-time compiled programming language with first-class functions. While it is most well-known as the scripting language for Web pages, many non-browser environments also use it, such as Node.js, Apache CouchDB and Adobe Acrobat. JavaScript is a prototype-based, multi-paradigm, single-threaded, dynamic language, supporting object-oriented, imperative, and declarative (e.g. functional programming) styles. Read more about JavaScript.This section is dedicated to the JavaScript language itself, and not the parts that are specific to Web pages or other host environments. For information about API specifics to Web pages, please see Web APIs and DOM.`,
  jp: `JavaScript (JS) は軽量で、軽量なインタープリター型、あるいは実行時コンパイルされる、第一級関数を備えたプログラミング言語です。ウェブページでよく使用されるスクリプト言語として知られ、多くの非ブラウザー環境、例えば Node.js や Apache CouchDB や Adobe Acrobat などでも使用されています。JavaScript は プロトタイプベース で、シングルスレッドで、動的型付けを持ち、そしてオブジェクト指向、命令形、宣言的 (例えば関数プログラミング) といったスタイルをサポートするマルチパラダイムのスクリプト言語です。詳しくは JavaScript についてをお読みください。この章では JavaScript 言語自体について、すなわちウェブページや他のホスト環境に限定されないコアの部分に限定して解説しています。ウェブページ特有の API 群の情報を得たい場合は Web API と DOM を参照してください。`,
  en2:
    "Well, anytime a React component prop or state changes, it’s going to get re-rendered. And that React component that has changed, will force any other children React components to re-render as well.",
};

const defaultLineHeight = "20";
const defaultFontSize = "16";
const defaultLineType = "m";
const LINES = {
  s: 3,
  m: 5,
  l: 8,
  xl: 12,
  xxxl: 100,
};

function App() {
  const [lines, setLines] = useState(LINES[defaultLineType]);
  const [text, setText] = useState(Text.zh);
  const [lineHeight, setLineHeight] = useState(defaultLineHeight);
  const [fontSize, setFontSize] = useState(defaultFontSize);
  const handleOnElliResult = (status) => console.log(status);

  return (
    <>
      <div className="select-cantainer">
        <select className="select choose-lines" defaultValue={defaultLineType} onChange={(e) => setLines(LINES[e.target.value])}>
          {Object.keys(LINES).map((type) => (
            <option key={type} value={type}>
              {LINES[type]} 行
            </option>
          ))}
        </select>
        <select className="select choose-text" defaultValue="zh" onChange={(e) => setText(Text[e.target.value])}>
          {Object.keys(Text).map((type) => (
            <option key={type} value={type}>
              {type.toUpperCase()} 文本
            </option>
          ))}
        </select>
        <div className="select choose-lineheight">
          <label htmlFor="lineHeight">LineHeight({lineHeight}px)</label>
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
        <div className="select choose-lineheight">
          <label htmlFor="fontSize">FontSize({fontSize}px)</label>
          <input
            type="range"
            id="fontSize"
            name="line-height"
            min="15"
            max="20"
            defaultValue={defaultFontSize}
            step="1"
            onChange={(e) => setFontSize(e.target.value)}
          />
        </div>
      </div>
      <div className="box">
        <TextEllipsis
          className="ellipsis-demo"
          lines={lines}
          onElliResult={handleOnElliResult}
          lineHeight={lineHeight + "px"}
          fontSize={fontSize + "px"}
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
