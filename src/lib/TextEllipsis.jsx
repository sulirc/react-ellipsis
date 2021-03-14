import React, { useState, useEffect, useRef, useCallback } from "react";
import "./TextEllipsis.scss";

export const ELLIPSIS = {
  TRUNCATED: "TRUNCATED",
  NOT_TRUNCATED: "NOT_TRUNCATED",
};

const MoreStyle = {
  Float: {
    float: "right",
    display: "block",
  },
  Normal: {
    display: "inline-block",
  },
};

function TextEllipsis({
  children,
  className,
  ellipsisChar = "...",
  showMoreJsx = "Show More",
  showLessJsx = "Show Less",
  lines,
  fontSize = "15px",
  lineHeight = "18px",
  onElliResult = () => {},
}) {
  const [isExpand, setIsExpand] = useState(false);
  const [isOverflow, setIsOverflow] = useState(true);
  const [isTruncDone, setIsTruncDone] = useState(false);
  const ref = useRef(null);
  const textRef = useRef(null);
  const moreRef = useRef(null);
  const text = useRef({
    chunks: null,
    lastChunk: null,
    currentText: "",
    truncText: "",
  });
  const splitChar = "";
  const ellipsisStyle = {
    width: "100%",
    wordWrap: "break-word",
    fontSize,
    lineHeight,
    paddingBottom: isExpand ? lineHeight : 0,
  };
  const maxElliHeight = parseInt(lineHeight) * lines;

  const reset = useCallback(() => {
    textRef.current.innerHTML = children;

    text.current.currentText = children;
    text.current.truncText = "";
    text.current.chunks = null;
    text.current.lastChunk = null;
  }, [children]);

  const resetToTrunc = useCallback(() => {
    textRef.current.innerHTML = text.current.truncText;
  }, []);

  const showMore = useCallback(() => {
    reset();
    setIsExpand(true);
  }, [reset, setIsExpand]);

  const showLess = useCallback(() => {
    resetToTrunc();
    setIsExpand(false);
  }, [resetToTrunc, setIsExpand]);

  const truncate = useCallback(() => {
    const container = ref.current;

    if (text.current.truncText) {
      textRef.current.innerHTML = text.current.truncText;
      return;
    }

    if (!text.current.chunks) {
      text.current.chunks = children.split(splitChar);
    }

    if (text.current.chunks.length > 1) {
      text.current.lastChunk = text.current.chunks.pop();
      textRef.current.innerHTML =
        text.current.chunks.join(splitChar) + ellipsisChar;
    } else {
      text.current.chunks = null;
    }

    if (text.current.chunks && container.offsetHeight <= maxElliHeight) {
      text.current.truncText = textRef.current.innerHTML;
      setIsTruncDone(true);
      return;
    }

    truncate();
  }, [maxElliHeight, children, ellipsisChar]);

  const process = useCallback(() => {
    reset();

    if (ref.current.offsetHeight > maxElliHeight) {
      truncate();
      setIsOverflow(true);
      onElliResult(ELLIPSIS.TRUNCATED);
    } else {
      setIsOverflow(false);
      onElliResult(ELLIPSIS.NOT_TRUNCATED);
    }
  }, [reset, maxElliHeight, truncate, onElliResult]);

  useEffect(() => {
    process();
  }, [children, reset, process]);

  useEffect(() => {
    console.log('watch -> ', isOverflow, isExpand);
  })

  const lessJsx = (
    <div className="show-less" onClick={showLess}>
      {showLessJsx}
    </div>
  );

  const moreJsx = (
    <div
      ref={moreRef}
      style={isTruncDone ? MoreStyle.Float : MoreStyle.Normal}
      className="show-more"
      onClick={showMore}
    >
      {showMoreJsx}
    </div>
  );

  return (
    <div
      ref={ref}
      className={`ellipsis-box with-${
        isExpand ? "expand" : "collapse"
      } ${className}`}
      style={ellipsisStyle}
    >
      <div className="truncate-text">
        <span className="text-box" ref={textRef} />
        {isOverflow && (isExpand ? lessJsx : moreJsx)}
      </div>
    </div>
  );
}

export default React.memo(TextEllipsis);
