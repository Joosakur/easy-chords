package fi.ardento.easychords.midiserver.controllers

import fi.ardento.easychords.midiserver.services.MidiDevice
import fi.ardento.easychords.midiserver.services.MidiService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/devices")
@CrossOrigin(origins = ["http://localhost:3000", "https://easy-chords.io"])
class DeviceController(
    private val midiService: MidiService,
) {
    @GetMapping
    fun getDevices(): ResponseEntity<List<MidiDevice>> = ResponseEntity.ok(midiService.getDevices())

    @PutMapping
    fun setDevice(
        @RequestBody device: MidiDevice,
    ): ResponseEntity<Unit> {
        midiService.setMidiReceiver(device)
        return ResponseEntity.noContent().build()
    }
}
