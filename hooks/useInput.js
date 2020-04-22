import { useState } from 'react';

export default init => {
  const [input, setInput] = useState(init);
  const handleInputChange = e => setInput(e.currentTarget.value);
  return [input, handleInputChange, setInput];
};
