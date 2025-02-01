document.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()

        const commandInput = document.getElementById('command')

        const commandLine = document.createElement('div')
        commandLine.classList.add('command_line')

        const commandLineParagraph = document.createElement('p')
        const resultLineParagraph = document.createElement('p')
        const commands = commandInput.value.split(" ")

        const path = document.getElementById('directory').textContent
        const directory = document.getElementById('directory')

        try {
            const response = await request(commands[0], commands, path)
            console.log(response)

            commandLineParagraph.textContent = document.getElementById('directory').textContent + ">" + commandInput.value
            resultLineParagraph.innerHTML = response.message.replace(/\n/g, "<br>")

            commandLine.appendChild(commandLineParagraph)
            commandLine.appendChild(resultLineParagraph)

            document.getElementById('terminal').insertBefore(commandLine, document.querySelector('.input_line'))
            directory.textContent = response.path
        } catch (error) {
            console.error("Erro ao processar comando:", error)
        }
        commandInput.value = ""
    }

})

async function request(command, args, path) {
    const url = `http://localhost:8080/${command}`

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({
                'path': path,
                'args': args
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`)
        }

        const json = await response.json()
        return json
    } catch (error) {
        console.error(error.message)
        return "Erro ao executar comando."
    }
}
