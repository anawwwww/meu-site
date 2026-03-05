// ==========================
// PRODUTOS
// ==========================

const produtos = {
    chocolate: {
        nome: "Cookie Chocolate",
        preco: 7.99,
        cor1: "#ff7eb3",
        cor2: "#fa79af",
        corMes: "#fa79af",
        imagem: "imagens/chocolate.png"
    },
    redvelvet: {
        nome: "Cookie Red Velvet",
        preco: 7.99,
        cor1: "#f79a75",
        cor2: "#f79a75",
        corMes: "#f79a75",
        imagem: "imagens/redvelvet.png"
    },
    churros: {
        nome: "Cookie Churros",
        preco: 7.99,
        cor1: "#ecfc63",
        cor2: "#ecfc63",
        corMes: "#ecfc63",
        imagem: "imagens/churros.png"
    },
    pacoca: {
        nome: "Cookie Paçoca",
        preco: 7.99,
        cor1: "#d2691e",
        cor2: "#cd853f",
        corMes: "#8b5e3c",
        imagem: "imagens/paçoca.png"
    }
};

// ==========================
// VARIÁVEIS
// ==========================

let imagemAtual = "chocolate";
let produtosSelecionados = {};
let ordemProdutos = ["chocolate", "redvelvet", "churros", "pacoca"];
let indiceAtual = 0;

const retangulo = document.querySelector(".retangulo");
const menuPedido = document.getElementById("menuPedido");
const fecharMenu = document.getElementById("fecharMenu");


function criarOpcoesModal() {

    const container = document.getElementById("listaProdutos");

    for (let chave in produtos) {

        const produto = produtos[chave];

        const div = document.createElement("div");
        div.classList.add("opcao-produto");
        div.setAttribute("data-produto", chave);
        div.onclick = function() {
            selecionarProduto(this, chave);
        };

        div.innerHTML = `
            <img src="${produto.imagem}" width="150">
            <span>${produto.nome}</span>
        `;

        container.appendChild(div);
    }
}

// ==========================
// TROCAR IMAGEM
// ==========================

function trocarImage() {

    indiceAtual++;
    if (indiceAtual >= ordemProdutos.length) {
        indiceAtual = 0;
    }

    imagemAtual = ordemProdutos[indiceAtual];
    const produtoInfo = produtos[imagemAtual];

    document.getElementById("cookies").src = produtoInfo.imagem;
    retangulo.style.background = produtoInfo.cor1;

    document.querySelectorAll(".botao").forEach(botao => {
        botao.style.backgroundColor = produtoInfo.cor1;
    });

    document.getElementById("destaque").style.color = produtoInfo.corMes;

    document.querySelector(".btn-pedido").style.background =
        `linear-gradient(135deg, ${produtoInfo.cor1}, ${produtoInfo.cor2})`;

    atualizarInfoProduto(imagemAtual);

    if (menuPedido.style.display !== "none") {
    sincronizarProdutoAtualNoModal();
}
}



function sincronizarProdutoAtualNoModal() {

    // limpa seleções visuais
    document.querySelectorAll(".opcao-produto").forEach(op => {
        op.classList.remove("selecionado");
    });

    // limpa quantidades e objeto
    produtosSelecionados = {};
    document.getElementById("containerQuantidades").innerHTML = "";

    // seleciona o produto atual
    const opcao = document.querySelector(`[data-produto="${imagemAtual}"]`);

    if (opcao) {
        opcao.classList.add("selecionado");
        produtosSelecionados[imagemAtual] = 1;
        criarCampoQuantidade(imagemAtual);
    }
}

function atualizarInfoProduto(produto) {
    const produtoInfo = produtos[produto];
    document.getElementById("nomeProduto").innerText = produtoInfo.nome;
    document.getElementById("precoProduto").innerText =
        "Preço: R$ " + produtoInfo.preco.toFixed(2);
}

// ==========================
// MENU
// ==========================

