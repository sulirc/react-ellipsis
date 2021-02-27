import React, { useState, useLayoutEffect, useRef, useCallback, useEffect } from "react";
import "./index.scss";

export const ELLIPSIS = {
  TRUNCATED: "TRUNCATED",
  NOT_TRUNCATED: "NOT_TRUNCATED",
};

const STATE = {
  idle: "idle",
  normal: "normal",
  overflow: "overflow",
};

export default function TextEllipsis({
  children,
  className,
  expand = false,
  ellipsisChar = "...",
  ellipsisMore = "Show More",
  ellipsisLess = "Show Less",
  lines,
  lineHeight = `18px`,
  onElliResult = () => {},
}) {
  const [isExpand, setIsExpand] = useState(false);
  const [isOverflow, setIsOverflow] = useState(STATE.idle);
  const ref = useRef(null);
  const elliLessTextRef = useRef(null);
  const elliMoreRef = useRef(null);
  const text = useRef({
    chunks: null,
    cacheChunks: null,
    elliMoreWidth: 0,
    lastChunk: null,
    isInitialize: true,
    currentLines: lines,
  });
  const splitChar = "";
  const ellipsisStyle = {
    width: "100%",
    wordWrap: "break-word",
    lineHeight,
  };
  const maxElliHeight = parseInt(lineHeight) * lines;

  const reset = useCallback(() => {
    const elliText = elliLessTextRef.current;
    elliText.innerHTML = children;
  }, [children]);

  const showMore = useCallback(() => {
    reset();
    setIsExpand(true);
  }, [reset, setIsExpand]);

  const showLess = () => setIsExpand(false);

  const truncate = useCallback(
    (initialize = false) => {
      const container = ref.current;
      const elliText = elliLessTextRef.current;
      const elli = text.current;

      if (!elli.chunks || initialize) {
        const chunks = elli.cacheChunks ? elli.cacheChunks.concat() : children.split(splitChar);

        if (!elli.cacheChunks) {
          elli.cacheChunks = chunks.concat();
        }
        elli.chunks = chunks;
      }

      if (elli.chunks.length > 1) {
        elli.lastChunk = elli.chunks.pop();
        elliText.innerHTML = elli.chunks.join(splitChar) + ellipsisChar;
      } else {
        elli.chunks = null;
      }

      if (elli.chunks && container.offsetHeight <= maxElliHeight) {
        if (expand && elli.isInitialize) {
          showMore();
          elli.isInitialize = false;
        }
        return;
      }

      truncate();
    },
    [maxElliHeight, children, ellipsisChar, expand, showMore]
  );

  const process = useCallback(() => {
    const container = ref.current;
    const elliMore = elliMoreRef.current;

    elliMore && (elliMore.style.display = "none");

    if (container.offsetHeight > maxElliHeight) {
      elliMore && (elliMore.style.display = "inline-block");
      truncate(true);
      setIsOverflow(STATE.overflow);
      onElliResult(ELLIPSIS.TRUNCATED);
    } else {
      elliMore && (elliMore.style.display = "inline-block");
      setIsOverflow(STATE.normal);
      onElliResult(ELLIPSIS.NOT_TRUNCATED);
    }
  }, [maxElliHeight, truncate, onElliResult]);

  useLayoutEffect(() => {
    if (isExpand) {
      if (text.current.currentLines === lines) {
        return;
      }
    }
    text.current.currentLines = lines;

    if (elliMoreRef.current) {
      text.current.elliMoreWidth = elliMoreRef.current.offsetWidth;
    } else {
      text.current.elliMoreWidth = 0;
    }

    reset();
    process();
  }, [isExpand, lines, reset, process]);

  return (
    <div ref={ref} className={`ellipsis-box ${className}`} style={ellipsisStyle}>
      <div className="truncate-text">
        <span ref={elliLessTextRef}>{children}</span>
        {isOverflow === STATE.overflow && !isExpand && (
          <span ref={elliMoreRef} className="show-more" onClick={showMore}>
            {ellipsisMore}
          </span>
        )}
        {isOverflow === STATE.overflow && isExpand && (
          <span className="show-less" onClick={showLess}>
            {ellipsisLess}
          </span>
        )}
      </div>
    </div>
  );
}
