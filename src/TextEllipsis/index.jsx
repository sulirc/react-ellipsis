import React, { useState, useLayoutEffect, useRef, useCallback } from "react";
import "./index.scss";

export const ELLIPSIS = {
  TRUNCATED: "TRUNCATED",
  NOT_TRUNCATED: "NOT_TRUNCATED",
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
  const [isExpand, setIsExpand] = useState(expand);
  const [isOverflow, setIsOverflow] = useState(true);
  const ref = useRef(null);
  const elliLessTextRef = useRef(null);
  const elliMoreRef = useRef(null);
  const text = useRef({
    chunks: null,
    cacheChunks: null,
    elliMoreWidth: 0,
    lastChunk: null,
  });
  const splitChar = "";
  const ellipsisStyle = {
    width: "100%",
    wordWrap: "break-word",
    lineHeight,
  };
  const maxElliHeight = parseInt(lineHeight) * lines;
  const showMore = () => {
    reset();
    setIsExpand(true);
  };
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
        return;
      }

      truncate();
    },
    [maxElliHeight, children, ellipsisChar]
  );

  const process = useCallback(() => {
    const container = ref.current;
    console.log(lines, container.offsetHeight, maxElliHeight)
    if (container.offsetHeight > maxElliHeight) {
      truncate(true);
      setIsOverflow(true);
      onElliResult(ELLIPSIS.TRUNCATED);
    } else {
      setIsOverflow(false);
      onElliResult(ELLIPSIS.NOT_TRUNCATED);
    }
  }, [maxElliHeight, truncate, onElliResult, lines]);

  const reset = useCallback(() => {
    const elliText = elliLessTextRef.current;
    elliText.innerHTML = children;
  }, [children]);

  useLayoutEffect(() => {
    if (isExpand) {
      return;
    }
    reset();

    if (elliMoreRef.current) {
      text.current.elliMoreWidth = elliMoreRef.current.offsetWidth;
    }
    
    process();
  }, [children, isOverflow, isExpand, lines, process, reset]);

  return (
    <div ref={ref} className={`ellipsis-box ${className}`} style={ellipsisStyle}>
      <div className="truncate-text">
        <span ref={elliLessTextRef}>{children}</span>
        {isOverflow && !isExpand && (
          <span ref={elliMoreRef} className="show-more" onClick={showMore}>
            {ellipsisMore}
          </span>
        )}
        {isOverflow && isExpand && (
          <span className="show-less" onClick={showLess}>
            {ellipsisLess}
          </span>
        )}
      </div>
    </div>
  );
}
