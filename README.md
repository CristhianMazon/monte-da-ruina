# 🤠 Monte da Ruína

> "O limite do capital é o limite do risco."

Bem-vindo ao **Monte da Ruína**, um simulador de cassino educativo com temática *Western Luxury*, desenvolvido para demonstrar matematicamente como a casa sempre tem vantagem, tudo isso rodando diretamente no seu navegador.

---

## 👥 Criadores

Este projeto foi idealizado e desenvolvido por:

* **Cristhian Mazon**
* **Eloize Aiume**
* **Gemini** (Co-autor IA / Arquiteto de Código)

---

## 🎲 A Lógica do Jogo

O jogo é uma variação digital do clássico "Three-Card Monte" (ou o jogo da bolinha nos copos). O objetivo é encontrar o **Valete (Ouro)** entre três cartas viradas. Se encontrar a **Caveira (Ruína)**, a aposta é perdida.

### Matemática e Probabilidade (House Edge)

Diferente de um jogo justo (onde 1 em 3 daria 33% de chance), o Monte da Ruína opera com **EV (Valor Esperado) Negativo**, garantindo a vantagem da banca a longo prazo. As probabilidades são calculadas no *backend* (lógica do React) antes da animação ocorrer:

| Nível | Multiplicador | Chance de Vitória | EV (House Edge) |
| :--- | :---: | :---: | :---: |
| 🥉 **Bronze** | **1.5x** | 40% | -0.40 |
| 🥈 **Prata** | **3.0x** | 20% | -0.40 |
| 🥇 **Ouro** | **10.0x** | 5% | -0.50 |

*O sistema utiliza `Math.random()` para determinar o resultado com base nessas porcentagens exatas.*

---

## 🚀 Funcionalidades Principais

### 🔐 Sistema de Contas Local
* **Login & Cadastro:** Sistema de autenticação que roda 100% no navegador (sem backend).
* **Persistência de Dados:** O saldo, histórico de partidas e estatísticas de cada jogador ("Xerife", "Bandido", etc.) ficam salvos no `localStorage` da máquina.
* **Perfis Personalizados:** Galeria de avatares temáticos (estilo "Procurado") e animais do oeste gerados via código.

### 💰 Economia & Mecânicas
* **Carteira (Tesouraria):** Simulação realista de Depósito e Saque via PIX (Fake).
* **Gatilho da Ganância:** Após 3 vitórias seguidas, o jogo desafia o jogador a dobrar a aposta em um modal de "Tudo ou Nada".
* **Game Over (Pé na Cova):** Se o saldo cair abaixo da aposta mínima (R$ 10,00), o jogador "fale" e precisa depositar mais para continuar.

### 🎨 UI/UX Imersiva
* **Identidade Visual:** Paleta de cores Vermelho Sangue (`#580011`) e Dourado (`#FBBF24`) com a fonte *Abhaya Libre ExtraBold*.
* **Áudio:** Efeitos sonoros dramáticos de vitória (torcida) e derrota (sino fúnebre).
* **Humor:** Rodapé com propagandas rotativas falsas e duvidosas do Velho Oeste (ex: "Urubu do Pix", "Vende-se Cavalo Cego").
* **Cartas SVG:** Desenhos vetoriais de Ouro e Caveiras criados via código, sem dependência de imagens externas.

---

## 🛠️ Tecnologias Utilizadas

* **React** + **Vite** (Framework e Build Tool)
* **Tailwind CSS** (Estilização)
* **Framer Motion** (Animações fluídas)
* **Lucide React** (Ícones)
* **Recharts** (Gráficos de estatísticas)
* **DiceBear API** (Geração de Avatares Humanizados)

---

## 📦 Como Rodar o Projeto

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/SEU-USUARIO/Monte-da-Ruina.git](https://github.com/SEU-USUARIO/Monte-da-Ruina.git)
    ```
2.  **Instale as dependências:**
    ```bash
    npm install
    ```
3.  **Rode o servidor local:**
    ```bash
    npm run dev
    ```
4.  Acesse `http://localhost:5173` e divirta-se!

---

*Desenvolvido com 🥃 uísque virtual, React e muita sorte.*
