import type { Handler } from '@shared/types/Handler'

export interface VsCodeCommandHandler<TArguments extends unknown[] = unknown[]> extends Handler<TArguments> {}
