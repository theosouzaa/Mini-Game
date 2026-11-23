<p align="center">
  <img alt="Ilhéu Colorido" src="https://capsule-render.vercel.app/api?type=waving&height=220&color=0:8bd1d2,55:4b9da2,100:176d77&section=header&text=Ilh%C3%A9u%20Colorido&fontColor=ffffff&fontSize=52&fontAlignY=38&desc=Construa%20devagar.%20Viva%20em%20paz.&descSize=20&descAlignY=60">
</p>

<p align="center">
  Um jogo de construção isométrico, tranquilo e colorido, feito do zero com HTML, CSS e JavaScript puro.<br>
  Depois da tempestade, ajude os moradores a reconstruir o vilarejo e transforme o ilhéu em um novo lar.
</p>

<p align="center">
  <img alt="HTML5" src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white">
  <img alt="CSS3" src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white">
  <img alt="JavaScript" src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black">
  <img alt="Sem dependências" src="https://img.shields.io/badge/depend%C3%AAncias-zero-176d77?style=flat-square">
  <img alt="Roda no navegador" src="https://img.shields.io/badge/roda%20no-navegador-4b9da2?style=flat-square">
</p>

<p align="center">
  <img src="docs/02-partida.png" alt="Vilarejo construído no Ilhéu Colorido" width="780">
</p>

<p align="center">
  <a href="#sobre-o-projeto"><img src="https://api.iconify.design/lucide/book-open.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Sobre</a> &nbsp;•&nbsp;
  <a href="#início-rápido"><img src="https://api.iconify.design/lucide/rocket.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Início rápido</a> &nbsp;•&nbsp;
  <a href="#funcionalidades"><img src="https://api.iconify.design/lucide/sparkles.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Funcionalidades</a> &nbsp;•&nbsp;
  <a href="#como-jogar"><img src="https://api.iconify.design/lucide/gamepad-2.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Como jogar</a> &nbsp;•&nbsp;
  <a href="#pontuação-e-campanha"><img src="https://api.iconify.design/lucide/calculator.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Pontuação</a> &nbsp;•&nbsp;
  <a href="#conquistas"><img src="https://api.iconify.design/lucide/trophy.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Conquistas</a> &nbsp;•&nbsp;
  <a href="#tecnologias"><img src="https://api.iconify.design/lucide/code-xml.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Tecnologias</a>
</p>

---

## Sobre o projeto

**Ilhéu Colorido** é um jogo de construção casual, sem pressa e sem pressão. Você recebe alguns blocos, escolhe onde construir e vai erguendo casas, torres, pontes e jardins sobre um mapa de **19 × 19** células cercado pelo mar.

Uma campanha de **60 desafios divididos em 12 fases** guia a reconstrução: cada pedido cumprido rende **+6 blocos** e **+50 pontos**, e cada bloco precisa ser bem planejado. Moradores passeiam pela ilha, enquanto o indicador de bem-estar responde às casas, árvores, flores, postes e pontes. Se preferir apenas criar, o **Modo livre** oferece blocos infinitos.

O projeto foi desenvolvido pelo **Maré Mansa Studio** e roda direto no navegador, sem instalação, sem frameworks e sem bibliotecas externas. Todo o visual isométrico é desenhado em tempo real em um `<canvas>`, e os efeitos sonoros e a trilha ambiente são sintetizados no código.

### Em números

<table align="center">
  <tr>
    <td align="center" width="140"><img src="https://api.iconify.design/lucide/map.svg?color=%234b9da2" width="28" alt=""><br><b>19 × 19</b><br><sub>células no mapa</sub></td>
    <td align="center" width="140"><img src="https://api.iconify.design/lucide/house.svg?color=%234b9da2" width="28" alt=""><br><b>23</b><br><sub>modelos de casa</sub></td>
    <td align="center" width="140"><img src="https://api.iconify.design/lucide/palette.svg?color=%234b9da2" width="28" alt=""><br><b>12</b><br><sub>cores</sub></td>
    <td align="center" width="140"><img src="https://api.iconify.design/lucide/target.svg?color=%234b9da2" width="28" alt=""><br><b>60</b><br><sub>desafios em 12 fases</sub></td>
    <td align="center" width="140"><img src="https://api.iconify.design/lucide/trophy.svg?color=%234b9da2" width="28" alt=""><br><b>14</b><br><sub>conquistas ilustradas</sub></td>
  </tr>
