'use client';

import React, { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import { Account, AccountType } from '@/lib/types';
import { getAccountTypeColor } from '@/lib/accountCategories';
import { createClient } from '@/utils/supabase/client';

interface AccountState {
  accounts: Account[];
}

type AccountAction =
  | { type: 'LOAD_ACCOUNTS'; payload: { accounts: Account[] } }
  | { type: 'ADD_ACCOUNT'; payload: { name: string; accountType: AccountType; balance: number } }
  | { type: 'ADD_ACCOUNT_SUCCESS'; payload: { account: Account } }
  | { type: 'EDIT_ACCOUNT'; payload: { id: string; name: string; accountType: AccountType } }
  | { type: 'DELETE_ACCOUNT'; payload: { id: string } }
  | { type: 'UPDATE_BALANCE'; payload: { id: string; balance: number } };

interface AccountContextType {
  state: AccountState;
  addAccount: (name: string, accountType: AccountType, balance: number) => void;
  editAccount: (id: string, name: string, accountType: AccountType) => void;
  deleteAccount: (id: string) => void;
  updateBalance: (id: string, balance: number) => void;
  refreshAccounts: () => Promise<void>;
}

const AccountContext = createContext<AccountContextType | undefined>(undefined);


function accountReducer(state: AccountState, action: AccountAction): AccountState {
  switch (action.type) {
    case 'LOAD_ACCOUNTS': {
      return {
        ...state,
        accounts: action.payload.accounts || [],
      };
    }

    case 'ADD_ACCOUNT_SUCCESS': {
      return {
        ...state,
        accounts: [...state.accounts, action.payload.account],
      };
    }

    case 'ADD_ACCOUNT': {
      const newAccount: Account = {
        id: Date.now().toString(),
        name: action.payload.name,
        type: action.payload.accountType,
        balance: action.payload.balance,
        color: getAccountTypeColor(action.payload.accountType),
      };
      return {
        ...state,
        accounts: [...state.accounts, newAccount],
      };
    }
    
    case 'EDIT_ACCOUNT': {
      return {
        ...state,
        accounts: state.accounts.map(account =>
          account.id === action.payload.id
            ? { 
                ...account, 
                name: action.payload.name, 
                type: action.payload.accountType,
                color: getAccountTypeColor(action.payload.accountType)
              }
            : account
        ),
      };
    }
    
    case 'DELETE_ACCOUNT': {
      return {
        ...state,
        accounts: state.accounts.filter(account => account.id !== action.payload.id),
      };
    }
    
    case 'UPDATE_BALANCE': {
      return {
        ...state,
        accounts: state.accounts.map(account =>
          account.id === action.payload.id
            ? { ...account, balance: action.payload.balance }
            : account
        ),
      };
    }
    
    default:
      return state;
  }
}

const initialState: AccountState = {
  accounts: [],
};

// Mapowanie typów kont na nazwy w Supabase
const accountTypeToSupabaseName: Record<AccountType, string> = {
  cash: 'Gotówka',
  checking: 'Konto bieżące',
  savings: 'Oszczędności',
  term_deposit: 'Oszczędności',
  credit: 'Karta kredytowa',
  bnpl: 'Karta kredytowa',
  loan: 'Karta kredytowa',
  mortgage: 'Karta kredytowa',
  investment: 'Inwestycje',
  brokerage: 'Inwestycje',
  pension: 'Inwestycje',
  crypto: 'Inwestycje',
  ewallet: 'Gotówka',
  prepaid: 'Karta kredytowa'
};

export function AccountProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(accountReducer, initialState);
  const supabase = createClient();

  // Shared function to load accounts
  const loadAccounts = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.log('No user logged in');
      return;
    }

    // Load accounts with their types
    const { data: accounts, error } = await supabase
      .from('accounts')
      .select(`
        id,
        name,
        balance,
        account_types (
          name
        )
      `)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading accounts:', error);
      return;
    }

    if (accounts) {
      const transformedAccounts: Account[] = accounts.map(acc => {
        // Map Supabase name back to AccountType
        const typeName = (acc.account_types as any)?.name || 'Konto bieżące';
        let accountType: AccountType = 'checking';
        
        // Find matching type
        for (const [type, name] of Object.entries(accountTypeToSupabaseName)) {
          if (name === typeName) {
            accountType = type as AccountType;
            break;
          }
        }

        return {
          id: acc.id,
          name: acc.name,
          type: accountType,
          balance: Number(acc.balance),
          color: getAccountTypeColor(accountType),
        };
      });

      dispatch({ type: 'LOAD_ACCOUNTS', payload: { accounts: transformedAccounts } });
    }
  };

  // Load accounts from Supabase on mount
  useEffect(() => {
    loadAccounts();
  }, []);

  const addAccount = async (name: string, accountType: AccountType, balance: number) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      console.error('No user logged in');
      return;
    }

    // Get account_type_id from database
    const supabaseTypeName = accountTypeToSupabaseName[accountType];
    const { data: accountTypeData, error: typeError } = await supabase
      .from('account_types')
      .select('id')
      .eq('name', supabaseTypeName)
      .single();

    if (typeError || !accountTypeData) {
      console.error('Error getting account type:', typeError);
      return;
    }

    // Insert account
    const { data, error } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        name: name,
        account_type_id: accountTypeData.id,
        balance: balance,
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding account:', error);
      return;
    }

    if (data) {
      const newAccount: Account = {
        id: data.id,
        name: data.name,
        type: accountType,
        balance: Number(data.balance),
        color: getAccountTypeColor(accountType),
      };
      dispatch({ type: 'ADD_ACCOUNT_SUCCESS', payload: { account: newAccount } });
    }
  };

  const editAccount = async (id: string, name: string, accountType: AccountType) => {
    // Get account_type_id from database
    const supabaseTypeName = accountTypeToSupabaseName[accountType];
    const { data: accountTypeData, error: typeError } = await supabase
      .from('account_types')
      .select('id')
      .eq('name', supabaseTypeName)
      .single();

    if (typeError || !accountTypeData) {
      console.error('Error getting account type:', typeError);
      return;
    }

    // Update in database
    const { error } = await supabase
      .from('accounts')
      .update({ 
        name,
        account_type_id: accountTypeData.id 
      })
      .eq('id', id);

    if (error) {
      console.error('Error updating account:', error);
      return;
    }

    // Update local state
    dispatch({ type: 'EDIT_ACCOUNT', payload: { id, name, accountType } });
  };

  const deleteAccount = async (id: string) => {
    // Delete from database
    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting account:', error);
      return;
    }

    // Update local state
    dispatch({ type: 'DELETE_ACCOUNT', payload: { id } });
  };

  const updateBalance = async (id: string, balance: number) => {
    // Update in database
    const { error } = await supabase
      .from('accounts')
      .update({ balance })
      .eq('id', id);

    if (error) {
      console.error('Error updating balance:', error);
      return;
    }

    // Update local state
    dispatch({ type: 'UPDATE_BALANCE', payload: { id, balance } });
  };

  return (
    <AccountContext.Provider
      value={{
        state,
        addAccount,
        editAccount,
        deleteAccount,
        updateBalance,
        refreshAccounts: loadAccounts,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccountContext() {
  const context = useContext(AccountContext);
  if (!context) {
    throw new Error('useAccountContext must be used within an AccountProvider');
  }
  return context;
}
