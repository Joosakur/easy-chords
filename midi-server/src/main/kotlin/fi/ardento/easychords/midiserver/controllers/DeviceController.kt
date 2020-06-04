package fi.ardento.easychords.midiserver.controllers

import fi.ardento.easychords.midiserver.services.MidiDevice
import fi.ardento.easychords.midiserver.services.MidiService
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
