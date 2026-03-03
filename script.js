const produtos = {
    cookie: {
        nome: "Cookie Tradicional",
        preco: 8.00,
        cor1: "#ff7eb3",
        cor2: "#ff4d94",
        corMes: "#ff4d94",
        imagem: "imagens/cookie.jpeg"
    },
    redvelvet: {
        nome: "Cookie Red Velvet",
        preco: 9.00,
        cor1: "#ffe259",
        cor2: "#ffe259",
        corMes: "#ffe259",
        imagem: "imagens/redvelvet.jpeg"
    },
    churros: {
        nome: "Cookie Churros",
        preco: 9.00,
        cor1: "#72eaff",
        cor2: "#62d9ee",
        corMes: "#62d9ee",
        imagem: "imagens/churros.jpeg"
    }
};
document.querySelector(".btn-pedido").addEventListener("click", function() {
    menuPedido.style.display = "flex";
    selecionarProdutoAutomatico(); // 👈 adiciona isso
});

function atualizarInfoProduto(produto) {

    const produtoInfo = produtos[produto];

    document.getElementById("nomeProduto").innerText = produtoInfo.nome;
    document.getElementById("precoProduto").innerText = "Preço: R$ " + produtoInfo.preco.toFixed(2);
    
}

let imagemAtual = "cookie";

function trocarImage() {

    if (imagemAtual === "cookie") {
        imagemAtual = "redvelvet";
    } else if (imagemAtual === "redvelvet") {
        imagemAtual = "churros";
    } else {
        imagemAtual = "cookie";
    }

    const produtoInfo = produtos[imagemAtual];

    const img = document.getElementById("cookies");
    const retangulo = document.querySelector(".retangulo");
    const botoes = document.querySelectorAll(".botao");
    const botaoPedido = document.querySelector(".btn-pedido");
    const destaque = document.getElementById("destaque");

    img.src = produtoInfo.imagem;

    retangulo.style.background = produtoInfo.cor1;

    botoes.forEach(botao => {
        botao.style.backgroundColor = produtoInfo.cor1;
    });

    destaque.style.color = produtoInfo.corMes;

    botaoPedido.style.background =
        `linear-gradient(135deg, ${produtoInfo.cor1}, ${produtoInfo.cor2})`;

    atualizarInfoProduto(imagemAtual);
}

const retangulo = document.querySelector(".retangulo");
const menuPedido = document.getElementById("menuPedido");
const fecharMenu = document.getElementById("fecharMenu");

retangulo.addEventListener("click", () => {
    menuPedido.style.display = "flex";


    selecionarProdutoAutomatico();
});

fecharMenu.addEventListener("click", () => {
    menuPedido.style.display = "none";
});


function selecionarProdutoAutomatico() {

    const opcoes = document.querySelectorAll(".opcao-produto");

    opcoes.forEach(op => op.classList.remove("selecionado"));

    const opcaoSelecionada = document.querySelector(`[data-produto="${imagemAtual}"]`);

    if (opcaoSelecionada) {
        opcaoSelecionada.classList.add("selecionado");
        document.getElementById("produtoSelecionado").value = imagemAtual;
    }
}

function selecionarProduto(elemento, produto) {

    const opcoes = document.querySelectorAll(".opcao-produto");
    opcoes.forEach(op => op.classList.remove("selecionado"));
    elemento.classList.add("selecionado");
    document.getElementById("produtoSelecionado").value = produto;
}

document.getElementById("formularioPedido").addEventListener("submit", function(event) {

    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const turma = document.getElementById("turma").value;
    const quantidade = document.getElementById("quantidade").value;
    const detalhes = document.getElementById("detalhes").value || "Sem observações";
    const formaPegamento = document.getElementById("formaPegamento").value;
    const lugarRecebimento = document.getElementById("lugarRecebimento").value;
    const produto = document.getElementById("produtoSelecionado").value;

    if (!produto) {
        alert("Escolha um produto primeiro!");
        return;
    }

    let produtoNome = produtos[produto].nome;

    alert(
        "Pedido confirmado!\n\n" +
        "Produto: " + produtoNome + "\n" +
        "Nome: " + nome + "\n" +
        "Turma: " + turma + "\n" +
        "Quantidade: " + quantidade + "\n" +
        "Detalhes: " + detalhes + "\n" +
        "Lugar de Recebimento: " + lugarRecebimento + "\n" +
        "Forma de Pegamento: " + formaPegamento
    );

    emailjs.send("service_5pji1pg", "template_z30pb36", {
    produto: produtoNome,
    nome: nome,
    turma: turma,
    quantidade: quantidade,
    detalhes: detalhes,
    lugar: lugarRecebimento,
    pagamento: formaPegamento
})
.then(function(response) {
    alert("Pedido enviado com sucesso!");
    menuPedido.style.display = "none";
})
.catch(function(error) {
    alert("Erro ao enviar pedido.");
});

    menuPedido.style.display = "none";
});
