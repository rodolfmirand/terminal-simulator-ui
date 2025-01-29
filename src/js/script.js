document.addEventListener('keydown', async (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();

        const commandInput = document.getElementById('command');

        if (!command) return; // Se o comando estiver vazio, não faz nada

        const commandLine = document.createElement('div');
        commandLine.classList.add('command_line');

        const paragraph = document.createElement('p');
        const commands = commandInput.value.split(" ");

        try {
            const requestText = await request(commands[0], commands); 

            paragraph.textContent = document.getElementById('directory').textContent + command + " " + requestText;

            commandLine.appendChild(paragraph);

            document.getElementById('terminal').insertBefore(commandLine, document.querySelector('.input_line'));
        } catch (error) {
            console.error("Erro ao processar comando:", error);
        }

        commandInput.value = "";
    }
});

async function request(command, args) {
    const url = `http://localhost:8080/${command}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) {
            throw new Error(`Erro: ${response.status}`);
        }

        const json = await response.json();
        return json.message || JSON.stringify(json); 
    } catch (error) {
        console.error(error.message);
        return "Erro ao executar comando.";
    }
}
