package fi.ardento.musicmaker.musicmakermidiserver.controllers

import fi.ardento.musicmaker.musicmakermidiserver.services.MidiDevice
import fi.ardento.musicmaker.musicmakermidiserver.services.MidiService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/devices")
@CrossOrigin(origins = ["http://localhost:3000", "https://easy-chords.io"])
class DeviceController(
    private val midiService: MidiService
) {
    @GetMapping
    fun getDevices(): ResponseEntity<List<MidiDevice>> {
        return midiService.getDevices().let { ResponseEntity.ok(it) }
    }

    @PutMapping
    fun setDevice(
        @RequestBody device: MidiDevice
    ): ResponseEntity<Unit> {
        midiService.setMidiReceiver(device)
        return ResponseEntity.noContent().build()
    }

}
