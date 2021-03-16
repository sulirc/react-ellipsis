import React, { useState, useEffect, useRef } from "react";
import GraphemeSplitter from './GraphemeSplitter';
import "./TextEllipsis.scss";

export const splitter = new GraphemeSplitter();
export const ELLIPSIS = {
  TRUNCATED: "TRUNCATED",
  NOT_TRUNCATED: "NOT_TRUNCATED",
};

const style = {
  BlackFloat: {
    float: "right",
    display: "block",
  },
  InlineBlock: {
    display: "inline-block",
  },
  Hidden: {
    display: 'none',
  },
};

function joinStyle(x) {
  return Object.keys(x).map(key => `${key}:${x[key]};`).join(' ');
}

function TextEllipsis(props) {
  const {
    children,
    className,
    ellipsisChar = "...",
    showMoreJsx = "Show More",
    showLessJsx = "Show Less",
    lines = 5,
    fontSize = "15px",
    lineHeight = "18px",
  } = props;
  const [overflow, setOverflow] = useState(false);
  const [expand, setExpand] = useState(false);
  const textRef = useRef(null);
  const boxRef = useRef(null);
  const moreRef = useRef(null);
  const cacheRef = useRef({
    chunks: [],
    textCurrent: "",
    textTrunc: "",
  });
  const maxOffsetHeight = lines * parseInt(lineHeight);
  const rootStyle = {
    width: "100%",
    wordWrap: "break-word",
    fontSize,
    lineHeight,
    paddingBottom: overflow && expand ? lineHeight : 0,
  };
  const showMore = () => {
    setExpand(true);
  };
  const showLess = () => {
    setExpand(false);
  };

  const jsxMoreContainer = (
    <div ref={moreRef} style={style.InlineBlock} className="show-more" onClick={showMore}>
      {showMoreJsx}
    </div>
  );

  const jsxLessContainer = (
    <div className="show-less" onClick={showLess}>
      {showLessJsx}
    </div>
  );

  const clearCache = () => {
    cacheRef.current = {
      chunks: [],
      textCurrent: "",
      textTrunc: "",
    };
  };

  useEffect(() => {
    const cache = cacheRef.current;
    const text = textRef.current;
    const box = boxRef.current;

    function retryToGetFitText() {
      if (cache.chunks.length === 0) {
        cache.chunks = splitter.splitGraphemes(children);
      }

      while (!cache.textTrunc) {
        if (text.offsetHeight > maxOffsetHeight) {
          cache.chunks.pop();
          box.innerHTML = cache.chunks.join("") + ellipsisChar;
        } else {
          cache.textTrunc = cache.chunks.join("") + ellipsisChar;
          moreRef.current.style = joinStyle(style.BlackFloat);
        }
      }
    }

    clearCache();
    setExpand(false);
    setOverflow(false);
    moreRef.current.style = joinStyle(style.InlineBlock);
    box.innerHTML = children;

    if (box.offsetHeight > maxOffsetHeight) {
      setOverflow(true);
      retryToGetFitText();
    } else {
      setExpand(true);
      setOverflow(false);
    }
  }, [children, maxOffsetHeight, ellipsisChar]);

  return (
    <div className={`js-ellipsis-box ${className}`} style={rootStyle}>
      <div ref={textRef} className="origin-text" style={expand ? style.Hidden : {}}>
        <span className="text-box" ref={boxRef} />
        {jsxMoreContainer}
      </div>

      {expand && <div className="real-show-text">{children}</div>}
      {overflow && expand && jsxLessContainer}
    </div>
  );
}

export default React.memo(TextEllipsis);
