function calcular() {
    var nome = document.getElementById('nome').value.toUpperCase().replace(/[^A-Z]/g, '');
    var dataNascimento = document.getElementById('dataNascimento').value.replace(/[^0-9]/g, '');

    // Verifica se os campos estão preenchidos
    if (nome === '' || dataNascimento === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    // Converte as letras do nome em números e soma
    var nomeTotal = 0;
    for (var i = 0; i < nome.length; i++) {
        var charCode = nome.charCodeAt(i) - 64; // A=1, B=2, ..., Z=26
        nomeTotal += charCode;
    }
    var nomeNumero = reduzirNumero(nomeTotal);

    // Soma os dígitos da data de nascimento
    var dataTotal = 0;
    for (var i = 0; i < dataNascimento.length; i++) {
        dataTotal += parseInt(dataNascimento.charAt(i));
    }
    var dataNumero = reduzirNumero(dataTotal);

    // Exibe os resultados com animação
    exibirNumero('nomeNumero', nomeNumero);
    exibirNumero('dataNumero', dataNumero);

    // Oculta as interpretações anteriores
    document.getElementById('interpretacaoNome').style.display = 'none';
    document.getElementById('interpretacaoData').style.display = 'none';
    document.getElementById('interpretacaoNumograma').classList.remove('visible');
    document.getElementById('interpretacaoNumograma').innerText = '';

    // Desenha o numograma
    drawNumogram(nomeNumero, dataNumero);
}

function reduzirNumero(num) {
    while (num > 9 && num !== 11 && num !== 22 && num !== 33) {
        var soma = 0;
        var numStr = num.toString();
        for (var i = 0; i < numStr.length; i++) {
            soma += parseInt(numStr.charAt(i));
        }
        num = soma;
    }
    return num;
}

function exibirNumero(elementId, numero) {
    var element = document.getElementById(elementId);
    element.innerText = numero;
    element.classList.add('fade-in');
    setTimeout(() => element.classList.remove('fade-in'), 500);
}

function mostrarSignificado(tipo) {
    var numero;
    if (tipo === 'nome') {
        numero = document.getElementById('nomeNumero').innerText;
        document.getElementById('interpretacaoNome').innerText = obterInterpretacao(parseInt(numero));
        document.getElementById('interpretacaoNome').style.display = 'block';
        document.getElementById('interpretacaoData').style.display = 'none';
        document.getElementById('interpretacaoNumograma').classList.remove('visible');
        document.getElementById('interpretacaoNumograma').innerText = '';
    } else if (tipo === 'data') {
        numero = document.getElementById('dataNumero').innerText;
        document.getElementById('interpretacaoData').innerText = obterInterpretacao(parseInt(numero));
        document.getElementById('interpretacaoData').style.display = 'block';
        document.getElementById('interpretacaoNome').style.display = 'none';
        document.getElementById('interpretacaoNumograma').classList.remove('visible');
        document.getElementById('interpretacaoNumograma').innerText = '';
    }
}

function obterInterpretacao(numero) {
    var significados = {
        1: "Início, liderança, independência.",
        2: "Cooperação, equilíbrio, parceria.",
        3: "Criatividade, comunicação, expressão.",
        4: "Estabilidade, ordem, trabalho árduo.",
        5: "Mudança, liberdade, aventura.",
        6: "Harmonia, responsabilidade, cuidado.",
        7: "Espiritualidade, introspecção, sabedoria.",
        8: "Abundância, poder, sucesso material.",
        9: "Compaixão, altruísmo, completude.",
        11: "Intuição elevada, inspiração.",
        22: "Construtor mestre, realização prática.",
        33: "Mestre professor, cura através do amor."
    };
    return significados[numero] || "Sem interpretação disponível.";
}

function drawNumogram(nomeNumero, dataNumero) {
    var canvas = document.getElementById('numogramCanvas');
    var ctx = canvas.getContext('2d');

    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    var centerX = canvas.width / 2;
    var centerY = canvas.height / 2;
    var radius = Math.min(canvas.width, canvas.height) / 2 - 50;

    // Define os números a serem exibidos
    var numbers = [1,2,3,4,5,6,7,8,9,11,22,33];
    var totalNumbers = numbers.length;

    // Armazena as posições dos números para interatividade
    var numberPositions = [];

    // Desenha o círculo externo
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.strokeStyle = '#3f51b5';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Desenha os números ao redor do círculo
    for (var i = 0; i < totalNumbers; i++) {
        var angle = (2 * Math.PI / totalNumbers) * i - Math.PI / 2; // Começa do topo
        var x = centerX + radius * Math.cos(angle);
        var y = centerY + radius * Math.sin(angle);

        // Se o número é o número do nome ou data, destaca
        var num = numbers[i];
        if (num == nomeNumero || num == dataNumero) {
            ctx.fillStyle = '#ff5722';
        } else {
            ctx.fillStyle = '#ffffff';
        }

        ctx.font = '20px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(num, x, y);

        // Salva a posição e o número para interatividade
        numberPositions.push({x: x, y: y, number: num});
    }

    // Torna o canvas interativo
    canvas.onclick = function(event) {
        var rect = canvas.getBoundingClientRect();
        var xClick = event.clientX - rect.left;
        var yClick = event.clientY - rect.top;

        for (var i = 0; i < numberPositions.length; i++) {
            var dx = numberPositions[i].x - xClick;
            var dy = numberPositions[i].y - yClick;
            var distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 15) { // Se clicou próximo ao número
                var selectedNumber = numberPositions[i].number;
                var interpretation = obterInterpretacao(selectedNumber);
                exibirInterpretacaoNumograma(selectedNumber, interpretation);
                break;
            }
        }
    };
}

function exibirInterpretacaoNumograma(numero, interpretacao) {
    var interpretacaoDiv = document.getElementById('interpretacaoNumograma');
    interpretacaoDiv.innerHTML = "<strong>Número " + numero + ":</strong> " + interpretacao;
    interpretacaoDiv.classList.add('visible');
    // Oculta outras interpretações
    document.getElementById('interpretacaoNome').style.display = 'none';
    document.getElementById('interpretacaoData').style.display = 'none';
}
