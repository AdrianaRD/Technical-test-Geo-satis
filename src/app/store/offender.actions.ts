import { createAction, props } from '@ngrx/store';

export const setVisibleOffenders = createAction(
  '[Offender List] Set Visible Offenders',
  props<{ visibleOffenders: any[] }>()
);