</table>

---

## Início rápido

Não é preciso instalar nada. O jogo roda direto no navegador.

```bash
git clone https://github.com/theosouzaa/Mini-Game.git
cd Mini-Game/MiniGamee
```

Depois, abra o `index.html` com um duplo clique. Se preferir um servidor local:

```bash
python -m http.server 8000
# acesse http://localhost:8000
```

> [!NOTE]
> Preferências e progresso ficam salvos no próprio navegador (`localStorage`).

---

## Capturas de tela

<table align="center">
  <tr>
    <td align="center" width="50%">
      <img src="docs/01-tela-inicial.png" alt="Tela inicial do Ilhéu Colorido" width="360"><br>
      <b>Tela inicial</b><br>
      <sub>Regras resumidas, <i>Minhas ilhas</i>, <i>Conquistas</i>, <i>Configurações</i> e o botão <i>Continuar partida</i> quando há progresso salvo.</sub>
    </td>
    <td align="center" width="50%">
      <img src="docs/02-partida.png" alt="Partida em andamento com painel de pontos e desafio atual" width="360"><br>
      <b>Construindo o vilarejo</b><br>
      <sub>O painel mostra <i>pontos</i>, <i>blocos</i> e <i>casas</i>, além do desafio atual com barra de progresso.</sub>
    </td>
  </tr>
  <tr>
    <td align="center" colspan="2">
      <img src="docs/03-camera-girada.png" alt="Vilarejo visto de outro ângulo, com ponte de madeira" width="560"><br>
      <b>Câmera giratória</b><br>
      <sub>O mapa gira de 15° em 15°, aproxima, afasta e se move. Aqui, a ponte de madeira liga duas margens do bairro.</sub>
    </td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center"><img src="docs/04-conquistas.png" alt="Lista de conquistas" width="230"><br><sub><b>Conquistas</b></sub></td>
    <td align="center"><img src="docs/05-configuracoes.png" alt="Painel de configurações" width="230"><br><sub><b>Configurações</b></sub></td>
    <td align="center"><img src="docs/06-mobile.png" alt="Jogo no celular" width="230"><br><sub><b>No celular</b></sub></td>
  </tr>
</table>

---

## Funcionalidades

### <img src="https://api.iconify.design/lucide/hammer.svg?color=%234b9da2" width="22" align="absmiddle" alt=""> Construção

| | Recurso | Detalhes |
| :-: | ------- | -------- |
| <img src="https://api.iconify.design/lucide/house.svg?color=%234b9da2" width="22" alt=""> | **23 modelos de casa** | Inclui Moinho, Estufa, Pagode, Cabana, Casa-barco e Solar, além dos modelos originais |
| <img src="https://api.iconify.design/lucide/palette.svg?color=%234b9da2" width="22" alt=""> | **12 cores** | Pêssego, Girassol, Menta, Brisa, Lavanda, Areia, Folha, Coral, Turquesa, Lilás, Concha e Oceano, ou cor aleatória, que evita repetir a cor das casas vizinhas |
| <img src="https://api.iconify.design/lucide/layers.svg?color=%234b9da2" width="22" alt=""> | **Andares empilháveis** | Até **7 andares**, transformando casas em torres |
| <img src="https://api.iconify.design/lucide/route.svg?color=%234b9da2" width="22" alt=""> | **Modo Ponte** | Preencha o vão entre duas casas ou caminhos para criar uma passarela conectada |
| <img src="https://api.iconify.design/lucide/trees.svg?color=%234b9da2" width="22" alt=""> | **Modo Decorar** | Árvore, poste de luz, barco (só na água), banco, flores, fonte, pedra e lanterna |
| <img src="https://api.iconify.design/lucide/eraser.svg?color=%234b9da2" width="22" alt=""> | **Modo Demolir** | Remove um andar, uma ponte ou uma decoração e devolve o bloco |
| <img src="https://api.iconify.design/lucide/undo-2.svg?color=%234b9da2" width="22" alt=""> | **Desfazer e refazer** | Volte ou reaplique ações recentes; o histórico vale durante a sessão atual |

### <img src="https://api.iconify.design/lucide/trending-up.svg?color=%234b9da2" width="22" align="absmiddle" alt=""> Progressão

