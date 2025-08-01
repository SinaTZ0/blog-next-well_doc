"use client";
import React, { useState, useEffect, ReactNode, ReactElement, cloneElement } from "react";

type AnimatePresenceProps = {
  children: ReactNode;
  duration: number; // in milliseconds
  mountClass: string;
  unmountClass: string;
};

type Item = {
  key: string | number;
  element: ReactElement;
  status: "entering" | "present" | "exiting";
};

export default function AnimatePresence({ children, duration, mountClass, unmountClass }: AnimatePresenceProps) {
  const childArray = React.Children.toArray(children) as ReactElement[];
  const [items, setItems] = useState<Item[]>(
    childArray.map((child) => ({
      key: child.key ?? Math.random(),
      element: child,
      status: "entering",
    }))
  );

  // Handle new children
  useEffect(() => {
    const nextKeys = childArray.map((child) => child.key);
    setItems((prevItems) => {
      const updated: Item[] = [];

      // Keep existing and mark exiting if removed
      prevItems.forEach((item) => {
        if (nextKeys.includes(item.key.toString())) {
          // still present
          const matchingChild = childArray.find((child) => child.key === item.key)!;
          updated.push({ ...item, element: matchingChild, status: item.status === "entering" ? "entering" : "present" });
        } else {
          // removed, mark exit
          updated.push({ ...item, status: "exiting" });
        }
      });

      // Add new children
      childArray.forEach((child) => {
        if (!prevItems.find((item) => item.key === child.key)) {
          updated.push({ key: child.key ?? Math.random(), element: child, status: "entering" });
        }
      });

      return updated;
    });
  }, [children]);

  // Cleanup exiting items after duration
  useEffect(() => {
    const exits = items.filter((item) => item.status === "exiting");
    if (exits.length > 0) {
      const timeout = setTimeout(() => {
        setItems((prev) => prev.filter((i) => i.status !== "exiting"));
      }, duration);
      return () => clearTimeout(timeout);
    }
  }, [items, duration]);

  return (
    <>
      {items.map((item) => {
        const className = item.status === "exiting" ? unmountClass : mountClass;
        return (
          <div key={item.key} className={`${className} transition-all duration-[${duration}ms]`}>
            {cloneElement(item.element, { key: item.key })}
          </div>
        );
      })}
    </>
  );
}
