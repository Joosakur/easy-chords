import React, {useContext, useEffect} from 'react'
import styled from 'styled-components'
import {Input} from 'semantic-ui-react'
import api from '../../api/http-client'
import {SettingsContext} from '../../state/settings-context'
import {H3} from '../common/typography'
import Dropdown from '../common/Dropdown'
import {Gap} from '../common/layout/whie-space'

const Col = styled.div`
  display: flex;
  flex-direction: column;
`

function Settings() {
  const {
    useMidiOutput, setUseMidiOutput,
    host, setHost,
    midiDevices, setMidiDevices,
    midiDeviceSelected, setMidiDeviceSelected
  } = useContext(SettingsContext)
  
  useEffect(() => {
    api.setHostName(host)
    
    if(useMidiOutput && host) {
      setMidiDevices(null)
      api.getDevices().then(setMidiDevices).catch(() => setMidiDevices([]))
    }
  }, [useMidiOutput, host, setMidiDevices])
  
  const selectDevice = (value: number) => {
    if(midiDevices === null) return
    setMidiDeviceSelected(null)
    api.setDevice(midiDevices[value]).then(() => setMidiDeviceSelected(value))
  }
  
  const outputOptions = [
    { value: false, text: 'Play on browser (default piano)' },
    { value: true, text: 'Use external MIDI'}
  ]
  
  const midiDeviceOptions = midiDevices ? midiDevices.map((d, i) => ({
    text: `${d.name} - ${d.description}`,
    value: i
  })) : []
  
  return (
    <Col>
      <label>Output</label>
      <Gap size='xs'/>
      <Dropdown<boolean>
        options={outputOptions}
        value={useMidiOutput}
        onChange={value => setUseMidiOutput(value ?? false)}
      />
      
      {useMidiOutput && <>
          <Gap/>

          <label>Your local EasyChords server hostname or IP</label>
          <Gap size='xs'/>
          <Input
              fluid
              value={host}
              onChange={(e, data) => setHost(data.value)}
          />

          <Gap/>

          <label>MIDI device</label>
          <Gap size='xs'/>
          { midiDevices === null ? (
            <Dropdown placeholder='Loading devices ...'/>
          ) : (
            midiDevices.length > 0 ? (<>
              <Dropdown<number>
                placeholder='Select device'
                options={midiDeviceOptions}
                value={midiDeviceSelected ?? undefined}
                onChange={value => {
                  if(value !== undefined) selectDevice(value)
                }}
              />
            </>) : (
              <div>
                <H3>No external MIDI devices found</H3>
                <p>
                  Make sure you have EasyChords server application running.
                </p>
                <p>
                  If using phone, make sure you are in the same network (connected to same WiFi). Then input the IP
                  or the hostname of your computer to the field above (Piano Chords server application will tell
                  you these).
                </p>
              </div>
            )
          )}
      </>}
    </Col>
  )
}

export default Settings
