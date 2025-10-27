'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { BudgetState, BudgetAction, BudgetGroup, BudgetCategory } from '@/lib/types';
import { createClient } from '@/utils/supabase/client';

interface BudgetContextType {
  state: BudgetState;
  addGroup: (name: string) => void;
  editGroup: (id: string, name: string) => void;
  deleteGroup: (id: string) => void;
  addCategory: (groupId: string, name: string, limit: number) => void;
  editCategory: (groupId: string, categoryId: string, name: string, limit: number) => void;
  deleteCategory: (groupId: string, categoryId: string) => void;
  refreshBudgets: () => Promise<void>;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const getRandomColor = (): string => {
  const colors = [
    '#ef4444', // red
    '#f97316', // orange  
    '#f59e0b', // amber
    '#eab308', // yellow
    '#84cc16', // lime
    '#22c55e', // green
    '#10b981', // emerald
    '#14b8a6', // teal
    '#06b6d4', // cyan
    '#0ea5e9', // sky
    '#3b82f6', // blue
    '#6366f1', // indigo
    '#8b5cf6', // violet
    '#a855f7', // purple
    '#d946ef', // fuchsia
    '#ec4899', // pink
    '#f43f5e', // rose
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

function budgetReducer(state: BudgetState, action: BudgetAction): BudgetState {
  switch (action.type) {
    case 'LOAD_GROUPS': {
      return {
        ...state,
        groups: action.payload.groups || [],
      };
    }

    case 'ADD_GROUP_SUCCESS': {
      return {
        ...state,
        groups: [...state.groups, action.payload.group],
      };
    }

    case 'ADD_GROUP': {
      const newGroup: BudgetGroup = {
        id: nanoid(),
        name: action.payload.name,
        categories: [],
      };
      return {
        ...state,
        groups: [...state.groups, newGroup],
      };
    }

    case 'EDIT_GROUP': {
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload.id
            ? { ...group, name: action.payload.name }
            : group
        ),
      };
    }

    case 'DELETE_GROUP': {
      return {
        ...state,
        groups: state.groups.filter(group => group.id !== action.payload.id),
      };
    }

    case 'ADD_CATEGORY_SUCCESS': {
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload.groupId
            ? { ...group, categories: [...group.categories, action.payload.category] }
            : group
        ),
      };
    }

    case 'ADD_CATEGORY': {
      const newCategory: BudgetCategory = {
        id: nanoid(),
        name: action.payload.name,
        limit: action.payload.limit,
        spent: 0, // Default to 0 spent
        color: getRandomColor(),
      };

      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload.groupId
            ? { ...group, categories: [...group.categories, newCategory] }
            : group
        ),
      };
    }

    case 'EDIT_CATEGORY': {
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload.groupId
            ? {
                ...group,
                categories: group.categories.map(category =>
                  category.id === action.payload.categoryId
                    ? { ...category, name: action.payload.name, limit: action.payload.limit }
                    : category
                ),
              }
            : group
        ),
      };
    }

    case 'DELETE_CATEGORY': {
      return {
        ...state,
        groups: state.groups.map(group =>
          group.id === action.payload.groupId
            ? {
                ...group,
                categories: group.categories.filter(
                  category => category.id !== action.payload.categoryId
                ),
              }
            : group
        ),
      };
    }

    default:
      return state;
  }
}

const initialState: BudgetState = {
  groups: [],
};

interface BudgetProviderProps {
  children: ReactNode;
}

