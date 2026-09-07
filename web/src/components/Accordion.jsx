import { useState } from "react";

/**
 * Accessible accordion component.
 * @param {{ items: Array<{question: string, answer: string}> }} props
 */
export default function Accordion({ items }) {
  const [openIndex, setOpenIndex] = useState(null);

  const toggle = (index) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div className="accordion">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        const id = `accordion-${i}`;
        return (
          <div key={i} className={`accordion__item ${isOpen ? "accordion__item--open" : ""}`}>
            <button
              className="accordion__trigger"
              onClick={() => toggle(i)}
              aria-expanded={isOpen}
              aria-controls={`${id}-body`}
              id={`${id}-trigger`}
            >
              <span>{item.question}</span>
              <span className="accordion__chevron" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 6 8 10 12 6" />
                </svg>
              </span>
            </button>
            {isOpen && (
              <div
                className="accordion__body"
                role="region"
                id={`${id}-body`}
                aria-labelledby={`${id}-trigger`}
              >
                {item.answer}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
