import React, { useState, useLayoutEffect, useRef } from "react";
import "./index.scss";

export const ELLIPSIS = {
  TRUNCATED: "TRUNCATED",
  NOT_TRUNCATED: "NOT_TRUNCATED",
};

export default function TextEllipsis({
  children,
  className,
  isExpand,
  ellipsisChar = "...",
  ellipsisMore = "Show More",
  ellipsisLess = "Show Less",
  lines,
  lineHeight = `18px`,
  onResult = () => {},
}) {
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

  const process = () => {
    const container = ref.current;
    if (container.offsetHeight > maxElliHeight) {
      console.log("overflow");
      truncate();
    } else {
      console.log("normal");
    }
  };
  const truncate = () => {
    const container = ref.current;
    const elliText = elliTextRef.current;
    const elli = text.current;
    if (!elli.chunks) {
      elli.chunks = children.split(splitChar);
    }
    console.log(elli);
    if (elli.chunks.length > 1) {
      elli.lastChunk = elli.chunks.pop();
      elliText.innerHTML = elli.chunks.join(splitChar) + ellipsisChar;
    } else {
      elli.chunks = null;
    }

    if (elli.chunks) {
      if (container.offsetHeight <= maxElliHeight) {
        console.log("It fits");
        return;
      }
    }

    truncate();
  };

  useLayoutEffect(() => {
    text.current.elliMoreWidth = elliMoreRef.current.offsetWidth;

    process();
  }, []);

  return (
    <p ref={ref} className={`ellipsis-box ${className}`} style={ellipsisStyle}>
      <span ref={elliTextRef}>{children}</span>
      <span ref={elliMoreRef} className="show-more">
        {ellipsisMore}
      </span>
    </p>
  );
}
