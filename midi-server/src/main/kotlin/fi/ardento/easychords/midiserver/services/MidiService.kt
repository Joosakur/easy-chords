package fi.ardento.easychords.midiserver.services

import org.springframework.stereotype.Service
import java.util.Timer
import java.util.TimerTask
import java.util.concurrent.ConcurrentHashMap
import javax.sound.midi.MidiSystem
import javax.sound.midi.MidiUnavailableException
import javax.sound.midi.Receiver
import javax.sound.midi.ShortMessage
import javax.sound.midi.ShortMessage.CONTROL_CHANGE
import javax.sound.midi.ShortMessage.NOTE_OFF
import javax.sound.midi.ShortMessage.NOTE_ON
import kotlin.concurrent.schedule

@Service
class MidiService {
    private var receiver: Receiver? = null

    private val noteOffTimers: MutableMap<NoteEventBasic, TimerTask> = ConcurrentHashMap()

    fun getDevices(): List<MidiDevice> =
        MidiSystem
            .getMidiDeviceInfo()
            .filter { MidiSystem.getMidiDevice(it).maxReceivers != 0 }
            .map { MidiDevice(it.name, it.description) }

    fun setMidiReceiver(selection: MidiDevice) {
        receiver?.close()
        receiver = null

        val info =
            MidiSystem.getMidiDeviceInfo().find {
                it.name.equals(selection.name, ignoreCase = true) &&
                    it.description.equals(selection.description, ignoreCase = true)
            } ?: throw MidiUnavailableException("No suitable midi receiver found")

        val device = MidiSystem.getMidiDevice(info)
        device.open()
        receiver = device.receiver
    }

    fun play(event: ChordEvent) {
        event.stopNotes.forEach(this::stop)
        event.playNotes.forEach(this::play)
    }

    fun play(event: NoteEvent) {
        val current = receiver ?: return

        current.send(ShortMessage(NOTE_ON, event.channel, event.note, event.velocity), -1)

        noteOffTimers.remove(event.basic())?.cancel()

        val autoOff = maxOf(minOf(event.duration ?: 10000, 10000), 100)
        Timer()
            .schedule(autoOff) {
                current.send(ShortMessage(NOTE_OFF, event.channel, event.note, 0), -1)
            }.let { task -> noteOffTimers.put(event.basic(), task) }
    }

    fun stop(event: NoteEventBasic) {
        val current = receiver ?: return
        noteOffTimers.remove(event)?.cancel()
        current.send(ShortMessage(NOTE_OFF, event.channel, event.note, 0), -1)
    }

    fun sendCC(event: CCEvent) {
        val current = receiver ?: return
        current.send(ShortMessage(CONTROL_CHANGE, event.cc, event.value), -1)
    }
}

data class NoteEventBasic(
    val channel: Int,
    val note: Int,
)

data class NoteEvent(
    val channel: Int,
    val note: Int,
    val velocity: Int,
    val duration: Long?,
) {
    fun basic(): NoteEventBasic = NoteEventBasic(channel, note)
}

data class CCEvent(
    val channel: Int,
    val cc: Int,
    val value: Int,
)

data class ChordEvent(
    val playNotes: List<NoteEvent>,
    val stopNotes: List<NoteEventBasic>,
)

data class MidiDevice(
    val name: String,
    val description: String,
)
