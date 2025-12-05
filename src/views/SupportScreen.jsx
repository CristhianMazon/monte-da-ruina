import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, BookOpen } from 'lucide-react';

// Conteúdo das Dúvidas (Textos criados para cada opção)
const FAQ_DATA = {
    "Como Jogar": (
        <div className="space-y-4">
            <p>Bem-vindo ao <strong>Monte da Ruína</strong>. O jogo é simples, mas exige sangue frio:</p>
            <ol className="list-decimal pl-5 space-y-2">
                <li><strong>Escolha seu Risco:</strong> Defina o multiplicador desejado: Bronze (2x), Prata (4x) ou o temido Ouro (10x).</li>
                <li><strong>Faça sua Aposta:</strong> Use o painel para definir o valor em Reais.</li>
                <li><strong>O Desafio:</strong> Três cartas estão na mesa. Uma esconde o Valete (Tesouro) e duas escondem a Caveira (Ruína), exceto no modo Bronze onde a chance é maior.</li>
                <li><strong>Vitória ou Derrota:</strong> Se achar o Valete, você multiplica seu dinheiro. Se achar a Caveira, a casa leva tudo.</li>
            </ol>
        </div>
    ),
    "Quanto tempo para sacar": (
        <p>A velocidade é essencial. Nossos saques são processados via sistema automatizado de <strong>PIX</strong>. Geralmente, o valor está na sua conta em menos de <strong>3 minutos</strong> após a solicitação. Em casos raros de instabilidade bancária nacional, pode levar até 1 hora.</p>
    ),
    "Dúvidas Sobre EV": (
        <div className="space-y-3">
            <p><strong>EV (Expected Value)</strong> ou Valor Esperado é a matemática por trás do cassino.</p>
            <p>No Monte da Ruína, o EV é levemente negativo. Isso significa que a "Casa" sempre tem uma pequena vantagem estatística no longo prazo para manter a operação.</p>
            <p><em>Exemplo:</em> Se você jogar a moeda (50% de chance) mas receber menos que o dobro da aposta, o EV é negativo. Jogue com consciência de que é entretenimento, não renda.</p>
        </div>
    ),
    "Não consigo sacar": (
        <div className="space-y-2">
            <p>Se o saque falhou, verifique os pontos abaixo:</p>
            <ul className="list-disc pl-5">
                <li>Você tem o saldo mínimo de <strong>R$ 10,00</strong>?</li>
                <li>A chave PIX pertence ao <strong>mesmo CPF</strong> cadastrado na conta? (Não pagamos terceiros).</li>
                <li>Você cumpriu o <em>rollover</em> de eventuais bônus recebidos?</li>
            </ul>
        </div>
    ),
    "Porque não posso parcelar": (
        <p>Nós levamos o <strong>Jogo Responsável</strong> a sério. Permitir parcelamento no cartão de crédito seria incentivar o endividamento. Aceitamos apenas PIX e transferências à vista para garantir que você jogue apenas com o dinheiro que possui no momento, sem comprometer seu futuro financeiro.</p>
    ),
    "Posso jogar com CPF sujo?": (
        <p><strong>Sim, sem problemas.</strong> O Monte da Ruína é um ambiente de lazer. Não realizamos consultas ao SPC ou Serasa. Desde que você seja maior de 18 anos e possua uma conta bancária válida para receber seus prêmios, você é bem-vindo à nossa mesa.</p>
    ),
    "Não consigo iniciar o jogo": (
        <p>Travamentos geralmente são causados pelo navegador. Tente os passos clássicos de suporte: recarregue a página (F5), limpe o cache do navegador ou tente abrir o jogo em uma <strong>Guia Anônima</strong>. Se persistir, verifique se sua conexão de internet está estável.</p>
    ),
    "Problemas de login": (
        <p>Esqueceu a senha? Clique em "Recuperar Senha" na tela inicial para receber um link no seu e-mail. Se sua conta aparece como "Bloqueada", isso ocorre após muitas tentativas falhas. Aguarde 30 minutos e o sistema liberará o acesso automaticamente.</p>
    )
};

const SupportButton = ({ children, onClick }) => (
    <button 
        onClick={onClick}
        className="w-full p-4 border border-[#FBBF24] text-[#FBBF24] rounded-xl bg-transparent hover:bg-[#FBBF24]/10 transition-all duration-200 text-center font-extrabold font-serif shadow-[0_2px_0px_rgba(0,0,0,0.3)] active:scale-95 active:border-[#FBBF24]/50 uppercase tracking-wider text-lg"
    >
        {children}
    </button>
);

const SupportScreen = () => {
    const [selectedTopic, setSelectedTopic] = useState(null);

    // Lista fixa de tópicos conforme a imagem solicitada
    const topics = [
        "Como Jogar",
        "Dúvidas Sobre EV",
        "Quanto tempo para sacar",
        "Porque não posso parcelar",
        "Não consigo sacar",
        "Não consigo iniciar o jogo",
        "Posso jogar com CPF sujo?",
        "Problemas de login"
    ];

    return (
        <div className="max-w-5xl mx-auto w-full mt-8 px-4">
            
            {/* Cabeçalho */}
            <div className="flex items-center justify-center gap-3 mb-10 border-b-4 border-[#FBBF24]/30 pb-6">
                <HelpCircle className="w-10 h-10 text-[#FBBF24]" />
                <h2 className="text-4xl font-extrabold text-[#FBBF24] font-serif tracking-widest uppercase">
                    {selectedTopic ? "Detalhes da Dúvida" : "Central de Ajuda"}
                </h2>
            </div>
            
            {selectedTopic ? (
                // --- TELA DE DETALHES (TEXTO) ---
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-3xl mx-auto">
                    <div className="bg-black/40 border-2 border-[#FBBF24] rounded-3xl p-10 shadow-2xl relative overflow-hidden">
                        {/* Título da Dúvida */}
                        <h3 className="text-3xl text-[#FBBF24] font-extrabold mb-6 border-b border-[#FBBF24]/20 pb-4">
                            {selectedTopic}
                        </h3>

                        {/* Ícone Decorativo */}
                        <BookOpen className="absolute -right-6 -bottom-6 w-48 h-48 text-[#FBBF24]/5 pointer-events-none" />
                        
                        {/* Texto */}
                        <div className="text-xl text-gray-200 leading-relaxed font-serif relative z-10">
                            {FAQ_DATA[selectedTopic]}
                        </div>
                    </div>

                    <button 
                        onClick={() => setSelectedTopic(null)}
                        className="mt-8 flex items-center gap-3 text-[#FBBF24] font-extrabold text-2xl hover:text-white transition-colors group mx-auto"
                    >
                        <ArrowLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" /> 
                        Voltar para o Menu
                    </button>
                </div>
            ) : (
                // --- TELA DE LISTA (BOTÕES IGUAIS À IMAGEM) ---
                <div className="animate-in fade-in duration-500">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        {topics.map((topic) => (
                            <SupportButton key={topic} onClick={() => setSelectedTopic(topic)}>
                                {topic}
                            </SupportButton>
                        ))}
                    </div>

                    {/* Rodapé de contato extra */}
                    <div className="mt-16 text-center">
                        <p className="text-[#FBBF24]/60 font-serif text-lg">
                            Não encontrou o que procurava?
                        </p>
                        <p className="text-[#FBBF24] font-bold mt-2 text-xl">
                            suporte@montedaruina.com
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportScreen;