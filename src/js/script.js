document.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault()

        const commandInput = document.getElementById('command')

        const commandLine = document.createElement('div')
        commandLine.classList.add('command_line')

        const commandLineParagraph = document.createElement('p')
        const resultLineParagraph = document.createElement('p')
        resultLineParagraph.classList.add('resultParagraph')
        
        const commands = commandInput.value.split(" ")

        const path = document.getElementById('directory').textContent
        const directory = document.getElementById('directory')

        try {
            commandLineParagraph.textContent = document.getElementById('directory').textContent + ">" + commandInput.value
            var response;
            switch (commands[0]) {
                case 'tree':
                    response = await request('tree', commands, path)
                    resultLineParagraph.innerText = response.replace(/ {4}/g, '\t')
                    break;
                default:
                    response = await request(commands[0], commands, path)
                    
                    resultLineParagraph.innerHTML = response.message.replace(/\n/g, "<br>")


                    directory.textContent = response.path
            }
            

            commandLine.appendChild(commandLineParagraph)
            commandLine.appendChild(resultLineParagraph)

            document.getElementById('terminal').insertBefore(commandLine, document.querySelector('.input_line'))

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

        if (command === 'tree') {
            const text = await response.text()
            return text
        } else {
            const json = await response.json()
            return json
        }
    } catch (error) {
        console.error(error.message)
        return "Erro ao executar comando."
    }
}
