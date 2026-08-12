import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import api, { getErrorMessage } from "@/lib/api";

const slice = createSlice({ name: "payment", initialState: { loading: false, payments: [] }, reducers: {
  request: (state) => { state.loading = true; },
  success: (state, action) => { state.loading = false; state.payments = action.payload ?? state.payments; },
  failure: (state) => { state.loading = false; },
} });

export const getMyPayments = () => async (dispatch) => { dispatch(slice.actions.request()); try { const { data } = await api.get("/payments/mine"); dispatch(slice.actions.success(data.payments)); } catch (error) { dispatch(slice.actions.failure()); toast.error(getErrorMessage(error)); } };
export const startMockCheckout = (auctionId) => async (dispatch) => { dispatch(slice.actions.request()); try { const { data } = await api.post(`/payments/auction/${auctionId}/checkout`); dispatch(slice.actions.success()); toast.info(data.checkout.message); return data.payment; } catch (error) { dispatch(slice.actions.failure()); toast.error(getErrorMessage(error)); return null; } };
export const completeMockPayment = (id) => async (dispatch) => { dispatch(slice.actions.request()); try { const { data } = await api.post(`/payments/${id}/mock-complete`); toast.success(data.message); dispatch(getMyPayments()); } catch (error) { dispatch(slice.actions.failure()); toast.error(getErrorMessage(error)); } };
export const requestRefund = (id, reason) => async (dispatch) => { dispatch(slice.actions.request()); try { const { data } = await api.post(`/payments/${id}/refund-request`, { reason }); toast.success(data.message); dispatch(getMyPayments()); } catch (error) { dispatch(slice.actions.failure()); toast.error(getErrorMessage(error)); } };
export const openPaymentDispute = (id, reason) => async (dispatch) => { dispatch(slice.actions.request()); try { const { data } = await api.post(`/payments/${id}/dispute`, { reason }); toast.success(data.message); dispatch(getMyPayments()); } catch (error) { dispatch(slice.actions.failure()); toast.error(getErrorMessage(error)); } };
export default slice.reducer;
