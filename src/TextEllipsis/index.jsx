import React, { useState, useLayoutEffect, useRef, useCallback } from "react";
import "./index.scss";

export const ELLIPSIS = {
  TRUNCATED: "TRUNCATED",
  NOT_TRUNCATED: "NOT_TRUNCATED",
};

export default function TextEllipsis({
  children,
  className,
  ellipsisChar = "...",
  ellipsisMore = "Show More",
  ellipsisLess = "Show Less",
  lines,
  lineHeight = `18px`,
  onElliResult = () => {},
}) {
  const [isExpand, setIsExpand] = useState(false);
  const [isOverflow, setIsOverflow] = useState(true);
  const ref = useRef(null);
  const elliLessTextRef = useRef(null);
  const elliMoreRef = useRef(null);
  const text = useRef({
    chunks: null,
    elliMoreWidth: 0,
    lastChunk: null,
    truncText: null,
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
    elliMoreRef.current.style.display = "none";
  }, [reset, setIsExpand]);

  const showLess = () => {
    setIsExpand(false);
    elliMoreRef.current.style.display = "inline-block";
  };

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
    // only calculate when showLess
    if (isExpand) {
      return;
    }

    if (elliMoreRef.current) {
      text.current.elliMoreWidth = elliMoreRef.current.offsetWidth;
    } else {
      text.current.elliMoreWidth = 0;
    }

    reset();
    process();
  }, [reset, process, isExpand]);

  return (
    <div ref={ref} className={`ellipsis-box ${className}`} style={ellipsisStyle}>
      <div className="truncate-text">
        <span ref={elliLessTextRef}>{children}</span>
        {isOverflow && (
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
