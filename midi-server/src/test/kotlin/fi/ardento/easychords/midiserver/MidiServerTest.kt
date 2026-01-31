package fi.ardento.easychords.midiserver

import fi.ardento.easychords.midiserver.controllers.DeviceController
import fi.ardento.easychords.midiserver.controllers.NoteController
import fi.ardento.easychords.midiserver.services.CCEvent
import fi.ardento.easychords.midiserver.services.ChordEvent
import fi.ardento.easychords.midiserver.services.MidiDevice
import fi.ardento.easychords.midiserver.services.NoteEvent
import fi.ardento.easychords.midiserver.services.NoteEventBasic
import org.junit.jupiter.api.AfterEach
import org.junit.jupiter.api.Assertions.assertEquals
import org.junit.jupiter.api.Assertions.assertThrows
import org.junit.jupiter.api.BeforeEach
import org.junit.jupiter.api.Test
import org.mockito.ArgumentCaptor
import org.mockito.MockedStatic
import org.mockito.Mockito.mockStatic
import org.mockito.kotlin.atLeast
import org.mockito.kotlin.eq
import org.mockito.kotlin.mock
import org.mockito.kotlin.times
import org.mockito.kotlin.verify
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.context.SpringBootTest
import org.springframework.http.HttpStatus
import org.springframework.test.context.ActiveProfiles
import javax.sound.midi.MidiSystem
import javax.sound.midi.MidiUnavailableException
import javax.sound.midi.Receiver
import javax.sound.midi.ShortMessage

@SpringBootTest
@ActiveProfiles("test")
class MidiServerTest {
    @Autowired
    private lateinit var deviceController: DeviceController

    @Autowired
    private lateinit var noteController: NoteController

    private lateinit var midiSystemMock: MockedStatic<MidiSystem>

    @BeforeEach
    fun setUp() {
        midiSystemMock = mockStatic(MidiSystem::class.java)
    }

    @AfterEach
    fun tearDown() {
        midiSystemMock.close()
    }

    @Test
    fun `GET devices returns only devices that can receive MIDI`() {
        val receiverDevice = createMockDeviceInfo("Synth", "Virtual Synth", maxReceivers = 1)
        val senderOnlyDevice = createMockDeviceInfo("Input", "MIDI Input", maxReceivers = 0)
        val unlimitedDevice = createMockDeviceInfo("Piano", "Digital Piano", maxReceivers = -1)

        midiSystemMock
            .`when`<Array<javax.sound.midi.MidiDevice.Info>> { MidiSystem.getMidiDeviceInfo() }
            .thenReturn(arrayOf(receiverDevice, senderOnlyDevice, unlimitedDevice))

        val response = deviceController.getDevices()

        assertEquals(HttpStatus.OK, response.statusCode)
        val devices = response.body!!
        assertEquals(2, devices.size)
        assertEquals("Synth", devices[0].name)
        assertEquals("Virtual Synth", devices[0].description)
        assertEquals("Piano", devices[1].name)
        assertEquals("Digital Piano", devices[1].description)
    }

    @Test
    fun `GET devices returns empty list when no devices available`() {
        midiSystemMock
            .`when`<Array<javax.sound.midi.MidiDevice.Info>> { MidiSystem.getMidiDeviceInfo() }
            .thenReturn(emptyArray())

        val response = deviceController.getDevices()

        assertEquals(HttpStatus.OK, response.statusCode)
        assertEquals(0, response.body!!.size)
    }

    @Test
    fun `PUT devices sets the selected MIDI device`() {
        val deviceInfo = createMockDeviceInfo("Synth", "Virtual Synth", maxReceivers = 1)
        val mockDevice = mock<javax.sound.midi.MidiDevice>()
        val mockReceiver = mock<Receiver>()

        midiSystemMock
            .`when`<Array<javax.sound.midi.MidiDevice.Info>> { MidiSystem.getMidiDeviceInfo() }
            .thenReturn(arrayOf(deviceInfo))
        midiSystemMock
            .`when`<javax.sound.midi.MidiDevice> { MidiSystem.getMidiDevice(deviceInfo) }
            .thenReturn(mockDevice)
        whenever(mockDevice.receiver).thenReturn(mockReceiver)

        val response = deviceController.setDevice(MidiDevice("Synth", "Virtual Synth"))

        assertEquals(HttpStatus.NO_CONTENT, response.statusCode)
        verify(mockDevice).open()
        verify(mockDevice).receiver
    }