document.querySelector(".btn-pedido").addEventListener("click", () => {
    menuPedido.style.display = "flex";
    sincronizarProdutoAtualNoModal(); 
});

retangulo.addEventListener("click", () => {
    menuPedido.style.display = "flex";
    sincronizarProdutoAtualNoModal(); 
});

fecharMenu.addEventListener("click", () => {
    menuPedido.style.display = "none";
});

// ==========================
// SELEÇÃO
// ==========================

function selecionarProduto(elemento, produto) {

    elemento.classList.toggle("selecionado");

    if (produtosSelecionados[produto]) {
        delete produtosSelecionados[produto];
        removerCampoQuantidade(produto);
    } else {
        produtosSelecionados[produto] = 1;
        criarCampoQuantidade(produto);
    }
}

function criarCampoQuantidade(produto) {

    const container = document.getElementById("containerQuantidades");

    const div = document.createElement("div");
    div.id = "qtd-" + produto;

    div.innerHTML = `
        <label>${produtos[produto].nome}:</label>
        <input type="number" min="1" value="1"
            onchange="atualizarQuantidade('${produto}', this.value)">
    `;

    container.appendChild(div);
}

function removerCampoQuantidade(produto) {
    const campo = document.getElementById("qtd-" + produto);
    if (campo) campo.remove();
}

function atualizarQuantidade(produto, valor) {
    produtosSelecionados[produto] = parseInt(valor);
}

// ==========================
// FORMULÁRIO
// ==========================

document.getElementById("formularioPedido").addEventListener("submit", function(event) {

    event.preventDefault();

    if (Object.keys(produtosSelecionados).length === 0) {
        alert("Escolha pelo menos um sabor!");
        return;
    }

    const nome = document.getElementById("nome").value;
    const turma = document.getElementById("turma").value;
    const detalhes = document.getElementById("detalhes").value || "Sem observações";
    const formaPegamento = document.getElementById("formaPegamento").value;
    const lugarRecebimento = document.getElementById("lugarRecebimento").value;

    let resumoHTML = "<strong>Sabores:</strong><br>";
    let total = 0;

    for (let produto in produtosSelecionados) {

        const info = produtos[produto];
        const quantidade = produtosSelecionados[produto];
        const subtotal = info.preco * quantidade;

        total += subtotal;

        resumoHTML += `${info.nome} (${quantidade}x) - R$ ${subtotal.toFixed(2)}<br>`;
    }

    resumoHTML += `<br><strong>Total: R$ ${total.toFixed(2)}</strong>`;

    document.getElementById("resumoConteudo").innerHTML = resumoHTML;
    document.getElementById("resumoOverlay").style.display = "flex";
    menuPedido.style.display = "none";

    window.dadosPedido = {
        nome,
        turma,
        detalhes,
        formaPegamento,
        lugarRecebimento,
        total,
        produtos: produtosSelecionados
    };
});

// ==========================
// CONFIRMAR
// ==========================

document.getElementById("confirmarResumo").addEventListener("click", function() {

    const dados = window.dadosPedido;

    let nomesProdutos = "";
    for (let produto in dados.produtos) {
        nomesProdutos += `${produtos[produto].nome} (${dados.produtos[produto]}x), `;
    }

    emailjs.send("service_5pji1pg", "template_z30pb36", {
        produto: nomesProdutos,
        nome: dados.nome,
        turma: dados.turma,
        detalhes: dados.detalhes,
        lugar: dados.lugarRecebimento,
        pagamento: dados.formaPegamento,
        total: dados.total.toFixed(2)
    })
    .then(() => {
        alert("Pedido enviado com sucesso!");
        document.getElementById("resumoOverlay").style.display = "none";
    })
    .catch(() => {
        alert("Erro ao enviar pedido.");
    });

});

// ==========================
// CANCELAR
// ==========================

document.getElementById("cancelarResumo").addEventListener("click", function() {
    document.getElementById("resumoOverlay").style.display = "none";
    menuPedido.style.display = "flex";
});

criarOpcoesModal();

