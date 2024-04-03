import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Customer {
  name: string;
  title: string;
  address: string;
}

interface CustomerState {
  customerList: Customer[];
  photos: string[];
}

const initialState: CustomerState = {
  customerList: [],
  photos: [],
};

const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    addCustomer: (state, action: PayloadAction<Customer>) => {
      state.customerList.push(action.payload);
    },
    addPhoto: (state, action: PayloadAction<string>) => {
      state.photos.push(action.payload);
    },
  },
});

export const { addCustomer, addPhoto } = customerSlice.actions;
export default customerSlice.reducer;
