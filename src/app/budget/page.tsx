'use client';

import { useState, useEffect } from 'react';
import { 
  BudgetGroupCard, 
  BudgetGroupDetails, 
  BudgetLayout 
} from '@/components/pages/budget';
import { BudgetProvider, useBudgetContext } from '@/contexts/BudgetContext';
import { AddGroupForm } from '@/components/pages/budget/AddGroupForm';
import { BudgetGroup } from '@/lib/types';

function BudgetContent() {
  const { state } = useBudgetContext();
  const [selectedGroup, setSelectedGroup] = useState<BudgetGroup | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const [layoutMode, setLayoutMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');

  const toggleGroupExpansion = (groupId: string) => {
    setExpandedGroups(prev => {
      const newSet = new Set(prev);
      
      // If clicking on an already expanded group, close it
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        // Close all other groups and open the selected one
        newSet.clear();
        newSet.add(groupId);
        
        // Smooth scroll to the selected group after a short delay
        setTimeout(() => {
          const element = document.getElementById(`group-${groupId}`);
          if (element) {
            element.scrollIntoView({ 
              behavior: 'smooth', 
              block: 'center' 
            });
          }
        }, 100);
      }
      
      return newSet;
    });
  };

  useEffect(() => {
    const checkLayoutMode = () => {
      const width = window.innerWidth;
      
      // Simplified logic - only check overflow on specific breakpoints
      const isVeryNarrow = width < 1100;
      const isTooNarrow = width < 1200 && width > 1024;
      
      // Only check for element overflow if we're in the problematic range
      let isOverlapping = false;
      if (width >= 1024 && width <= 1200) {
        const groupsList = document.querySelector('[data-groups-list]');
        const detailsPanel = document.querySelector('[data-details-panel]');
        
        if (groupsList && detailsPanel) {
          const groupsRect = groupsList.getBoundingClientRect();
          const detailsRect = detailsPanel.getBoundingClientRect();
          isOverlapping = groupsRect.right > detailsRect.left - 20;
        }
      }
      
      // Determine layout mode based on width and overflow detection
      if (width < 768 || isVeryNarrow) {
        setLayoutMode('mobile');
      } else if (width < 1024 || isTooNarrow || isOverlapping) {
        setLayoutMode('tablet');
      } else {
        setLayoutMode('desktop');
      }
    };

    // Initial check
    checkLayoutMode();
    
    // More aggressive debouncing for better performance
    let timeoutId: NodeJS.Timeout;
    const debouncedCheck = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkLayoutMode, 200); // Increased debounce time
    };

    window.addEventListener('resize', debouncedCheck);

    return () => {
      window.removeEventListener('resize', debouncedCheck);
      clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div className="container mx-auto px-4 ">
      <div className=" mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-foreground">Budżet</h1>
          <AddGroupForm />
        </div>

        <BudgetLayout layoutMode={layoutMode}>
          {/* Groups List */}
          <div className={`${layoutMode === 'mobile' ? 'col-span-1' : layoutMode === 'tablet' ? 'col-span-1 xl:col-span-2' : 'lg:col-span-2'}`} data-groups-list>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Grupy budżetowe</h2>
            {state.groups.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <p className="text-lg mb-2">Brak grup budżetowych</p>
                <p className="text-sm">Dodaj pierwszą grupę, aby zacząć planowanie budżetu</p>
              </div>
            ) : (
              <div className="space-y-4">
                {state.groups.map((group) => (
                  <BudgetGroupCard
                    key={group.id}
                    group={group}
                    isExpanded={expandedGroups.has(group.id)}
                    layoutMode={layoutMode}
                    onClick={() => setSelectedGroup(group)}
                    onToggleExpansion={() => toggleGroupExpansion(group.id)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Group Details - Responsive visibility */}
          <div className={`${layoutMode === 'mobile' ? 'hidden' : layoutMode === 'tablet' ? 'hidden xl:block xl:col-span-1' : 'hidden lg:block lg:col-span-1'}`} data-details-panel>
            <h2 className="text-xl font-semibold mb-4 text-foreground">Szczegóły</h2>
            <BudgetGroupDetails 
              group={selectedGroup}
            />
          </div>
        </BudgetLayout>
      </div>
    </div>
  );
}

export default function Budget() {
  return (
    <BudgetProvider>
      <BudgetContent />
    </BudgetProvider>
  );
}
