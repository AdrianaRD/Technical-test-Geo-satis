import { createReducer, on } from '@ngrx/store';
import { setVisibleOffenders } from './offender.actions';

export interface OffenderState {
  visibleOffenders: any[];
}

const initialState: OffenderState = {
  visibleOffenders: []
};

export const offenderReducer = createReducer(
  initialState,
  on(setVisibleOffenders, (state, { visibleOffenders }) => ({
    ...state,
    visibleOffenders
  }))
);