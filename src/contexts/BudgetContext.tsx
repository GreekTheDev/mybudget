'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { nanoid } from 'nanoid';
import { BudgetState, BudgetAction, BudgetGroup, BudgetCategory } from '@/lib/types';

interface BudgetContextType {
  state: BudgetState;
  addGroup: (name: string) => void;
  editGroup: (id: string, name: string) => void;
  deleteGroup: (id: string) => void;
  addCategory: (groupId: string, name: string, limit: number) => void;
  editCategory: (groupId: string, categoryId: string, name: string, limit: number) => void;
  deleteCategory: (groupId: string, categoryId: string) => void;
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

  const addGroup = (name: string) => {
    dispatch({ type: 'ADD_GROUP', payload: { name } });
  };

  const editGroup = (id: string, name: string) => {
    dispatch({ type: 'EDIT_GROUP', payload: { id, name } });
  };

  const deleteGroup = (id: string) => {
    dispatch({ type: 'DELETE_GROUP', payload: { id } });
  };

  const addCategory = (groupId: string, name: string, limit: number) => {
    dispatch({ type: 'ADD_CATEGORY', payload: { groupId, name, limit } });
  };

  const editCategory = (groupId: string, categoryId: string, name: string, limit: number) => {
    dispatch({ type: 'EDIT_CATEGORY', payload: { groupId, categoryId, name, limit } });
  };

  const deleteCategory = (groupId: string, categoryId: string) => {
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