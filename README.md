# react-hook-text-overflow :potable_water:

A React hook to determine if text is overflowing in an element [showing an ellipsis](https://developer.mozilla.org/en-US/docs/Web/CSS/text-overflow).

## Installation

Using `npm`:

```sh
npm install react-hook-text-overflow
```

Using `yarn`:

```sh
yarn add react-hook-text-overflow
```

## Usage

`react-hook-text-overflow` consist of three parts:

- There is an element for which it is to be determined whether its text is overflowing and the browser is showing an ellipsis.

- There is another element which may change in width, making the text overflow property of the first element change. The first element is wrapped inside this second element.

- There is a React context which stores and keeps track of the changes of the width of the second element.

Accordingly, the library exports three things:

- The `useEllipsisVisibleWrapper` which is to be used in the component where the second element is rendered. It returns an array of two items, the width of the wrapper element, and a callback ref which is to be set as the `ref` property of the wrapper element.

- The `EllipsisVisibleWrapperWidthContext` context which is to be used where `useEllipsisVisibleWrapper` is used (or one of its descendent components if you don't mind passing around the wrapper width value). Its provider must be rendered and its value must be set to the wrapper node's width returned by the `useEllipsisVisibleWrapper` hook.

- The `useEllipsisVisible` hook which returns an array of two items, a boolean which indicates whether the text is overflowing (and ellipsis is rendered), and a callback ref which is to be set as the `ref` property of the element in which the text potentially overflows.

For example:

```jsx
import {
  useEllipsisVisibleWrapper,
  EllipsisVisibleWrapperWidthContext,
  useEllipsisVisible,
} from "./useEllipsisVisible";

// The component in which text overflow is to be determined
const Ellipsis = () => {
  // Use the `useEllipsisVisible` hook and destructure the array it returns
  const [isEllipsisVisible, ellipsisVisibleRef] = useEllipsisVisible();
  return (
    <>
      {/*
        Assign `ellipsisVisibleRef` to the `ref` property
        of the element with the potentially overflowing text
      */}
      <p ref={ellipsisVisibleRef}>Potentially overflowing content here</p>
      {/*
        Use `isEllipsisVisible` to check whether the text is overflowing
      */}
      <p>{isEllipsisVisible ? "Text overflows" : "Text is visible"}</p>
    </>
  );
};

// The component of which the width may change that can cause
// the text overflow state in the `Ellipsis` component to change as well
const App = () => {
  const [isEllipsisBig, setIsEllipsisBig] = useState(true);

  // Use the `useEllipsisVisibleWrapper` hook and
  // destructure the array it returns
  const [wrapperNodeWidth, wrapperRef] = useEllipsisVisibleWrapper();

  return (
    // Assign `wrapperRef` to the `ref` property of the element that
    // of which the width may potentially change
    <div ref={wrapperRef} style={{ width: isEllipsisBig ? 600 : 200 }}>
      <button
        className="toggleButton"
        onClick={() => {
          setIsEllipsisBig(!isEllipsisBig);
        }}
      >
        Toggle wrapper width
      </button>
      {/*
        Wrap the `Ellipsis` component in the context provider
        and set its value to `wrapperNodeWidth`
      */}
      <EllipsisVisibleWrapperWidthContext.Provider value={wrapperNodeWidth}>
        <Ellipsis />
      </EllipsisVisibleWrapperWidthContext.Provider>
    </div>
  );
};
```

It is possible to use the `useEllipsisVisible` on multiple elements within the same wrapper without having to use the `useEllipsisVisibleWrapper` multiple times.

For example:

```jsx
import {
  useEllipsisVisibleWrapper,
  EllipsisVisibleWrapperWidthContext,
  useEllipsisVisible,
} from "./useEllipsisVisible";

const Ellipsis = () => {
  // Use the `useEllipsisVisible` hook multiple times
  const [isEllipsisVisible1, ellipsisVisibleRef1] = useEllipsisVisible();
  const [isEllipsisVisible2, ellipsisVisibleRef2] = useEllipsisVisible();
  return (
    <>
      <p ref={ellipsisVisibleRef1}>Potentially overflowing content here</p>
      <p>
        {isEllipsisVisible1 ? "Text overflows" : "Text is visible"} in the first
        paragraph.
      </p>
      <p ref={ellipsisVisibleRef2}>Potentially overflowing content here</p>
      <p>
        {isEllipsisVisible2 ? "Text overflows" : "Text is visible"} in the
        second paragraph
      </p>
    </>
  );
};

const App = () => {
  const [isEllipsisBig, setIsEllipsisBig] = useState(true);
  const [wrapperNodeWidth, wrapperRef] = useEllipsisVisibleWrapper();

  return (
    <div ref={wrapperRef} style={{ width: isEllipsisBig ? 600 : 200 }}>
      <button
        className="toggleButton"
        onClick={() => {
          setIsEllipsisBig(!isEllipsisBig);
        }}
      >
        Toggle wrapper width
      </button>
      <EllipsisVisibleWrapperWidthContext.Provider value={wrapperNodeWidth}>
        <Ellipsis />
      </EllipsisVisibleWrapperWidthContext.Provider>
    </div>
  );
};
```

# Caveats

`react-hook-text-overflow` relies on [`ResizeObserver`](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver) which is not supported by some older browsers. If your app supports such browsers, you might need to polyfill `ResizeObserver`.

## Contributions

Contributions are welcome. File bug reports, create pull requests, feel free to reach out at tothab@gmail.com.

## License

[MIT](./LICENSE)
