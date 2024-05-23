import { useEffect, useRef } from 'react';

// Custom hook to detect clicks outside a specified element

export function useOutsideClick(
  initialRef:any,
  deps:any,
  callback:any
) {
  const newRef = useRef(null);
  const ref = initialRef || newRef;

  useEffect(() => {
    function handleClickOutside(event:any) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, ...deps]);
};
