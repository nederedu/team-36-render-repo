'use client';

import { useState } from 'react';
import styles from '../../styles/fhirDisplay.module.css';

export default function CollapsibleJson({ jsonObject }) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const resourceType = jsonObject.resourceType || 'Unknown Resource';
  const id = jsonObject.id || 'Unknown ID';
  const title = `${resourceType} ${id}`;

  return (
    <div className={styles.fhirItem}>
      {/* Toggle Button */}
      <button onClick={toggleExpand} className={styles.fhirToggleButton}>
        {isExpanded ? `Hide Details for ${title}` : `View Details for ${title}`}
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className={styles.fhirContent}>
          <pre className={styles.fhirJson}>
            {JSON.stringify(jsonObject, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}