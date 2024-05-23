import { useEffect, useRef } from 'react';

// Custom hook to compare specified properties in any array of objects
// and apply callback to changed elements

export function useCompareArrayProperties(
  callback: any,
  items: any,
  watchProperties: any
) {
  const prevItemsRef = useRef([]);

  useEffect(() => {
    const changedElements = [];

    // Check if an item has been removed
    if (items.length < prevItemsRef.current.length) {
      // Update ref to current items for the next effect execution
      prevItemsRef.current = items.map((item:any) => {
        // Only copy watched properties to save memory and avoid unnecessary deep copying
        const newItem = {};
        for (let prop of watchProperties) {
          newItem[prop] = item[prop];
        }
        return newItem;
      });
      return; // Exit the effect without triggering the callback
    }
    
    // Iterate over current items to find changes based on watchProperties
    items.forEach((item:any, index:any) => {
      const prevItem = prevItemsRef.current[index];
      let isChanged = false;

      // Check if the item is new or if any of the watched properties have changed
      if (!prevItem) {
        isChanged = true; // Item is new
      }
      else {
        // Check each property in watchProperties
        for (let prop of watchProperties) {
          if (item[prop] !== prevItem[prop]) {
            isChanged = true;
            break; // Stop checking further if any property has changed
          }
        }
      }

      if (isChanged) {
        changedElements.push(item);
      }
    });

    // Update ref to current items for the next effect execution
    prevItemsRef.current = items.map((item:any) => {
      // Only copy watched properties to save memory and avoid unnecessary deep copying
      const newItem = {};
      for (let prop of watchProperties) {
        newItem[prop] = item[prop];
      }
      return newItem;
    });

    // Execute callback for each changed element
    changedElements.forEach((element) => {
      callback(element);
    });

    // Depend on items array, the callback, and dynamically on watched properties
  }, [items, callback, ...watchProperties]);
}
