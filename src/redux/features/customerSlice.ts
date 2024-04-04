import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Customer {
  name: string;
  title: string;
  address: string;
}

interface CustomerState {
  customerList: Customer[];
  photos: string[];
  selectedCustomer: Customer | null;
}

const initialState: CustomerState = {
  customerList: [],
  photos: [],
  selectedCustomer: null,
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customerList.push(action.payload);
    },
    addPhoto: (state, action: PayloadAction<string[]>) => {
      state.photos = action.payload;
    },
    addSelectedCustomer: (state, action: PayloadAction<Customer>) => {
      state.selectedCustomer = action.payload;
    },
  },
});

export const { addCustomer, addPhoto, addSelectedCustomer } =
  customerSlice.actions;
export default customerSlice.reducer;
