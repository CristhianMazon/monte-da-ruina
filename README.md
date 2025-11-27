# 🤠 Monte da Ruína

> "O limite do capital é o limite do risco."

Bem-vindo ao **Monte da Ruína**, um simulador de cassino educativo com temática *Western Luxury*.

Este projeto foi desenvolvido com um **objetivo duplo**:
1.  Demonstrar matematicamente (via *House Edge*) como a "banca" sempre tem vantagem estatística a longo prazo.
2.  **Servir como prova de conceito sobre o que é possível criar com Inteligência Artificial**, utilizando-a como ferramenta principal para gerar código, lógica complexa, design de interface e assets gráficos (SVGs) em tempo recorde.

---

## 👥 Autoria e Desenvolvimento

Projeto idealizado e coordenado por:

* **Cristhian Mazon**
* **Eloize Aiume**

Ferramentas utilizadas:
* **Gemini (IA):** Atuou como ferramenta de par-programação, auxiliando na arquitetura, geração de código React, criação de SVGs (cartas e avatares) e redação de conteúdo criativo.

---

## 🎲 A Lógica do Jogo

O jogo é uma variação digital do clássico "Three-Card Monte". O objetivo é encontrar o **Valete (Ouro)** entre três cartas viradas. Se encontrar a **Caveira (Ruína)**, a aposta é perdida.

### Matemática e Probabilidade (House Edge)

Diferente de um jogo justo, o Monte da Ruína opera com **EV (Valor Esperado) Negativo**. As probabilidades são calculadas no *backend* antes da animação ocorrer:

| Nível | Multiplicador | Chance de Vitória | EV (House Edge) |
| :--- | :---: | :---: | :---: |
| 🥉 **Bronze** | **2.0x** | 45% | -0.10 |
| 🥈 **Prata** | **3.0x** | 20% | -0.20 |
| 🥇 **Ouro** | **10.0x** | 5% | -0.50 |

---

## 🚀 Funcionalidades (Powered by AI)

Toda a lógica abaixo foi implementada para rodar **100% no navegador**, sem necessidade de servidores externos.

### 🔐 Sistema de Contas Local
* **Login & Cadastro:** Autenticação simulada que roda no *Client-Side*.
* **Persistência:** Saldo, histórico e estatísticas individuais salvos no `localStorage`.
* **Perfis:** Galeria de avatares temáticos (Xerife, Bandido) e animais (Lobo, Urso) gerados via código.

### 💰 Economia & Mecânicas
* **Carteira:** Simulação de Depósito e Saque via PIX (Fake).
* **Gatilho da Ganância:** Modal que desafia o jogador a dobrar a aposta após 3 vitórias seguidas.
* **Pé na Cova:** Mecânica de "Game Over" quando o saldo atinge zero.

### 🎨 UI/UX Imersiva
* **Identidade Visual:** Paleta Vermelho Sangue (`#580011`) e Dourado (`#FBBF24`) com tipografia *Abhaya Libre ExtraBold*.
* **Assets via Código:** As cartas (Barras de Ouro e Caveira de Chapéu) são SVGs desenhados diretamente em código, sem arquivos de imagem pesados.
* **Humor:** Rodapé com propagandas rotativas falsas do Velho Oeste (ex: "Urubu do Pix").

---

## 🛠️ Tecnologias

* **React** + **Vite**
* **Tailwind CSS**
* **Framer Motion** (Animações)
* **Lucide React** (Ícones)
* **Recharts** (Gráficos)

---

## 📦 Como Rodar

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
4.  Acesse `http://localhost:5173`.

---

*Desenvolvido como experimento de co-criação Humano-IA.*
