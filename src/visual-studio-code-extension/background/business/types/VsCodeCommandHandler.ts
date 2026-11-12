import type { Handler } from '@shared/business/types/Handler'

export interface VsCodeCommandHandler<TArguments extends unknown[] = unknown[]> extends Handler<TArguments> {}
