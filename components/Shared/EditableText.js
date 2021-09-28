import React, { useState, useRef, useEffect } from 'react';

const EditableText = ({ update, inputType = 'text', text: textDefault }) => {
  const inputRef = useRef(null);
  const [inputVisible, setInputVisible] = useState(false);
  const [text, setText] = useState(textDefault);

  function onClickOutSide(e) {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      if (update) {
        update(text);
      }
      setInputVisible(false);
    }
  }
  useEffect(() => {
    if (!inputVisible && textDefault !== text) {
      console.log('default change', textDefault);
      setText(textDefault);
    }
    console.log(textDefault);
  }, [textDefault, inputVisible, text]);

  useEffect(() => {
    // Handle outside clicks on mounted state
    if (inputVisible) {
      document.addEventListener('mousedown', onClickOutSide);
    }

    // This is a necessary step to "dismount" unnecessary events when we destroy the component
    return () => {
      document.removeEventListener('mousedown', onClickOutSide);
    };
  });

  return (
    <>
      {inputVisible ? (
        <input
          ref={inputRef}
          value={text}
          onChange={e => {
            setText(e.target.value);
          }}
          type={inputType}
          onBlur={e => {
            if (update) {
              update(e.target.value);
            }
          }}
        />
      ) : (
        <span onClick={() => setInputVisible(true)}>{text}</span>
      )}
    </>
  );
};

export default EditableText; // We got our component!
