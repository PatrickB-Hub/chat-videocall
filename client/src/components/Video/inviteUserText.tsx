import React, { useState } from "react";

const InviteUserText: React.FC = () => {
  const [showCopiedMesssage, setShowCopiedMesssage] = useState(false);

  const copyToClipboard = () => {
    // show the "successful copy" tooltip for a second
    setShowCopiedMesssage(true);
    setTimeout(() => setShowCopiedMesssage(false), 1000);
    // the text that is to be copied to the clipboard
    const URL = document.location.href;

    // create hidden div element
    const hiddenCopy = document.createElement("div");
    hiddenCopy.innerHTML = URL;
    // initial position off the screen
    hiddenCopy.style.position = "absolute";
    hiddenCopy.style.left = "-9999px";

    // check and see if the user had a text selection range
    let currentRange;
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      // the user has a text selection range, store it
      currentRange = selection.getRangeAt(0);
      // remove the current selection
      selection.removeRange(currentRange);
    }

    // append the div to the body
    document.body.appendChild(hiddenCopy);
    // create a selection range
    var CopyRange = document.createRange();
    // set the copy range to be the hidden div
    CopyRange.selectNode(hiddenCopy);
    // add the copy range
    selection?.addRange(CopyRange);

    try {
      //copy the text
      document.execCommand("copy");
    } catch (err) {
      console.log(
        "Your browser does not support 'execCommand(\"copy\")'! Error : " + err
      );
    }
    // remove the selection range (Chrome throws a warning if we don't.)
    selection?.removeRange(CopyRange);
    // remove the hidden div
    document.body.removeChild(hiddenCopy);

    // return the old selection range
    if (currentRange) {
      selection?.addRange(currentRange);
    }
  };

  return (
    <div className="md:col-span-4 md:row-span-2 md:row-start-2 md:pt-0 pt-8 text-center">
      <p className="text-2xl text-gray-800 font-semibold font-">
        Send the{" "}
        <span
          onClick={copyToClipboard}
          className="has-tooltip bg-gray-100 rounded px-1 cursor-pointer"
        >
          <span className="tooltip rounded text-sm shadow-md p-1 bg-gray-100 text-gray-600 -mt-10 transform -translate-x-12">
            {showCopiedMesssage
              ? "Copied to clipboard!"
              : "Click to copy the URL"}
          </span>
          URL
        </span>{" "}
        to your friends or click on an active user to invite them.
      </p>
    </div>
  );
};

export default InviteUserText;
