package fi.ardento.easychords.midiserver.services

import org.springframework.stereotype.Service
import java.lang.Long.max
import java.lang.Long.min
import java.util.*
import javax.sound.midi.*
import javax.sound.midi.ShortMessage.*
import kotlin.concurrent.schedule

@Service
class MidiService {
    private var receiver: Receiver? = null

    private val noteOffTimers: MutableMap<NoteEventBasic, TimerTask> = mutableMapOf()

    fun getDevices(): List<MidiDevice>{
        return MidiSystem.getMidiDeviceInfo()
            .filter { MidiSystem.getMidiDevice(it).maxReceivers != 0 }
            .map { MidiDevice(it.name, it.description) }
    }

    fun setMidiReceiver(selection: MidiDevice) {
        receiver?.close()
        receiver = null

        for (info in MidiSystem.getMidiDeviceInfo()) {
            if (info.name.equals(selection.name, ignoreCase = true) &&
                info.description.equals(selection.description, ignoreCase = true)) {
                val device = MidiSystem.getMidiDevice(info)
                device.open()
                receiver = device.receiver
                return
            }
        }

        throw MidiUnavailableException("No suitable midi receiver found")
    }

    fun play(event: ChordEvent) {
        event.stopNotes.forEach(this::stop)
        event.playNotes.forEach(this::play)
    }

    fun play(event: NoteEvent){
        val current = receiver ?: return

        current.send(ShortMessage(NOTE_ON, event.channel, event.note, event.velocity), -1)

        noteOffTimers.remove(event.basic())?.cancel()

        val autoOff = max(min(event.duration ?: 10000, 10000), 100)
        Timer().schedule(autoOff){
            current.send(ShortMessage(NOTE_OFF, event.channel, event.note, 0), -1)
        }.let { task -> noteOffTimers.put(event.basic(), task) }
    }

    fun stop(event: NoteEventBasic){
        val current = receiver ?: return
        noteOffTimers.remove(event)?.cancel()
        current.send(ShortMessage(NOTE_OFF, event.channel, event.note, 0), -1)
    }

    fun sendCC(event: CCEvent){
        val current = receiver ?: return
        current.send(ShortMessage(CONTROL_CHANGE, event.cc, event.value), -1)
    }
}

data class NoteEventBasic(
    val channel: Int,
    val note: Int
)

data class NoteEvent(
    val channel: Int,
    val note: Int,
    val velocity: Int,
    val duration: Long?
){
    fun basic(): NoteEventBasic {
        return NoteEventBasic(channel, note)
    }
}

data class CCEvent(
    val channel: Int,
    val cc: Int,
    val value: Int
)

data class ChordEvent(
    val playNotes: List<NoteEvent>,
    val stopNotes: List<NoteEventBasic>
)

data class MidiDevice(
    val name: String,
    val description: String
)
