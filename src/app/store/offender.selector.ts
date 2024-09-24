import { createFeatureSelector, createSelector } from '@ngrx/store';
import { OffenderState } from './offender.reducer';

export const selectOffenderState = createFeatureSelector<OffenderState>('offenders');

export const selectVisibleOffenders = createSelector(
  selectOffenderState,
  (state: OffenderState) => state.visibleOffenders
);