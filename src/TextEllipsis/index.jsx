import React, { useState, useLayoutEffect, useRef } from "react";
import "./index.scss";

export const ELLIPSIS = {
  TRUNCATED: "TRUNCATED",
  NOT_TRUNCATED: "NOT_TRUNCATED",
};

export default function TextEllipsis({
  children,
  className,
  expand,
  ellipsisChar = "...",
  ellipsisMore = "Show More",
  ellipsisLess = "Show Less",
  lines,
  lineHeight = `18px`,
}) {
  const [isExpand, setIsExpand] = useState(expand);
  const ref = useRef(null);
  const elliTextRef = useRef(null);
  const elliMoreRef = useRef(null);
  const text = useRef({
    chunks: null,
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
  const showMore = () => setIsExpand(true);
  const showLess = () => setIsExpand(false);

  const process = () => {
    const container = ref.current;
    if (container.offsetHeight > maxElliHeight) {
      truncate();
    }
  };
  const truncate = () => {
    const container = ref.current;
    const elliText = elliTextRef.current;
    const elli = text.current;
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
      return;
    }

    truncate();
  };

  useLayoutEffect(() => {
    if (isExpand) {
      return;
    }
    try {
      text.current.elliMoreWidth = elliMoreRef.current.offsetWidth;
    } catch (err) {
      text.current.elliMoreWidth = 0;
    }

    process();
  }, [isExpand]);

  return (
    <div ref={ref} className={`ellipsis-box ${className}`} style={ellipsisStyle}>
      <div
        className="truncate-text"
        style={{
          display: isExpand ? "none" : "block",
        }}
      >
        <span ref={elliTextRef}>{children}</span>
        <span ref={elliMoreRef} className="show-more" onClick={showMore}>
          {ellipsisMore}
        </span>
      </div>
      <div
        className="more-text"
        style={{
          display: isExpand ? "block" : "none",
        }}
      >
        <span>{children}</span>
        <span className="show-less" onClick={showLess}>
          {ellipsisLess}
        </span>
      </div>
    </div>
  );
}
