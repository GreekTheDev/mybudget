export type AccountType = 
  | 'personal' // konto osobiste
  | 'credit' // karta kredytowa
  | 'savings' // konto oszczędnościowe
  | 'foreign' // konto walutowe
  | 'virtual' // konto wirtualne
  | 'prepaid'; // karta prepaid (podarunkowa)

export type AccountColor =
  | 'blue' // niebieski
  | 'green' // zielony
  | 'red' // czerwony
  | 'purple' // fioletowy
  | 'orange' // pomarańczowy
  | 'teal' // morski
  | 'pink' // różowy
  | 'yellow'; // żółty

export interface Account {
  id: string;
  name: string;
  balance: number;
  type: AccountType;
  color: AccountColor;
  includeInBudget: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NewAccount {
  name: string;
  balance: number;
  type: AccountType;
  color: AccountColor;
  includeInBudget: boolean;
}