| | Recurso | Detalhes |
| :-: | ------- | -------- |
| <img src="https://api.iconify.design/lucide/target.svg?color=%234b9da2" width="22" alt=""> | **Campanha** | 60 desafios em 12 fases, com metas de casas, bairros, torres, andares e pontes |
| <img src="https://api.iconify.design/lucide/star.svg?color=%234b9da2" width="22" alt=""> | **Avaliação** | Até 3 estrelas no final, com a melhor pontuação guardada |
| <img src="https://api.iconify.design/lucide/trophy.svg?color=%234b9da2" width="22" alt=""> | **Conquistas** | 14 conquistas desbloqueáveis, cada uma com emblema SVG exclusivo e aviso sonoro na partida |
| <img src="https://api.iconify.design/lucide/infinity.svg?color=%234b9da2" width="22" alt=""> | **Modo livre** | Blocos infinitos para criar sem se preocupar com recursos |
| <img src="https://api.iconify.design/lucide/users.svg?color=%234b9da2" width="22" alt=""> | **Moradores e bem-estar** | Pequenos moradores circulam entre as casas; o indicador considera casas e elementos de convivência |

### <img src="https://api.iconify.design/lucide/camera.svg?color=%234b9da2" width="22" align="absmiddle" alt=""> Câmera e visual

| | Recurso | Detalhes |
| :-: | ------- | -------- |
| <img src="https://api.iconify.design/lucide/rotate-3d.svg?color=%234b9da2" width="22" alt=""> | **Câmera livre** | Rotação do mapa, zoom, movimentação e botão **Centralizar** |
| <img src="https://api.iconify.design/lucide/waves.svg?color=%234b9da2" width="22" alt=""> | **Cenário e clima** | Ciclo de dia e noite, escolha de dia/noite fixos, chuva, lua, estrelas, postes iluminados e velocidade das animações |
| <img src="https://api.iconify.design/lucide/volume-2.svg?color=%234b9da2" width="22" alt=""> | **Áudio sintetizado** | Efeitos sonoros e trilha ambiente gerados por código, com controle de som, trilha e volume |

### <img src="https://api.iconify.design/lucide/save.svg?color=%234b9da2" width="22" align="absmiddle" alt=""> Salvamento

| | Recurso | Detalhes |
| :-: | ------- | -------- |
| <img src="https://api.iconify.design/lucide/hard-drive.svg?color=%234b9da2" width="22" alt=""> | **Automático** | Progresso salvo no navegador, com botão **Continuar partida** |
| <img src="https://api.iconify.design/lucide/image-down.svg?color=%234b9da2" width="22" alt=""> | **Minhas ilhas** | Salve até **8 vilarejos**, renomeie, reabra, exclua e **exporte a ilha como imagem PNG** |

### <img src="https://api.iconify.design/lucide/accessibility.svg?color=%234b9da2" width="22" align="absmiddle" alt=""> Acessibilidade

| | Recurso | Detalhes |
| :-: | ------- | -------- |
| <img src="https://api.iconify.design/lucide/contrast.svg?color=%234b9da2" width="22" alt=""> | **Visual adaptável** | Alto contraste, interface ampliada e paleta alternativa para diferenciar melhor as casas |
| <img src="https://api.iconify.design/lucide/keyboard.svg?color=%234b9da2" width="22" alt=""> | **Teclado e leitores de tela** | Totalmente jogável pelo teclado, com rótulos ARIA e anúncios para leitores de tela |
| <img src="https://api.iconify.design/lucide/pause.svg?color=%234b9da2" width="22" alt=""> | **Menos movimento** | Opção para reduzir animações, que já respeita a preferência do sistema |

---

## Como jogar

