import { createSlice } from "@reduxjs/toolkit";
import { fetchMyWallet, fetchOrganizerRevenue, claimRevenue } from "./financeThunks";

const initialState = {
  data: null,
  transactions: [],
  revenue: null,
  loading: false,
  claimLoading: false,
  error: null,
  hasMore: true,
};

const financeSlice = createSlice({
  name: "finance",
  initialState,
  reducers: {
    clearFinanceError: (state) => {
      state.error = null;
    },
    resetFinanceState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyWallet.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyWallet.fulfilled, (state, action) => {
        const { data, page } = action.payload;
        state.loading = false;
        state.data = data;
        if (page === 1) {
          state.transactions = data.transactions;
        } else {
          state.transactions = [...state.transactions, ...data.transactions];
        }
        state.hasMore = data.transactions.length >= 10;
      })
      .addCase(fetchMyWallet.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrganizerRevenue.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrganizerRevenue.fulfilled, (state, action) => {
        state.loading = false;
        state.revenue = action.payload;
      })
      .addCase(fetchOrganizerRevenue.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(claimRevenue.pending, (state) => {
        state.claimLoading = true;
      })
      .addCase(claimRevenue.fulfilled, (state, action) => {
        state.claimLoading = false;
        if (state.data) {
          state.data.balance = action.payload.new_wallet_balance;
        }
        if (state.revenue) {
            state.revenue.summary.total_claimable_now = 0;
        }
      })
      .addCase(claimRevenue.rejected, (state, action) => {
        state.claimLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearFinanceError, resetFinanceState } = financeSlice.actions;
export default financeSlice.reducer;