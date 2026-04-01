// ==========================
// PRODUTOS
// ==========================

const produtos = {
    cheddar: {
        nome: "Hambúrguer Cheddar",
        preco: 27.00,
        cor1: "#ff7eb3",
        cor2: "#fa79af",
        corMes: "#fa79af",
        imagem: "imagens/chedar.png"
    },
    salada: {
        nome: "Hambúrguer com Salada",
        preco: 27.00,
        cor1: "#70ffb0",
        cor2: "#70ffb0",
        corMes: "#54e696",
        imagem: "imagens/ham.png"
    },
    combo: {
        nome: "Combo Hambúrguer + Batata + adicionais",
        preco: 35.00,
        cor1: "#f2ff7e",
        cor2: "#f2ff7e",
        corMes: "#ecfc63",
        imagem: "imagens/cc.png"
    },
    batata: {
        nome: "Batata Frita",
        preco: 12.00,
        cor1: "#db7815",
        cor2: "#db7815",
        corMes: "#8b5e3c",
        imagem: "imagens/bt.png"
    }
};

// ==========================
// VARIÁVEIS
// ==========================

let imagemAtual = "cheddar";
let produtosSelecionados = {};
let ordemProdutos = ["cheddar", "salada", "combo", "batata"];
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



const adicionais = {
    batata: { nome: "Batata Frita", preco: 12 },
    calabresa: { nome: "Calabresa", preco: 5 },
    bacon: { nome: "Bacon", preco: 5 }
};



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
    
};


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

    if (!produtosSelecionados[produto]) {

    produtosSelecionados[produto] = 1;
    criarCampoQuantidade(produto);

    const aviso = document.getElementById("avisoCombo");

    if (produto === "combo") {

    aviso.style.display = "block";

    } else {

    // verifica se ainda existe combo selecionado
    if (!produtosSelecionados["combo"]) {
        aviso.style.display = "none";
    }

    atualizarAvisoMultiplos();
}

}
    
}



function criarCampoQuantidade(produto) {

    if (document.getElementById("qtd-" + produto)) return;
    const container = document.getElementById("containerQuantidades");

    const div = document.createElement("div");
    div.id = "qtd-" + produto;
    div.classList.add("item-produto");

    div.innerHTML = `
        <span>${produtos[produto].nome}</span>

        <input type="number" min="1" value="1"
            onchange="atualizarQuantidade('${produto}', this.value)">

        <button type="button" onclick="removerProduto('${produto}')" class="btn-remover">✖</button>
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

function atualizarAvisoMultiplos() {

    const avisoCombo = document.getElementById("avisoCombo");
    const avisoMultiplos = document.getElementById("avisoMultiplos");

    const temCombo = produtosSelecionados["combo"];
    const quantidade = Object.keys(produtosSelecionados).length;

    // 🔴 AVISO DO COMBO
    if (temCombo) {
        avisoCombo.style.display = "block";
    } else {
        avisoCombo.style.display = "none";
    }

    // 🟡 AVISO DE MÚLTIPLOS
    if (quantidade > 1) {
        avisoMultiplos.style.display = "block";
    } else {
        avisoMultiplos.style.display = "none";
    }
}

function removerProduto(produto) {

    delete produtosSelecionados[produto];

    const campo = document.getElementById("qtd-" + produto);
    if (campo) campo.remove();

    const opcao = document.querySelector(`[data-produto="${produto}"]`);
    if (opcao) opcao.classList.remove("selecionado");

    if (produto === "combo") {
    document.getElementById("avisoCombo").style.display = "none";

    atualizarAvisoMultiplos();
}
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

    
    let total = 0;
    let adicionaisSelecionados = [];
let resumoHTML = "<strong>Sabores:</strong><br>";

// PRODUTOS
for (let produto in produtosSelecionados) {

    const info = produtos[produto];
    const quantidade = produtosSelecionados[produto];
    const subtotal = info.preco * quantidade;

    total += subtotal;

    resumoHTML += `${info.nome} (${quantidade}x)<br>`;


   

    resumoHTML += "<br>";
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
    produtos: produtosSelecionados,
    adicionais: adicionaisSelecionados
};
});


function selecionarAdicional(elemento) {

    const valor = elemento.value;

    if (elemento.checked) {
        adicionaisSelecionados.push(valor);
    } else {
        adicionaisSelecionados =
            adicionaisSelecionados.filter(a => a !== valor);
    }
}

// ==========================
// CONFIRMAR
// ==========================

document.getElementById("confirmarResumo").addEventListener("click", function() {

    const dados = window.dadosPedido;

    let nomesProdutos = "";

for (let produto in dados.produtos) {
    nomesProdutos += `${produtos[produto].nome} (${dados.produtos[produto]}x), `;
}


let adicionaisTexto = "";

dados.adicionais.forEach(a => {
    adicionaisTexto += adicionais[a].nome + ", ";
});

    emailjs.send("service_k13o1jm", "template_ngqxhv8", {
        produto: nomesProdutos,
        nome: dados.nome,
        turma: dados.turma,
        detalhes: dados.detalhes,
        adicionais: adicionaisTexto,
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


