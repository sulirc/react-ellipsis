import React, { useState, useLayoutEffect, useRef, useCallback } from "react";
import "./TextEllipsis.scss";

export const ELLIPSIS = {
  TRUNCATED: "TRUNCATED",
  NOT_TRUNCATED: "NOT_TRUNCATED",
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
  const elliLessTextRef = useRef(null);
  const elliMoreRef = useRef(null);
  const text = useRef({
    chunks: null,
    lastChunk: null,
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
    const elliText = elliLessTextRef.current;
    elliText.innerHTML = children;
  }, [children]);

  const resetToTrunc = useCallback(() => {
    const elliText = elliLessTextRef.current;
    const elli = text.current;
    elliText.innerHTML = elli.truncText;
  }, [children]);

  const showMore = useCallback(() => {
    reset();
    setIsExpand(true);
    elliMoreRef.current.style.display = "none";
  }, [reset, setIsExpand]);

  const showLess = useCallback(() => {
    resetToTrunc();
    setIsExpand(false);
    elliMoreRef.current.style.display = "inline-block";
  }, [resetToTrunc, setIsExpand]);

  const truncate = useCallback(() => {
    const container = ref.current;
    const elliText = elliLessTextRef.current;
    const elli = text.current;

    // use memoize cache
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

  const process = useCallback(() => {
    const container = ref.current;
    const elliMore = elliMoreRef.current;

    elliMore && (elliMore.style.display = "none");

    if (container.offsetHeight > maxElliHeight) {
      elliMore && (elliMore.style.display = "inline-block");
      truncate();
      setIsOverflow(true);
      onElliResult(ELLIPSIS.TRUNCATED);
    } else {
      elliMore && (elliMore.style.display = "inline-block");
      setIsOverflow(false);
      onElliResult(ELLIPSIS.NOT_TRUNCATED);
    }
  }, [maxElliHeight, truncate, onElliResult]);

  useLayoutEffect(() => {
    if (isTruncDone) {
      return;
    }

    // make sure elliMore node should exist.
    if (!elliMoreRef.current) {
      console.warn("elliMoreRef not exists");
      return;
    }

    reset();
    process();
  }, [isTruncDone, reset, process]);

  if (!children) {
    return;
  }

  const elliMoreStyle = isTruncDone
    ? {
        float: "right",
        display: "block",
      }
    : {
        display: "inline-block",
      };

  return (
    <div
      ref={ref}
      className={`ellipsis-box with-${
        isExpand ? "expand" : "collapse"
      } ${className}`}
      style={ellipsisStyle}
    >
      <div className="truncate-text">
        <span className="text-box" ref={elliLessTextRef} />
        {isOverflow && (
          <div
            ref={elliMoreRef}
            style={elliMoreStyle}
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
