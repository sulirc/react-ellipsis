import React, { useState } from "react";
import TextEllipsis from "./TextEllipsis";
// import TextEllipsis from "react-text-ellipsis";
import "./App.scss";

const text = `Now you can rename src/App.css to src/App.scss and update src/App.js to import src/App.scss. This file and any other file will be
automatically compiled if imported with the extension .scss or .sass. To share variables between Sass files, you can use Sass
imports. For example, src/App.scss and other component style files could include @import "./shared.scss"; with variable definitions.`;

function App() {
  const [isExpand, setIsExpand] = useState(false);

  return (
    <div className="box">
      <TextEllipsis
        className="ellipsis-demo"
        lines={5}
        isExpand={isExpand}
        // ellipsisMore={<span onClick={() => setIsExpand(true)}>Show More</span>}
        // ellipsisLess={<span onClick={() => setIsExpand(false)}>Show less</span>}
      >
        {text}
      </TextEllipsis>
      {/* <TextEllipsis
        lines={5}
        tag={"p"}
        ellipsisChars={"... Show More"}
        tagClass="text-el-demo"
        debounceTimeoutOnResize={200}
        useJsOnly={true}
        onResult={(result) => {
          if (result === TextEllipsis.RESULT.TRUNCATED) console.log("text get truncated");
          else console.log("text does not get truncated");
        }}
      >
        {text}
      </TextEllipsis> */}
    </div>
  );
}

export default App;
