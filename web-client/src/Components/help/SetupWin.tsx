import React from "react"
import { H2, H3 } from "../common/typography"
import { Gap } from "../common/layout/whie-space"
import imgEasyChordsServer from '../../images/easy-chords-server.png'
import imgLoopMidi from '../../images/loop-midi.png'
import imgMidiOutput from '../../images/midi-output.png'
import imgCubase from '../../images/cubase.png'
import { CenteredDiv, FixedSpacing } from "Components/common/layout/flex"
import styled from "styled-components"

const Splits = styled.div`
  display: flex;
  flex-direction: row;

  @media screen and (max-width: 1000px) {
    flex-wrap: wrap;
  }
`

const SplitLeft = styled.div`
  flex-grow: 500;
  padding-right: 30px;
`

const SplitRight = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
`

export default function SetupWin(){
  return (
    <div>
      <H2>MIDI Connection Setup on Windows</H2>

      <Splits>
        <SplitLeft>
          <H3>1. EasyChords Server</H3>
          <p className="text-high">EasyChords Server is a simple application which runs on your desktop. When you play chords in your browser it transforms them into MIDI events.</p>
          <p className="text-high">Download the latest version of EasyChords Server from <a href="https://s3-eu-west-1.amazonaws.com/easy-chords.io/server-downloads/EasyChords+Server+0.1.0.jar">here</a> and open it.</p>
          <p className="text-high">There are no controls - just keep it running when using EasyChords. If it does not open make sure you have Java installed.</p>
        </SplitLeft>
        <SplitRight>
          <CenteredDiv>
            <img src={imgEasyChordsServer} alt="Screenshot" width="400px"/>
          </CenteredDiv>
        </SplitRight>
      </Splits>

      <Gap size="XL"/>

      <Splits>
        <SplitLeft>
          <H3>2. Setup a virtual MIDI cable</H3>
          <p className="text-high">Next you will need to create a <i>virtual MIDI cable</i>, which can transmit MIDI from EasyChords Server to your DAW. EasyChords will output MIDI into this cable and your DAW can use it as a MIDI input as if it was any physical MIDI device.</p>
          <p className="text-high">One very easy and free software for that purpose is <a href="https://www.tobias-erichsen.de/software/loopmidi.html" target="_blank" rel="noopener noreferrer">loopMIDI</a> by Tobias Erichsen.</p>
          <p className="text-high">Download, install and run loopMIDI. Create a new MIDI port if not already done. You can name it as you wish. All default settings should work fine.</p>
        </SplitLeft>
        <SplitRight>
          <CenteredDiv>
            <img src={imgLoopMidi} alt="Screenshot" width="400px"/>
          </CenteredDiv>
        </SplitRight>
      </Splits>

      <Gap size="XL"/>

      <Splits>
        <SplitLeft>
          <H3>3. Select MIDI output in EasyChords</H3>
          <ul className="text-high">
            <li>Open EasyChords player in your browser.</li>
            <li>Click the Settings button on the upper-right corner to open the settings menu.</li>
            <li>Select 'Use external MIDI' from the Output dropdown.</li>
            <li>EasyChords connects to the local server and fetches the available MIDI devices.</li>
            <li>Select the virtual MIDI port you created in step 2 from the MIDI device dropdown.</li>
            <li>Close the settings menu.</li>
          </ul>
        </SplitLeft>
        <SplitRight>
          <CenteredDiv>
            <img src={imgMidiOutput} alt="Screenshot" width="400px"/>
          </CenteredDiv>
        </SplitRight>
      </Splits>

      <Gap size="L"/>

      <Splits>
        <SplitLeft>
          <H3>4. Select MIDI input in your DAW and start playing</H3>
          <ul className="text-high">
            <li>Open up your favourite music software and create a MIDI / virtual instrument track.</li>
            <li>Make sure it's using the previously created virtual MIDI port as input.</li>
          </ul>
          <p className="text-high"><b>All done! Now you can play and record MIDI from EasyChords on your browser into your DAW!</b></p>
        </SplitLeft>
        <SplitRight>
          <CenteredDiv>
            <FixedSpacing column spacing="s">
              <img src={imgCubase} alt="Screenshot" width="400px"/>
              <span className="text-medium">Example in Cubase</span>
            </FixedSpacing>
          </CenteredDiv>
        </SplitRight>
      </Splits>
    </div>
  )
}
