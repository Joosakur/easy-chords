package fi.ardento.easychords.midiserver

import org.springframework.boot.CommandLineRunner
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.builder.SpringApplicationBuilder
import java.net.InetAddress
import javax.swing.Box
import javax.swing.BoxLayout
import javax.swing.JFrame
import javax.swing.JLabel
import javax.swing.JPanel
import javax.swing.JTextField

@SpringBootApplication
class EasyChordsMidiServer : CommandLineRunner {
    override fun run(vararg args: String) {
        val inetAddress = InetAddress.getLocalHost()

        val frame = JFrame("EasyChords Server")
        frame.defaultCloseOperation = JFrame.EXIT_ON_CLOSE
        frame.setSize(400, 200)
        val panel = JPanel()
        panel.layout = BoxLayout(panel, BoxLayout.Y_AXIS)
        panel.add(JLabel("Server is running and providing MIDI connections"))
        panel.add(Box.createVerticalStrut(20))
        panel.add(JLabel("IP:"))
        panel.add(JTextField(inetAddress.hostAddress).also { it.isEditable = false })
        panel.add(JLabel("Hostname:"))
        panel.add(JTextField(inetAddress.hostName).also { it.isEditable = false })
        frame.contentPane = panel
        frame.isVisible = true
    }
}

fun main(args: Array<String>) {
    SpringApplicationBuilder(EasyChordsMidiServer::class.java).headless(false).run(*args)
}
