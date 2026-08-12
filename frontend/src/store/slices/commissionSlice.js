import { createSlice } from "@reduxjs/toolkit";
import api, { getErrorMessage } from "@/lib/api";
import { toast } from "react-toastify";

const commissionSlice = createSlice({
  name: "commission",
  initialState: {
    loading: false,
  },
  reducers: {
    postCommissionProofRequest(state, action) {
      state.loading = true;
    },
    postCommissionProofSuccess(state, action) {
      state.loading = false;
    },
    postCommissionProofFailed(state, action) {
      state.loading = false;
    },
  },
});

export const postCommissionProof = (data) => async (dispatch) => {
  dispatch(commissionSlice.actions.postCommissionProofRequest());
  try {
    const response = await api.post("/commission/proof", data);
    dispatch(commissionSlice.actions.postCommissionProofSuccess());
    toast.success(response.data.message);
  } catch (error) {
    dispatch(commissionSlice.actions.postCommissionProofFailed());
    toast.error(getErrorMessage(error));
  }
};

export default commissionSlice.reducer;