<table>
  <tr>
    <td width="48" align="center"><b>1</b></td>
    <td>Na tela inicial, clique em <b>Começar a construir</b> (ou em <b>Continuar partida</b>, se houver progresso salvo).</td>
  </tr>
  <tr>
    <td align="center"><b>2</b></td>
    <td>Você começa com <b>20 blocos</b>. Cada clique em uma célula livre constrói uma casa e gasta 1 bloco.</td>
  </tr>
  <tr>
    <td align="center"><b>3</b></td>
    <td>Clique de novo na mesma casa para <b>empilhar andares</b> (até 7).</td>
  </tr>
  <tr>
    <td align="center"><b>4</b></td>
    <td>Escolha o <b>modelo</b> e a <b>cor</b> da próxima construção nos controles abaixo do mapa.</td>
  </tr>
  <tr>
    <td align="center"><b>5</b></td>
    <td>Use <b>Ponte</b> para ligar casas separadas por um vão e <b>Decorar</b> para embelezar a ilha.</td>
  </tr>
  <tr>
    <td align="center"><b>6</b></td>
    <td>Use <b>Demolir</b> para remover um andar e recuperar o bloco. Se errou, use <b>Desfazer</b> ou <b>Refazer</b>.</td>
  </tr>
  <tr>
    <td align="center"><b>7</b></td>
    <td>Cumpra o <b>desafio</b> mostrado no topo para ganhar <b>+6 blocos</b> e <b>+50 pontos</b>.</td>
  </tr>
</table>

> [!IMPORTANT]
> **Vitória:** conclua os 60 desafios. **Fim de jogo:** os blocos acabam antes disso.

### Fluxo do jogo

```mermaid
flowchart LR
    A(["Começar a construir"]) --> B["Construir casas, andares,<br>pontes e decorações"]
    B --> C{"Desafio<br>cumprido?"}
    C -- Sim --> D["+6 blocos<br>+50 pontos"]
    D --> E{"Completou os<br>60 desafios?"}
    E -- Sim --> F(["Um novo lar floresceu"])
    E -- Não --> B
    C -- Não --> G{"Ainda há<br>blocos?"}
    G -- Sim --> B
    G -- Não --> H(["Fim de jogo"])

    style A fill:#4b9da2,stroke:#176d77,color:#fff
    style F fill:#2ea44f,stroke:#1f7a38,color:#fff
    style H fill:#d1664a,stroke:#a34a33,color:#fff
```

### Controles

| Ação | Mouse / toque | Teclado |
| ---- | ------------- | ------- |
| <img src="https://api.iconify.design/lucide/mouse-pointer-click.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Construir / empilhar andar | Clique ou toque na célula | <kbd>Enter</kbd> ou <kbd>Espaço</kbd> |
| <img src="https://api.iconify.design/lucide/eraser.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Demolir | Botão direito (ou modo **Demolir**) | <kbd>D</kbd> alterna o modo Demolir |
| <img src="https://api.iconify.design/lucide/undo-2.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Desfazer | Botão **Desfazer** | <kbd>Z</kbd> |
| <img src="https://api.iconify.design/lucide/redo-2.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Refazer | Botão **Refazer** | <kbd>Ctrl</kbd> + <kbd>Y</kbd> |
| <img src="https://api.iconify.design/lucide/move.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Navegar pelo tabuleiro | Passar o mouse | <kbd>←</kbd> <kbd>↑</kbd> <kbd>↓</kbd> <kbd>→</kbd> |
| <img src="https://api.iconify.design/lucide/house.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Trocar modelo da casa | Menu **Modelo** | <kbd>M</kbd> |
| <img src="https://api.iconify.design/lucide/rotate-3d.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Girar a câmera | Arrastar com o botão esquerdo, <kbd>Shift</kbd> + roda, ou botões ↶ ↷ | <kbd>Q</kbd> e <kbd>E</kbd> (15° por vez) |
| <img src="https://api.iconify.design/lucide/hand.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Mover a câmera | <kbd>Alt</kbd> + arrastar, ou botão do meio | n/d |
| <img src="https://api.iconify.design/lucide/zoom-in.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Zoom | Roda do mouse, ou botões **+** e **−** | n/d |
| <img src="https://api.iconify.design/lucide/locate-fixed.svg?color=%234b9da2" width="16" align="absmiddle" alt=""> Centralizar a câmera | Botão **Centralizar** | n/d |

O horário, clima e velocidade das animações podem ser ajustados em **Configurações**. A trilha ambiente também pode ser ligada ou desligada por lá.

---

## Pontuação e campanha

| Ação | Pontos |
| ---- | :----- |
| Construir uma casa nova | **+10**, mais **+5** por casa vizinha |
| Adicionar um andar | **+5**, mais **+3** × andares que a casa já tem |
| Construir uma ponte | **+4** |
| Cumprir um desafio | **+50** (e **+6 blocos**) |
| Demolir um andar | **−5** (e recupera 1 bloco) |

