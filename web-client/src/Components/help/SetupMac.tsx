import styled from 'styled-components'
import imgEasyChordsServer from '../../images/easy-chords-server-mac.png'
import imgMac1 from '../../images/mac1-open-midi-studio.png'
import imgMac2 from '../../images/mac2-activate-device.png'
import imgMac3 from '../../images/mac3-create-bus.png'
import imgMidiOutput from '../../images/midi-output-mac.png'
import { CenteredDiv } from '../common/layout/flex'
import { Gap } from '../common/layout/whie-space'
import { H2, H3 } from '../common/typography'

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

export default function SetupMac() {
  return (
    <div>
      <H2>MIDI Connection Setup on macOS</H2>

      <Splits>
        <SplitLeft>
          <H3>1. EasyChords Server</H3>
          <p className="text-high">
            EasyChords Server is a simple application which runs on your desktop. When you play
            chords in your browser it transforms them into MIDI events.
          </p>
          <p className="text-high">
            Download the latest version of EasyChords Server from{' '}
            <a
              href="https://s3.eu-west-1.amazonaws.com/www.easy-chords.io/server-downloads/EasyChords+Server+0.1.0.jar"
              className="link"
            >
              here
            </a>{' '}
            and open it.
          </p>
          <p className="text-high">
            There are no controls - just keep it running when using EasyChords. If it does not open
            make sure you have Java installed.
          </p>
        </SplitLeft>
        <SplitRight>
          <CenteredDiv>
            <img src={imgEasyChordsServer} alt="Screenshot" width="400px" />
          </CenteredDiv>
        </SplitRight>
      </Splits>

      <Gap size="XL" />

      <H3>2. Setup a virtual MIDI cable</H3>
      <p className="text-high">
        Next you will need to create a <i>virtual MIDI cable</i>, which can transmit MIDI from
        EasyChords Server to your DAW. EasyChords will output MIDI into this cable and your DAW can
        use it as a MIDI input as if it was any physical MIDI device.
      </p>
      <p className="text-high">
        On macOS this is possible without any additional software, but you need to click through
        some settings to activate it.
      </p>
      <p className="text-high">
        First open an application called Audio MIDI Setup. From its Window menu select 'Show MIDI
        Studio' (1).
      </p>
      <CenteredDiv>
        <img src={imgMac1} alt="Screenshot" width="80%" />
      </CenteredDiv>
      <Gap />
      <p className="text-high">
        A new window opens. Double click the element which says 'IAC Driver' (2) and activate it by
        checking 'Device is online' (3).
      </p>
      <CenteredDiv>
        <img src={imgMac2} alt="Screenshot" width="80%" />
      </CenteredDiv>
      <Gap />
      <p className="text-high">
        Under the Ports tab (4) create a MIDI bus by clicking the plus icon (5). Finally click Apply
        (6) and then you may close these settings windows.
      </p>
      <CenteredDiv>
        <img src={imgMac3} alt="Screenshot" />
      </CenteredDiv>

      <Gap size="XL" />

      <Splits>
        <SplitLeft>
          <H3>3. Select MIDI output in EasyChords</H3>
          <ul className="text-high">
            <li>Open EasyChords player in your browser.</li>
            <li>Click the Settings button on the upper-right corner to open the settings menu.</li>
            <li>Select 'Use external MIDI' from the Output dropdown.</li>
            <li>EasyChords connects to the local server and fetches the available MIDI devices.</li>
            <li>
              Select the virtual MIDI port you created in step 2 from the MIDI device dropdown.
            </li>
            <li>Close the settings menu.</li>
          </ul>
        </SplitLeft>
        <SplitRight>
          <CenteredDiv>
            <img src={imgMidiOutput} alt="Screenshot" width="400px" />
          </CenteredDiv>
        </SplitRight>
      </Splits>

      <Gap size="L" />

      <H3>4. Select MIDI input in your DAW and start playing</H3>
      <ul className="text-high">
        <li>Open up your favourite music software and create a MIDI / virtual instrument track.</li>
        <li>Make sure it's using the previously created virtual MIDI port as input.</li>
      </ul>
      <p className="text-high">
        <b>
          All done! Now you can play and record MIDI from EasyChords on your browser into your DAW!
        </b>
      </p>
    </div>
  )
}
