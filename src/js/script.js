const commandHistory = JSON.parse(localStorage.getItem('commandHistory')) || [];
let historyIndex = commandHistory.length;

document.addEventListener('keydown', async (event) => {
    const commandInput = document.getElementById('command');
    if (event.key === 'Enter') {
        event.preventDefault();
        const directory = document.getElementById('directory');
        const terminal = document.getElementById('terminal');

        try {
            const commandText = commandInput.value;
            if(!commandText) return;

            commandHistory.push(commandText);
            localStorage.setItem('commandHistory', JSON.stringify(commandHistory));

            const commandLine = createCommandLine(directory.textContent, commandText);
            const result = await processCommand(commandText, directory.textContent);

            if(result.path){
                directory.textContent = result.path;
            }

            const resultParagraph = createResultParagraph(result.message);
            commandLine.appendChild(resultParagraph);
            terminal.insertBefore(commandLine, document.querySelector('.input_line'));
        }catch(error){
            createResultParagraph("An error has ocurred durign the command processing");
        }finally{
            commandInput.value = "";
        }
    }else if(event.key === 'ArrowUp'){
        event.preventDefault();
        if(historyIndex > 0){
            commandInput.value = commandHistory[--historyIndex] || "";
        }
    }else if(event.key == 'ArrowDown'){
        event.preventDefault();
        if(historyIndex < commandHistory.length - 1){
            commandInput.value = commandHistory[++historyIndex] || "";
        }
    }
});

async function request(command, args, path) {
    const url = `http://localhost:8080/${command}`

    try {
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(
{
    'path': path,
    'args': args
}
        ),
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

function createCommandLine(directory, commandText){
    console.log(directory, commandText)
    const commandLine = document.createElement('div');
    commandLine.classList.add('command_line');

    const commandLineParagraph = document.createElement('p');
    commandLineParagraph.textContent = `${directory}> ${commandText}`;

    commandLine.appendChild(commandLineParagraph);
    return commandLine;
}

function createResultParagraph(message){
    const resultParagraph = document.createElement('p');
    resultParagraph.classList.add('resultParagraph');
    resultParagraph.innerHTML = message.replace(/\n/g, "<br>");

    return resultParagraph;
}

async function  processCommand(commandText, currentPath) {
    const commands = commandText.split(' ');
    const command = commands[0];

    switch(command){
        case 'tree':
            const treeResponse = await request('tree', commands, currentPath);
            return { message: treeResponse.replace(/ {4}/g, '\t')};
        case 'echo':
            const echoCommands = parseEchoCommand(commands);
            const echoResponse = await request('echo', echoCommands, currentPath);
            
            return { message: echoResponse.message };
        case 'clear':
            location.reload();
        break;
        case 'history':
            return { message: commandHistory.join('<br>') }
        break;
        default:
            const response = await request(command, commands, currentPath);
            return { message: response.message, path: response.path };
    }
}

function parseEchoCommand(commands) {
    let text = "";
    let redirectIndex = -1;

    for (let i = 1; i < commands.length; i++) {
        if (commands[i] === ">" || commands[i] === ">>") {
            redirectIndex = i;
            break;
        }
        text += (i > 1 ? ' ' : '') + commands[i];
    }

    if (redirectIndex !== -1) {
        return ['echo', text, commands[redirectIndex], commands.slice(redirectIndex + 1).join(' ')];
    }

    return ['echo', text];
}
