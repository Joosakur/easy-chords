import React from "react"
import styled from "styled-components"
import { H2, H3, H4 } from "../common/typography"
import { Gap } from "../common/layout/whie-space"

const Li = styled.li`
  color: #ffffff;
  opacity: 0.6;
`

export default function Downloads(){
  return (
    <div>
      <H2>EasyChords Server</H2>
      <p className="text-high">EasyChords Server is a simple application which runs on your desktop. When you play chords in your browser it transforms them into MIDI events, which your DAW can then receive as from any physical MIDI keyboard.</p>
      <p className="text-high">Download <a href="https://s3-eu-west-1.amazonaws.com/easy-chords.io/server-downloads/EasyChords+Server+0.1.0.jar">EasyChords Server 0.1.0.jar</a></p>
      <p className="text-medium">Java is required to run the application.</p>

      <Gap/>

      <H3>Release Notes</H3>
      <H4 fitted>v0.1.0</H4>
      <ul>
        <Li>Initial version</Li>
      </ul>
    </div>
  )
}
