import React, { useState, useCallback, useContext, useEffect } from "react";

const EllipsisVisibleWrapperWidthContext = React.createContext();

const useEllipsisVisibleWrapper = () => {
  const [wrapperNode, setWrapperNode] = useState(null);
  const [wrapperNodeWidth, setWrapperNodeWidth] = useState(null);

  const wrapperRef = useCallback((node) => {
    if (node instanceof HTMLElement) {
      setWrapperNode(node);
    }
  }, []);

  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        if (entry.contentBoxSize) {
          // Firefox implements `contentBoxSize` as a single content rect, rather than an array
          const contentBoxSize = Array.isArray(entry.contentBoxSize)
            ? entry.contentBoxSize[0]
            : entry.contentBoxSize;
          setWrapperNodeWidth(contentBoxSize.inlineSize);
        }
      }
    });
    if (wrapperNode instanceof HTMLElement) {
      resizeObserver.observe(wrapperNode);
    }
    return () => {
      if (wrapperNode instanceof HTMLElement) {
        resizeObserver.unobserve(wrapperNode);
      }
    };
  }, [wrapperNode]);

  return [wrapperNodeWidth, wrapperRef];
};

const useEllipsisVisible = () => {
  const [overflowingNode, setOverflowingNode] = useState(null);
  const [isEllipsisVisible, setEllipsisVisible] = useState(false);
  const wrapperNodeWidth = useContext(EllipsisVisibleWrapperWidthContext);
  const ellipsisVisibleRef = useCallback((node) => {
    if (node instanceof HTMLElement) {
      setOverflowingNode(node);
    }
  }, []);

  useEffect(() => {
    if (wrapperNodeWidth !== null && overflowingNode instanceof HTMLElement) {
      setEllipsisVisible(
        overflowingNode.scrollWidth > overflowingNode.offsetWidth
      );
    }
  }, [overflowingNode, wrapperNodeWidth]);

  return [isEllipsisVisible, ellipsisVisibleRef];
};

export {
  useEllipsisVisibleWrapper,
  EllipsisVisibleWrapperWidthContext,
  useEllipsisVisible,
};