    @Test
    fun `PUT devices matches device case-insensitively`() {
        val deviceInfo = createMockDeviceInfo("Synth", "Virtual Synth", maxReceivers = 1)
        val mockDevice = mock<javax.sound.midi.MidiDevice>()
        val mockReceiver = mock<Receiver>()

        midiSystemMock
            .`when`<Array<javax.sound.midi.MidiDevice.Info>> { MidiSystem.getMidiDeviceInfo() }
            .thenReturn(arrayOf(deviceInfo))
        midiSystemMock
            .`when`<javax.sound.midi.MidiDevice> { MidiSystem.getMidiDevice(deviceInfo) }
            .thenReturn(mockDevice)
        whenever(mockDevice.receiver).thenReturn(mockReceiver)

        val response = deviceController.setDevice(MidiDevice("SYNTH", "VIRTUAL SYNTH"))

        assertEquals(HttpStatus.NO_CONTENT, response.statusCode)
        verify(mockDevice).open()
    }

    @Test
    fun `PUT devices throws exception when device not found`() {
        midiSystemMock
            .`when`<Array<javax.sound.midi.MidiDevice.Info>> { MidiSystem.getMidiDeviceInfo() }
            .thenReturn(emptyArray())

        assertThrows(MidiUnavailableException::class.java) {
            deviceController.setDevice(MidiDevice("Unknown", "Device"))
        }
    }

    @Test
    fun `PUT devices closes previous receiver when switching devices`() {
        val deviceInfo1 = createMockDeviceInfo("Synth1", "First", maxReceivers = 1)
        val deviceInfo2 = createMockDeviceInfo("Synth2", "Second", maxReceivers = 1)
        val mockDevice1 = mock<javax.sound.midi.MidiDevice>()
        val mockDevice2 = mock<javax.sound.midi.MidiDevice>()
        val mockReceiver1 = mock<Receiver>()
        val mockReceiver2 = mock<Receiver>()

        midiSystemMock
            .`when`<Array<javax.sound.midi.MidiDevice.Info>> { MidiSystem.getMidiDeviceInfo() }
            .thenReturn(arrayOf(deviceInfo1, deviceInfo2))
        midiSystemMock
            .`when`<javax.sound.midi.MidiDevice> { MidiSystem.getMidiDevice(deviceInfo1) }
            .thenReturn(mockDevice1)
        midiSystemMock
            .`when`<javax.sound.midi.MidiDevice> { MidiSystem.getMidiDevice(deviceInfo2) }
            .thenReturn(mockDevice2)
        whenever(mockDevice1.receiver).thenReturn(mockReceiver1)
        whenever(mockDevice2.receiver).thenReturn(mockReceiver2)

        deviceController.setDevice(MidiDevice("Synth1", "First"))
        deviceController.setDevice(MidiDevice("Synth2", "Second"))

        verify(mockReceiver1).close()
    }

    @Test
    fun `POST notes sends NOTE_ON message to receiver`() {
        val mockReceiver = setupMidiReceiver()

        val response = noteController.playNote(NoteEvent(channel = 0, note = 60, velocity = 100, duration = 5000))

        assertEquals(HttpStatus.NO_CONTENT, response.statusCode)

        val messageCaptor = ArgumentCaptor.forClass(ShortMessage::class.java)
        verify(mockReceiver, atLeast(1)).send(messageCaptor.capture(), eq(-1L))

        val noteOnMessage = messageCaptor.allValues.first { it.command == ShortMessage.NOTE_ON }
        assertEquals(ShortMessage.NOTE_ON, noteOnMessage.command)
        assertEquals(0, noteOnMessage.channel)
        assertEquals(60, noteOnMessage.data1)
        assertEquals(100, noteOnMessage.data2)
    }

