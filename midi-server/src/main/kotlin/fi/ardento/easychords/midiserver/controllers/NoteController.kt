package fi.ardento.easychords.midiserver.controllers

import fi.ardento.easychords.midiserver.services.CCEvent
import fi.ardento.easychords.midiserver.services.ChordEvent
import fi.ardento.easychords.midiserver.services.MidiService
import fi.ardento.easychords.midiserver.services.NoteEvent
import fi.ardento.easychords.midiserver.services.NoteEventBasic
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.CrossOrigin
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController

@RestController
@CrossOrigin(origins = ["http://localhost:3000", "https://easy-chords.io"])
class NoteController(
    private val midiService: MidiService,
) {
    @PostMapping("/notes")
    fun playNote(
        @RequestBody note: NoteEvent,
    ): ResponseEntity<Unit> {
        midiService.play(note)
        return ResponseEntity.noContent().build()
    }

    @DeleteMapping("/channels/{channel}/notes/{note}")
    fun stopNote(
        @PathVariable channel: Int,
        @PathVariable note: Int,
    ): ResponseEntity<Unit> {
        midiService.stop(NoteEventBasic(channel, note))
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/cc")
    fun sendCC(
        @RequestBody event: CCEvent,
    ): ResponseEntity<Unit> {
        midiService.sendCC(event)
        return ResponseEntity.noContent().build()
    }

    @PostMapping("/chords")
    fun playChord(
        @RequestBody event: ChordEvent,
    ): ResponseEntity<Unit> {
        midiService.play(event)
        return ResponseEntity.noContent().build()
    }
}
