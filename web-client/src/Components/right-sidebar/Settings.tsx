import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import styled from 'styled-components'
import { Input } from '../common/Input'
import { H3 } from '../common/typography'
import Dropdown from '../common/Dropdown'
import { Gap } from '../common/layout/whie-space'
import { Colors } from '../common/style-constants'
import { selectSettings, setHost, setMidiOutput } from '../../state/settings/settings-slice'
import { chooseMidiDevice } from '../../state/actions'

const Col = styled.div`
  display: flex;
  flex-direction: column;
`

const Warning = styled.div`
  background-color: ${Colors.states.error};
  border-radius: 8px;
  padding: 8px;
`

function Settings() {
  const dispatch = useDispatch()
  const { midiDevices, midiOutput, host, midiDeviceIndex } = useSelector(selectSettings)
  const outputOptions = [
    { value: false, text: 'Play on browser (default piano)' },
    { value: true, text: 'Use external MIDI' }
  ]

  const midiDeviceOptions = midiDevices
    ? midiDevices.map((d, i) => ({
        text: `${d.name} - ${d.description}`,
        value: i
      }))
    : []

  const isMac = window.navigator.appVersion.includes('Mac')

  return (
    <Col>
      <label>Output</label>
      <Gap size="xs" />
      <Dropdown
        options={outputOptions}
        value={midiOutput}
        onChange={(value) => dispatch(setMidiOutput(!!value))}
      />

      {midiOutput && (
        <>
          <Gap />

          <label>Your local EasyChords server hostname or IP</label>
          <Gap size="xs" />
          <Input fluid value={host} onChange={(e, data) => dispatch(setHost(data.value))} />

          <Gap />

          <label>MIDI device</label>
          <Gap size="xs" />
          {midiDevices === null ? (
            <Dropdown placeholder="Loading devices ..." />
          ) : midiDevices.length > 0 ? (
            <>
              <Dropdown
                placeholder="Select device"
                options={midiDeviceOptions}
                value={midiDeviceIndex !== null ? midiDeviceIndex : undefined}
                onChange={(value) => {
                  if (value !== undefined) dispatch(chooseMidiDevice(value as number))
                }}
              />
            </>
          ) : (
            <Warning>
              <H3>No external MIDI devices found</H3>
              <p className="text-high">
                Download the{' '}
                <a
                  href={`/setup-on-${isMac ? 'mac' : 'windows'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="link"
                >
                  EasyChords server application
                </a>{' '}
                and make sure it's open.
              </p>
              {/*              <p className="text-medium">
                If using phone, make sure you are in the same network (connected to same WiFi). Then
                input the IP or the hostname of your computer to the field above. EasyChords server
                application will tell you these.
              </p>*/}
            </Warning>
          )}
        </>
      )}
      <Gap />

      <label>Instructions</label>
      <a
        href={`/setup-on-${isMac ? 'mac' : 'windows'}`}
        target="_blank"
        rel="noopener noreferrer"
        className="link"
      >
        Setting up connection
      </a>
    </Col>
  )
}

export default React.memo(Settings)
