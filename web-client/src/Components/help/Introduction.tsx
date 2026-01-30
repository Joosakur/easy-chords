import styled from 'styled-components'
import { Link } from 'wouter'
import imgMainScreenshot from '../../images/main-screenshot.png'
import { CenteredDiv } from '../common/layout/flex'
import { Gap } from '../common/layout/white-space'
import { H2 } from '../common/typography'

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

const MegaLink = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  font-size: 2.5rem;
`

export default function Introduction() {
  const isMac = window.navigator.appVersion.includes('Mac')

  return (
    <div>
      <Splits>
        <SplitLeft>
          <H2>What is EasyChords?</H2>
          <p className="text-high">
            EasyChords provides an easy way to play all kinds of chords and voicings. EasyChords is
            intended especially for those who can not play with a normal keyboard due to lack of
            skill or some disability.
          </p>
          <p className="text-high">
            You can use the built-in sounds to instantly play and try out ideas anywhere - even on
            the road with mobile.
          </p>
          <p className="text-high">
            To unlock the full power of EasyChords,{' '}
            <Link to={`/setup-on-${isMac ? 'mac' : 'windows'}`}>use it as a MIDI input</Link> in
            whichever music creation software you prefer. Play with any sounds and record the MIDI
            with low latency!
          </p>
        </SplitLeft>
        <SplitRight>
          <CenteredDiv>
            <img src={imgMainScreenshot} alt="Screenshot" width="450px" />
          </CenteredDiv>
        </SplitRight>
      </Splits>

      <Gap size="L" />

      <CenteredDiv>
        <MegaLink to="/app" className="link">
          Open EasyChords app!
        </MegaLink>
      </CenteredDiv>

      <Gap />

      <H2>Playing chords</H2>
      <p className="text-high">
        Just click on them! When using external MIDI, the chord is played until you release the
        mouse button, velocity is controlled by horizontal position of the click, and space bar will
        work as a sustain pedal.
      </p>

      <Gap />

      <H2>Editing chords</H2>
      <p className="text-high">
        Go to edit mode by clicking the Edit Chords button. Select the chord button you want to edit
        by clicking it, and build the chord using the piano keys or controls on the editor panel.
      </p>

      <Gap />

      <H2>Saving and loading chords</H2>
      <p className="text-high">
        To save a chord map that you have built, click Export and save the file on your computer.
        Later you can open it again by clicking Import.
      </p>
      <p className="text-high">Explore the ready-made presets for inspiration or starting point.</p>
    </div>
  )
}
