import React, {useContext, useEffect} from 'react'
import styled from 'styled-components'
import {Input} from 'semantic-ui-react'
import api from '../../api/http-client'
import {SettingsContext} from '../../state/settings-context'
import {H3} from '../common/typography'
import Dropdown from '../common/Dropdown'
import {Gap} from '../common/layout/whie-space'
import {Colors} from '../common/style-constants'

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
      <Dropdown
        options={outputOptions}
        value={useMidiOutput}
        onChange={value => setUseMidiOutput(!!value)}
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
              <Dropdown
                placeholder='Select device'
                options={midiDeviceOptions}
                value={midiDeviceSelected ?? undefined}
                onChange={value => {
                  if(value !== undefined) selectDevice(value as number)
                }}
              />
            </>) : (
              <Warning>
                <H3>No external MIDI devices found</H3>
                <p className='text-high'>
                  Make sure you have the EasyChords server application running.
                </p>
                <p className='text-medium'>
                  If using phone, make sure you are in the same network (connected to same WiFi). Then input the IP
                  or the hostname of your computer to the field above. EasyChords server application will tell
                  you these.
                </p>
              </Warning>
            )
          )}
      </>}
    </Col>
  )
}

export default React.memo(Settings)
