import type { MidiDevice } from '../../api/http-client'
import { createAsyncAction } from '../../utils/saga-utils'

export const getMidiDevices = createAsyncAction<void, MidiDevice[], void>('settings/getMidiDevices')
export const chooseMidiDevice = createAsyncAction<number, number, void>('settings/chooseMidiDevice')
