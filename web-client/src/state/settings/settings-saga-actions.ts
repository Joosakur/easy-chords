import { createAsyncAction } from '../../utils/saga-utils'
import { MidiDevice } from '../../api/http-client'

export const getMidiDevices = createAsyncAction<void, MidiDevice[], void>('settings/getMidiDevices')
export const chooseMidiDevice = createAsyncAction<number, number, void>('settings/chooseMidiDevice')
