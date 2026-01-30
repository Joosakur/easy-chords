/**
 * HTTP client for communicating with the MIDI server.
 *
 * The MIDI server is an external process that bridges HTTP requests to MIDI hardware.
 * Default endpoint: http://localhost:8080
 *
 * @module api/http-client
 */

import axios from 'axios'
import type { ChordMapDefinitionV1 } from '../types'

let instance = axios.create({
  baseURL: 'http://localhost:8080',
})

/** Separate axios instance for loading chord map presets (no base URL). */
const s3Loader = axios.create()

const setHostName = (host: string) => {
  instance = axios.create({
    baseURL: `http://${host}:8080`,
  })
}

export interface NoteEventBasic {
  channel: number
  note: number
}

export interface NoteEvent extends NoteEventBasic {
  velocity: number
  duration?: number
}

export interface CCEvent {
  channel: number
  /** CC number (64 = sustain pedal) */
  cc: number
  /** 0-127. For sustain: 0 = off, 127 = on */
  value: number
}

/**
 * Batch chord event for atomic note changes.
 * Combines note-on and note-off in a single request to avoid audible gaps.
 */
export interface ChordEvent {
  playNotes: NoteEvent[]
  stopNotes: NoteEventBasic[]
}

async function playNote(e: NoteEvent): Promise<any> {
  return instance.post('/notes', e)
}

async function stopNote(channel: number, note: number): Promise<any> {
  return instance.delete(`/channels/${channel}/notes/${note}`)
}

async function sendCC(e: CCEvent): Promise<any> {
  return instance.post('/cc', e)
}

/**
 * Sends batch chord event: stops old notes and plays new ones atomically.
 * Used for seamless chord transitions without audible gaps.
 */
async function playChord(e: ChordEvent): Promise<any> {
  return instance.post('/chords', e)
}

export interface MidiDevice {
  name: string
  description: string
}

async function getDevices(): Promise<MidiDevice[]> {
  return instance.get<MidiDevice[]>('/devices').then((res) => res.data)
}

async function setDevice(device: MidiDevice) {
  await instance.put('/devices', device)
}

async function getChordMapPreset(path: string): Promise<ChordMapDefinitionV1> {
  return s3Loader.get(`/maps${path}.json`).then((res) => res.data)
}

const api = {
  setHostName,
  playNote,
  stopNote,
  playChord,
  getDevices,
  setDevice,
  getChordMapPreset,
  sendCC,
}

export default api