    @Test
    fun `POST notes does nothing when no receiver is set`() {
        midiSystemMock
            .`when`<Array<javax.sound.midi.MidiDevice.Info>> { MidiSystem.getMidiDeviceInfo() }
            .thenReturn(emptyArray())

        val response = noteController.playNote(NoteEvent(channel = 0, note = 60, velocity = 100, duration = 1000))

        assertEquals(HttpStatus.NO_CONTENT, response.statusCode)
    }

    @Test
    fun `POST notes sends NOTE_OFF after duration expires`() {
        val mockReceiver = setupMidiReceiver()

        noteController.playNote(NoteEvent(channel = 0, note = 60, velocity = 100, duration = 100))

        Thread.sleep(200)

        val messageCaptor = ArgumentCaptor.forClass(ShortMessage::class.java)
        verify(mockReceiver, atLeast(2)).send(messageCaptor.capture(), eq(-1L))

        val messages = messageCaptor.allValues
        val noteOnMessages = messages.filter { it.command == ShortMessage.NOTE_ON }
        val noteOffMessages = messages.filter { it.command == ShortMessage.NOTE_OFF }

        assertEquals(1, noteOnMessages.size)
        assertEquals(1, noteOffMessages.size)
        assertEquals(60, noteOffMessages[0].data1)
    }

    @Test
    fun `POST notes clamps duration between 100ms and 10000ms`() {
        val mockReceiver = setupMidiReceiver()

        noteController.playNote(NoteEvent(channel = 0, note = 60, velocity = 100, duration = 10))

        Thread.sleep(150)

        val messageCaptor = ArgumentCaptor.forClass(ShortMessage::class.java)
        verify(mockReceiver, atLeast(2)).send(messageCaptor.capture(), eq(-1L))

        val noteOffMessages = messageCaptor.allValues.filter { it.command == ShortMessage.NOTE_OFF }
        assertEquals(1, noteOffMessages.size)
    }

    @Test
    fun `DELETE note sends NOTE_OFF message`() {
        val mockReceiver = setupMidiReceiver()

        val response = noteController.stopNote(channel = 0, note = 60)

        assertEquals(HttpStatus.NO_CONTENT, response.statusCode)

        val messageCaptor = ArgumentCaptor.forClass(ShortMessage::class.java)
        verify(mockReceiver).send(messageCaptor.capture(), eq(-1L))

        val message = messageCaptor.value
        assertEquals(ShortMessage.NOTE_OFF, message.command)
        assertEquals(0, message.channel)
        assertEquals(60, message.data1)
        assertEquals(0, message.data2)
    }

    @Test
    fun `DELETE note cancels pending auto-off timer`() {
        val mockReceiver = setupMidiReceiver()

        noteController.playNote(NoteEvent(channel = 0, note = 60, velocity = 100, duration = 500))
        noteController.stopNote(channel = 0, note = 60)

        Thread.sleep(600)

        val messageCaptor = ArgumentCaptor.forClass(ShortMessage::class.java)
        verify(mockReceiver, times(2)).send(messageCaptor.capture(), eq(-1L))

        val noteOffMessages = messageCaptor.allValues.filter { it.command == ShortMessage.NOTE_OFF }
        assertEquals(1, noteOffMessages.size)
    }

    @Test
    fun `DELETE note does nothing when no receiver is set`() {
        midiSystemMock
            .`when`<Array<javax.sound.midi.MidiDevice.Info>> { MidiSystem.getMidiDeviceInfo() }
            .thenReturn(emptyArray())

        val response = noteController.stopNote(channel = 0, note = 60)

        assertEquals(HttpStatus.NO_CONTENT, response.statusCode)
    }

    @Test
    fun `POST cc sends CONTROL_CHANGE message`() {
        val mockReceiver = setupMidiReceiver()

        val response = noteController.sendCC(CCEvent(channel = 0, cc = 64, value = 127))

        assertEquals(HttpStatus.NO_CONTENT, response.statusCode)

        val messageCaptor = ArgumentCaptor.forClass(ShortMessage::class.java)
        verify(mockReceiver).send(messageCaptor.capture(), eq(-1L))

        val message = messageCaptor.value
        assertEquals(ShortMessage.CONTROL_CHANGE, message.command)
        assertEquals(64, message.data1)
        assertEquals(127, message.data2)
    }

