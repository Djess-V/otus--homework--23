import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

interface IOfferAndAgreement {
  offer: boolean;
  agreement: boolean;
}

const initialState: IOfferAndAgreement = { offer: false, agreement: false };

const offerAndAgreementSlice = createSlice({
  name: "offerAndAgreement",
  initialState,
  reducers: {
    updateOffer: (state, action: PayloadAction<boolean>) => {
      state.offer = action.payload;
      return state;
    },
    updateAgreement: (state, action: PayloadAction<boolean>) => {
      state.agreement = action.payload;
      return state;
    },
  },
});

export const selectOfferAndAgreement = (state: RootState) =>
  state.offerAndAgreement;

export const { updateOffer, updateAgreement } = offerAndAgreementSlice.actions;

export default offerAndAgreementSlice.reducer;