Os desafios variam entre construir casas, **unir casas num mesmo bairro** (conectadas lado a lado ou por pontes), erguer **torres** (4 andares ou mais), somar **andares** na ilha e **ligar bairros com pontes**. A dificuldade aumenta a cada fase, e a última etapa pede, por exemplo, somar 180 andares e expandir a rede para 8 pontes.

---

## Conquistas

| | Conquista | Como desbloquear |
| :-: | --------- | ---------------- |
| <img src="https://api.iconify.design/lucide/house.svg?color=%234b9da2" width="20" alt=""> | **Primeiro lar** | Construa a primeira casa |
| <img src="https://api.iconify.design/lucide/castle.svg?color=%234b9da2" width="20" alt=""> | **Passagem antiga** | Construa uma casa com arcada |
| <img src="https://api.iconify.design/lucide/trees.svg?color=%234b9da2" width="20" alt=""> | **Ilha verde** | Coloque três árvores |
| <img src="https://api.iconify.design/lucide/route.svg?color=%234b9da2" width="20" alt=""> | **Margens unidas** | Construa quatro pontes conectadas |
| <img src="https://api.iconify.design/lucide/palette.svg?color=%234b9da2" width="20" alt=""> | **Bairro colorido** | Use seis cores diferentes |
| <img src="https://api.iconify.design/lucide/building-2.svg?color=%234b9da2" width="20" alt=""> | **Cidade florescida** | Construa 45 casas |
| 🌳 | **Guardião do bosque** | Plante oito árvores |
| 🌸 | **Jardim em festa** | Decore oito espaços com flores |
| 💡 | **Luzes da vila** | Instale cinco postes de luz |
| 🏛️ | **Mestre das formas** | Construa usando dez modelos diferentes |
| 🔦 | **Guardião da costa** | Construa um farol |
| 🌈 | **Paleta completa** | Use dez cores diferentes |
| 🌉 | **Grande travessia** | Construa oito pontes |
| 🏙️ | **Grande cidade** | Construa 80 casas |

---

## Tecnologias

<p align="center">
  <img alt="HTML, CSS e JavaScript" src="https://skillicons.dev/icons?i=html,css,js&perline=3">
</p>

| Tecnologia | Uso no projeto |
| ---------- | -------------- |
| **HTML5** | Estrutura das telas, diálogos nativos (`<dialog>`) e `<canvas>` |
| **CSS3** | Layout com Flexbox e Grid, variáveis CSS, animações, temas de acessibilidade e design responsivo |
| **JavaScript (ES6+)** | Toda a lógica do jogo, sem frameworks nem bibliotecas |
| **Canvas 2D API** | Renderização isométrica em tempo real, com ordenação de profundidade e rotação de câmera |
| **Web Audio API** | Efeitos sonoros sintetizados com osciladores, sem arquivos de áudio |
| **Pointer Events** | Controle unificado de mouse e toque |
| **localStorage** | Salvamento automático, preferências, melhor pontuação, conquistas e ilhas salvas |

---

## Estrutura do projeto

```text
Mini-Game/
├── docs/                  # Capturas de tela usadas neste README
├── MiniGamee/
│   ├── index.html         # Telas do jogo, painéis e diálogos
│   ├── style.css          # Visual, cenário animado, responsividade e acessibilidade
│   └── script.js          # Lógica, renderização no canvas, áudio e salvamento
└── README.md
```

---

## Ideias para o futuro

- [ ] Novos modelos de casa e mais decorações
- [ ] Mais fases e desafios para a campanha
- [ ] Ciclo de dia e noite com os postes acendendo
- [ ] Trilha sonora ambiente
- [ ] Publicar o jogo online com GitHub Pages

---

<p align="center">
  Desenvolvido por <a href="https://github.com/theosouzaa"><img src="https://api.iconify.design/simple-icons/github.svg?color=%234b9da2" width="16" align="absmiddle" alt="GitHub"> <b>@theosouzaa</b></a> · Maré Mansa Studio<br>
  <sub>Gostou do projeto? Deixe uma <img src="https://api.iconify.design/lucide/star.svg?color=%23f5b301" width="14" align="absmiddle" alt="estrela"> no repositório.</sub>
</p>

<p align="center">
  <img alt="Rodapé" src="https://capsule-render.vercel.app/api?type=waving&height=110&color=0:8bd1d2,55:4b9da2,100:176d77&section=footer">
</p>
