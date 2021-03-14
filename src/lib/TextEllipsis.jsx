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
    currentText: null,
    truncText: null,
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
  }, [children]);

  const resetToTrunc = useCallback(() => {
    textRef.current.innerHTML = text.current.truncText;
  }, []);

  const showMore = useCallback(() => {
    reset();
    setIsExpand(true);
    moreRef.current.style.display = "none";
  }, [reset, setIsExpand]);

  const showLess = useCallback(() => {
    resetToTrunc();
    setIsExpand(false);
    moreRef.current.style.display = "inline-block";
  }, [resetToTrunc, setIsExpand]);

  const truncate = useCallback(() => {
    const container = ref.current;
    const elliText = textRef.current;
    const elli = text.current;

    if (elli.truncText) {
      elliText.innerHTML = elli.truncText;
      return;
    }

    if (!elli.chunks) {
      elli.chunks = children.split(splitChar);
    }

    if (elli.chunks.length > 1) {
      elli.lastChunk = elli.chunks.pop();
      elliText.innerHTML = elli.chunks.join(splitChar) + ellipsisChar;
    } else {
      elli.chunks = null;
    }

    if (elli.chunks && container.offsetHeight <= maxElliHeight) {
      elli.truncText = elliText.innerHTML;
      setIsTruncDone(true);
      return;
    }

    truncate();
  }, [maxElliHeight, children, ellipsisChar]);

  const changeMoreVisible = (visible) => {
    if (!moreRef.current) {
      return;
    }
    moreRef.current.style.display = visible ? "inline-block" : "none";
  };

  const process = useCallback(() => {
    text.current.currentText = children;

    changeMoreVisible(false);

    if (ref.current.offsetHeight > maxElliHeight) {
      changeMoreVisible(true);
      truncate();
      setIsOverflow(true);
      onElliResult(ELLIPSIS.TRUNCATED);
    } else {
      changeMoreVisible(true);
      setIsOverflow(false);
      onElliResult(ELLIPSIS.NOT_TRUNCATED);
    }
  }, [maxElliHeight, truncate, onElliResult, children]);

  useEffect(() => {
    if (isTruncDone) {
      return;
    }

    reset();
    process();
  }, [isTruncDone, reset, process, children]);

  useEffect(() => {
    console.log("text change old -> ", text.current.currentText);
    console.log("text change new -> ", children);
    // setIsTruncDone(false);
  }, [children]);

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
        {isOverflow && (
          <div
            ref={moreRef}
            style={isTruncDone ? MoreStyle.Float : MoreStyle.Normal}
            className="show-more"
            onClick={showMore}
          >
            {showMoreJsx}
          </div>
        )}
        {isOverflow && isExpand && (
          <div className="show-less" onClick={showLess}>
            {showLessJsx}
          </div>
        )}
      </div>
    </div>
  );
}

export default React.memo(TextEllipsis);