    @Test
    fun `POST cc does nothing when no receiver is set`() {
        midiSystemMock
            .`when`<Array<javax.sound.midi.MidiDevice.Info>> { MidiSystem.getMidiDeviceInfo() }
            .thenReturn(emptyArray())

        val response = noteController.sendCC(CCEvent(channel = 0, cc = 64, value = 127))

        assertEquals(HttpStatus.NO_CONTENT, response.statusCode)
    }

    @Test
    fun `POST chords stops notes then plays new notes`() {
        val mockReceiver = setupMidiReceiver()

        val chordEvent =
            ChordEvent(
                playNotes =
                    listOf(
                        NoteEvent(channel = 0, note = 60, velocity = 100, duration = 5000),
                        NoteEvent(channel = 0, note = 64, velocity = 100, duration = 5000),
                    ),
                stopNotes =
                    listOf(
                        NoteEventBasic(channel = 0, note = 55),
                    ),
            )

        val response = noteController.playChord(chordEvent)

        assertEquals(HttpStatus.NO_CONTENT, response.statusCode)

        val messageCaptor = ArgumentCaptor.forClass(ShortMessage::class.java)
        verify(mockReceiver, atLeast(3)).send(messageCaptor.capture(), eq(-1L))

        val messages = messageCaptor.allValues
        val noteOffMessages = messages.filter { it.command == ShortMessage.NOTE_OFF }
        val noteOnMessages = messages.filter { it.command == ShortMessage.NOTE_ON }

        assertEquals(1, noteOffMessages.size)
        assertEquals(55, noteOffMessages[0].data1)
        assertEquals(2, noteOnMessages.size)
    }

    @Test
    fun `replaying same note cancels previous timer`() {
        val mockReceiver = setupMidiReceiver()

        noteController.playNote(NoteEvent(channel = 0, note = 60, velocity = 100, duration = 200))
        Thread.sleep(50)
        noteController.playNote(NoteEvent(channel = 0, note = 60, velocity = 100, duration = 200))

        Thread.sleep(300)

        val messageCaptor = ArgumentCaptor.forClass(ShortMessage::class.java)
        verify(mockReceiver, atLeast(1)).send(messageCaptor.capture(), eq(-1L))

        val messages = messageCaptor.allValues
        val noteOnMessages = messages.filter { it.command == ShortMessage.NOTE_ON }
        val noteOffMessages = messages.filter { it.command == ShortMessage.NOTE_OFF }

        assertEquals(2, noteOnMessages.size)
        assertEquals(1, noteOffMessages.size)
    }

    private fun setupMidiReceiver(): Receiver {
        val deviceInfo = createMockDeviceInfo("Test", "Test Device", maxReceivers = 1)
        val mockDevice = mock<javax.sound.midi.MidiDevice>()
        val mockReceiver = mock<Receiver>()

        midiSystemMock
            .`when`<Array<javax.sound.midi.MidiDevice.Info>> { MidiSystem.getMidiDeviceInfo() }
            .thenReturn(arrayOf(deviceInfo))
        midiSystemMock
            .`when`<javax.sound.midi.MidiDevice> { MidiSystem.getMidiDevice(deviceInfo) }
            .thenReturn(mockDevice)
        whenever(mockDevice.receiver).thenReturn(mockReceiver)
        whenever(mockDevice.maxReceivers).thenReturn(1)

        deviceController.setDevice(MidiDevice("Test", "Test Device"))

        return mockReceiver
    }

    private fun createMockDeviceInfo(
        name: String,
        description: String,
        maxReceivers: Int,
    ): javax.sound.midi.MidiDevice.Info {
        val mockInfo = mock<javax.sound.midi.MidiDevice.Info>()
        val mockDevice = mock<javax.sound.midi.MidiDevice>()

        whenever(mockInfo.name).thenReturn(name)
        whenever(mockInfo.description).thenReturn(description)
        whenever(mockDevice.maxReceivers).thenReturn(maxReceivers)

        midiSystemMock
            .`when`<javax.sound.midi.MidiDevice> { MidiSystem.getMidiDevice(mockInfo) }
            .thenReturn(mockDevice)

        return mockInfo
    }
}
