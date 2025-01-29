document.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()

        const commandInput = document.getElementById('command')

        const commandLine = document.createElement('div')
        const resultLine = document.createElement('div')
        commandLine.classList.add('command_line')

        const commandLineParagraph = document.createElement('p')
        const resultLineParagraph = document.createElement('p')
        const commands = commandInput.value.split(" ")

        try {
            const requestText = await request(commands[0], commands)

            commandLineParagraph.textContent = document.getElementById('directory').textContent + commandInput.value
            resultLineParagraph.innerHTML = requestText.replace(/\n/g, "<br>")

            commandLine.appendChild(commandLineParagraph)
            commandLine.appendChild(resultLineParagraph)

            document.getElementById('terminal').insertBefore(commandLine, document.querySelector('.input_line'))
        } catch (error) {
            console.error("Erro ao processar comando:", error)
        }

        commandInput.value = ""
    }
})

async function request(command, args) {
    const url = `http://localhost:8080/${command}`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json',
                'Accept': 'application/json'
             }
        })

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`)
        }

        const text = await response.text()
        return text
    } catch (error) {
        console.error(error.message)
        return "Erro ao executar comando."
    }
}