export function BudgetProvider({ children }: BudgetProviderProps) {
  const [state, dispatch] = useReducer(budgetReducer, initialState);
  const supabase = createClient();

  // Shared function to load budgets
  const loadData = async () => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No user logged in');
      return;
    }

    // Load budget groups with categories
    const { data: groups, error: groupsError } = await supabase
      .from('budget_groups')
      .select(`
        id,
        name,
        budget_categories (
          id,
          name,
          planned_limit,
          spent
        )
      `)
      .order('created_at', { ascending: true });

    if (groupsError) {
      console.error('Error loading groups:', groupsError);
      return;
    }

    // Transform data to match our state structure
    if (groups) {
      const transformedGroups: BudgetGroup[] = groups.map((group: {
        id: string;
        name: string;
        budget_categories: { id: string; name: string; planned_limit: number; spent: number | null }[] | null
      }) => ({
        id: group.id,
        name: group.name,
        categories: (group.budget_categories || []).map((cat: { id: string; name: string; planned_limit: number; spent: number | null }) => ({
          id: cat.id,
          name: cat.name,
          limit: Number(cat.planned_limit),
          spent: Number(cat.spent || 0),
          color: getRandomColor(),
        })),
      }));

      // Load all groups at once
      dispatch({ type: 'LOAD_GROUPS', payload: { groups: transformedGroups } });
    }
  };

  // Load data from Supabase on mount
  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addGroup = async (name: string) => {
    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user logged in');
      return;
    }

    // Insert into database
    const { data, error } = await supabase
      .from('budget_groups')
      .insert({
        user_id: user.id,
        name: name,
      } as never)
      .select()
      .single();

    if (error) {
      console.error('Error adding group:', error);
      return;
    }

    if (data) {
      const groupData = data as { id: string; name: string };
      // Update local state with the ID from database
      const newGroup: BudgetGroup = {
        id: groupData.id,
        name: groupData.name,
        categories: [],
      };
      dispatch({ type: 'ADD_GROUP_SUCCESS', payload: { group: newGroup } });
    }
  };

  const editGroup = async (id: string, name: string) => {
    // Update in database
    const { error } = await supabase
      .from('budget_groups')
      .update({ name } as never)
      .eq('id', id);

    if (error) {
      console.error('Error updating group:', error);
      return;
    }

    // Update local state
    dispatch({ type: 'EDIT_GROUP', payload: { id, name } });
  };

  const deleteGroup = async (id: string) => {
    // Delete from database (CASCADE will delete categories)
    const { error } = await supabase
      .from('budget_groups')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting group:', error);
      return;
    }

    // Update local state
    dispatch({ type: 'DELETE_GROUP', payload: { id } });
  };

  const addCategory = async (groupId: string, name: string, limit: number) => {
    // Insert into database
    const { data, error } = await supabase
      .from('budget_categories')
      .insert({
        budget_group_id: groupId,
        name: name,
        planned_limit: limit,
      } as never)
      .select()
      .single();

    if (error) {
      console.error('Error adding category:', error);
      return;
    }

    if (data) {
      const categoryData = data as { id: string; name: string; planned_limit: number };
      // Update local state with database ID
      const newCategory: BudgetCategory = {
        id: categoryData.id,
        name: categoryData.name,
        limit: Number(categoryData.planned_limit),
        spent: 0,
        color: getRandomColor(),
      };
      
      dispatch({ 
        type: 'ADD_CATEGORY_SUCCESS', 
        payload: { groupId, category: newCategory } 
      });
    }
  };

  const editCategory = async (groupId: string, categoryId: string, name: string, limit: number) => {
    // Update in database
    const { error } = await supabase
      .from('budget_categories')
      .update({ 
        name,
        planned_limit: limit 
      } as never)
      .eq('id', categoryId);

    if (error) {
      console.error('Error updating category:', error);
      return;
    }

    // Update local state
    dispatch({ type: 'EDIT_CATEGORY', payload: { groupId, categoryId, name, limit } });
  };

  const deleteCategory = async (groupId: string, categoryId: string) => {
    // Delete from database
    const { error } = await supabase
      .from('budget_categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error('Error deleting category:', error);
      return;
    }

    // Update local state
    dispatch({ type: 'DELETE_CATEGORY', payload: { groupId, categoryId } });
  };

  const contextValue: BudgetContextType = {
    state,
    addGroup,
    editGroup,
    deleteGroup,
    addCategory,
    editCategory,
    deleteCategory,
    refreshBudgets: loadData,
  };

  return (
    <BudgetContext.Provider value={contextValue}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudgetContext() {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgetContext must be used within a BudgetProvider');
  }
  return context;
}