import React, { useState, useEffect } from "react";
import TextEllipsis from "./TextEllipsis";
import "./App.scss";

const Text = {
  zh:
    "開發者工具都設計為易於擴展的。Firefox 附加元件可以取用開發者工具與其元件，擴展現有工具或加入新工具。使用遠端除錯協定，可以建立自己的除錯用戶端與伺服器，讓你可以使用自己的工具為網站除錯，或針對不同的目標平台應用 Firefox 工具。",
  zhLong: `JavaScript (簡稱 JS) 是具有一級函數 (First-class functions) 的輕量級、直譯式或即時編譯（JIT-compiled）的程式語言。它因為用作網頁的腳本語言而大為知名，但也用於許多非瀏覽器的環境，像是 node.js、Apache CouchDB。JavaScript 是一個基於原型的 (Prototype-based)、多範型的、動態語言，支援物件導向、指令式以及宣告式 (如函數式程式設計) 風格。 閱讀關於 JavaScript 以取得更多資訊。本章節主要說明 JavaScript，不涉及網頁特有項目或主機環境。有關網頁特有的 APIs ，請參考 Web API 和 DOM。JavaScript 所採用的標準是 ECMAScript，自 2012 年起，所有現代的瀏覽器均已全面支援 ECMAScript 5.1。較老舊的瀏覽器最少也會支援 ECMAScript 3。ECMA International 於 2015 年 6 月 17 日發布第六版的 ECMAScript，其正式名稱是 ECMAScript 2015，原先被稱作 ECMAScript 6 或 ES6。從那時起， ECMAScript 標準的發布週期是一年，本文件參考了最新的草稿版本，也就是目前的 ECMAScript 2017。`,
};

const defaultLines = "m";
const LINES = {
  s: 3,
  m: 5,
  l: 8,
  xl: 12,
};

function App() {
  const [lines, setLines] = useState(LINES[defaultLines]);
  const changeVisibleLines = (e) => {
    setLines(LINES[e.target.value]);
  };
  const handleOnElliResult = (status) => console.log(status);

  return (
    <>
      <label className="select-lines">
        选择显示行数：
        <select name="select" defaultValue={defaultLines} onChange={changeVisibleLines}>
          <option value="s">3</option>
          <option value="m">5</option>
          <option value="l">8</option>
          <option value="xl">12</option>
        </select>
      </label>

      <div className="box">
        <TextEllipsis 
          expand
          className="ellipsis-demo" 
          lines={lines} 
          onElliResult={handleOnElliResult}>
          {Text.zh}
        </TextEllipsis>
      </div>
    </>
  );
}

export default App;
