document.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        event.preventDefault()

        const commandLine = document.createElement('div')
        commandLine.classList.add('command_line')

        const paragraph = document.createElement('p')
        paragraph.textContent = document.getElementById('directory').textContent + document.getElementById('command').value

        commandLine.appendChild(paragraph)

        document.getElementById('terminal').insertBefore(commandLine, document.querySelector('.input_line'))

        document.getElementById('command').value = ""
    }
})