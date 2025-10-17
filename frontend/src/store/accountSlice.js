import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  accounts: [],
  selectedAccount: null,
  transactions: [],
  loading: false,
  error: null,
};

const accountSlice = createSlice({
  name: 'accounts',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAccounts: (state, action) => {
      state.accounts = action.payload;
      state.loading = false;
    },
    setSelectedAccount: (state, action) => {
      state.selectedAccount = action.payload;
    },
    setTransactions: (state, action) => {
      state.transactions = action.payload;
      state.loading = false;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setAccounts,
  setSelectedAccount,
  setTransactions,
  setError,
  clearError,
} = accountSlice.actions;

export default accountSlice.reducer;

