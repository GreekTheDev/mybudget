import { useState } from 'react';
import styles from './BudgetTemplateSelector.module.css';

export interface BudgetTemplate {
  id: string;
  name: string;
  description: string;
  sections: {
    name: string;
    percentage: number;
    items: string[];
  }[];
}

interface BudgetTemplateSelectorProps {
  templates: BudgetTemplate[];
  onSelectTemplate: (templateId: string) => void;
}

const BudgetTemplateSelector = ({ templates, onSelectTemplate }: BudgetTemplateSelectorProps) => {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [expandedTemplateId, setExpandedTemplateId] = useState<string | null>(null);

  const handleTemplateClick = (templateId: string) => {
    setSelectedTemplateId(templateId);
    setExpandedTemplateId(templateId === expandedTemplateId ? null : templateId);
  };

  const handleSelectTemplate = () => {
    if (selectedTemplateId) {
      onSelectTemplate(selectedTemplateId);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Wybierz szablon budżetu</h2>
        <p className={styles.subtitle}>
          Wybierz jeden z gotowych szablonów budżetu, aby szybko rozpocząć planowanie swoich finansów.
          Wszystkie kategorie będziesz mógł później dostosować do swoich potrzeb.
        </p>
      </div>

      <div className={styles.templatesGrid}>
        {templates.map((template) => (
          <div 
            key={template.id}
            className={`${styles.templateCard} ${selectedTemplateId === template.id ? styles.selected : ''}`}
            onClick={() => handleTemplateClick(template.id)}
          >
            <div className={styles.templateHeader}>
              <h3 className={styles.templateName}>{template.name}</h3>
              <div className={styles.templatePercentages}>
                {template.sections.map((section) => (
                  <span key={section.name} className={styles.percentage}>
                    {section.percentage}%
                  </span>
                ))}
              </div>
            </div>
            
            <p className={styles.templateDescription}>{template.description}</p>
            
            {expandedTemplateId === template.id && (
              <div className={styles.templateDetails}>
                {template.sections.map((section) => (
                  <div key={section.name} className={styles.sectionDetails}>
                    <h4 className={styles.sectionName}>
                      {section.name} ({section.percentage}%)
                    </h4>
                    <ul className={styles.itemsList}>
                      {section.items.map((item) => (
                        <li key={item} className={styles.item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <button 
          className={styles.selectButton}
          onClick={handleSelectTemplate}
          disabled={!selectedTemplateId}
        >
          Wybierz szablon
        </button>
      </div>
    </div>
  );
};

export default BudgetTemplateSelector;