import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

const FAKE_ADS = [
    // --- AS ORIGINAIS (20) ---
    { id: 1, text: "💸 PRECISANDO DE DINHEIRO? O AGIOTA BILLY COBRA SÓ 50% DE JUROS AO DIA!", subtext: "Aceitamos cavalos, dentes de ouro e a escritura da sua casa.", bg: "bg-gradient-to-r from-green-900 to-green-600", border: "border-green-400" },
    { id: 2, text: "🐴 VENDE-SE CAVALO CEGO. ÓTIMO PARA LASANHA.", subtext: "Tratar com o Açougueiro da esquina (não faça perguntas).", bg: "bg-gradient-to-r from-red-900 to-red-600", border: "border-red-400" },
    { id: 3, text: "🍺 PROMOÇÃO NO SALOON: PAGUE 1 E LEVE UM TIRO DE GRAÇA!", subtext: "Oferta válida apenas para forasteiros que olharem torto.", bg: "bg-gradient-to-r from-amber-900 to-amber-600", border: "border-amber-400" },
    { id: 4, text: "🔮 CARTOMANTE MADAME ZORA: PREVEJO QUE VOCÊ VAI PERDER TUDO HOJE!", subtext: "Consultas a partir de R$ 5,00. Traga seu desespero.", bg: "bg-gradient-to-r from-purple-900 to-purple-600", border: "border-purple-400" },
    { id: 5, text: "⚠️ CUIDADO: O JOGO VICIA (MAS A GENTE ADORA O SEU DINHEIRO).", subtext: "Jogue com responsabilidade (ou não, quem liga?).", bg: "bg-gradient-to-r from-blue-900 to-blue-600", border: "border-blue-400" },
    { id: 6, text: "💋 MÃES SOLTEIRAS EM [SEU BAIRRO] QUEREM CONHECER VOCÊ AGORA!", subtext: "Elas odeiam joguinhos... mas adoram quem ganha no Monte da Ruína!", bg: "bg-gradient-to-r from-pink-900 to-pink-600", border: "border-pink-400" },
    { id: 7, text: "🧪 ELIXIR DO DR. SNAKE: CURA CALVÍCIE, ESPINHELA CAÍDA E DÍVIDA DE JOGO!", subtext: "Feito com 100% de óleo de cobra e querosene. Resultado (ou morte) garantido.", bg: "bg-gradient-to-r from-emerald-900 to-emerald-600", border: "border-emerald-400" },
    { id: 8, text: "🚂 GANHE R$ 5.000 POR DIA TRABALHANDO DE CASA (ASSALTANDO TREM)!", subtext: "Vagas limitadas. Necessário cavalo próprio e falta de amor à vida.", bg: "bg-gradient-to-r from-gray-900 to-gray-600", border: "border-gray-400" },
    { id: 9, text: "🗺️ VENDE-SE MAPA DO TESOURO (USADO APENAS UMA VEZ).", subtext: "O antigo dono não precisou mais (morreu misteriosamente).", bg: "bg-gradient-to-r from-yellow-900 to-yellow-600", border: "border-yellow-400" },
    { id: 10, text: "🦷 COMPRAMOS DENTADURA DE OURO. PAGAMENTO À VISTA.", subtext: "Não nos importamos se ainda estiver na boca do dono.", bg: "bg-gradient-to-r from-orange-900 to-orange-600", border: "border-orange-400" },
    { id: 11, text: "🚀 URUBU DO PIX DO VELHO OESTE: MANDE 10 E RECEBA 100!", subtext: "Confia no pai. O Xerife já investiu (e tá procurando a gente).", bg: "bg-gradient-to-r from-cyan-900 to-cyan-600", border: "border-cyan-400" },
    { id: 12, text: "📚 CURSO: 'COMO GANHAR NO PÔQUER SEM SABER CONTAR'.", subtext: "Arrasta pra cima e aprenda a blefar como um político.", bg: "bg-gradient-to-r from-indigo-900 to-indigo-600", border: "border-indigo-400" },
    { id: 13, text: "👻 LIMPE SEU NOME NO SPC/SERASA COM MAGIA NEGRA!", subtext: "Pacto renovável mensalmente. Aceitamos alma como entrada.", bg: "bg-gradient-to-r from-violet-900 to-violet-600", border: "border-violet-400" },
    { id: 14, text: "🌵 ALUGAM-SE MULAS RÁPIDAS PARA FUGA IMEDIATA.", subtext: "Discretas, não relincham e conhecem os atalhos para o México.", bg: "bg-gradient-to-r from-lime-900 to-lime-600", border: "border-lime-400" },
    { id: 15, text: "🔫 AULAS DE DUELO: APRENDA A ATIRAR OU SEU DINHEIRO DE VOLTA!", subtext: "*Reembolso válido apenas para alunos sobreviventes.", bg: "bg-gradient-to-r from-rose-900 to-rose-600", border: "border-rose-400" },
    { id: 16, text: "💍 TROCO SOGRA POR DOIS MAÇOS DE CIGARRO E UM UÍSQUE.", subtext: "Ela cozinha bem, mas reclama muito. Negócio urgente.", bg: "bg-gradient-to-r from-stone-800 to-stone-600", border: "border-stone-400" },
    { id: 17, text: "🩺 PROCURA-SE MÉDICO QUE SAIBA TIRAR BALA SEM PERGUNTAS.", subtext: "Pago bem. Favor não avisar as autoridades.", bg: "bg-gradient-to-r from-teal-900 to-teal-600", border: "border-teal-400" },
    { id: 18, text: "🎰 ROLETA VICIADA À VENDA. LUCRO GARANTIDO.", subtext: "Ideal para festas de família e depenar os amigos.", bg: "bg-gradient-to-r from-fuchsia-900 to-fuchsia-600", border: "border-fuchsia-400" },
    { id: 19, text: "💉 VACINA CONTRA AZAR. EFICÁCIA NÃO COMPROVADA.", subtext: "Mas a fé é o que vale, né? Apenas R$ 50 a dose.", bg: "bg-gradient-to-r from-sky-900 to-sky-600", border: "border-sky-400" },
    { id: 20, text: "💩 VENDE-SE ESTRUME DE UNICÓRNIO (É SÓ CAVALO PINTADO).", subtext: "Ótimo adubo. Cheiro de arco-íris (mentira, cheira mal mesmo).", bg: "bg-gradient-to-r from-amber-800 to-yellow-700", border: "border-amber-500" },

    // --- PACOTE DE EXPANSÃO: +80 NOVAS PÉROLAS ---
    { id: 21, text: "⚰️ FUNERÁRIA ALEGRE: PAGUE 1 E LEVE 2 CAIXÕES!", subtext: "Promoção de família. Traga um amigo (morto ou vivo).", bg: "bg-gradient-to-r from-gray-800 to-black", border: "border-gray-500" },
    { id: 22, text: "👢 BOTAS APERTADAS? NÓS CORTAMOS SEUS DEDOS!", subtext: "Soluções práticas para problemas modernos. Barbeiro Joe.", bg: "bg-gradient-to-r from-orange-800 to-red-800", border: "border-orange-500" },
    { id: 23, text: "🥃 WHISKY CASEIRO: CEGA EM 3 DIAS OU SEU DINHEIRO DE VOLTA.", subtext: "Sabor querosene com um toque de limão.", bg: "bg-gradient-to-r from-yellow-800 to-amber-700", border: "border-yellow-600" },
    { id: 24, text: "🌵 VENDE-SE CACTO DE ESTIMAÇÃO. NÃO PRECISA DE ÁGUA.", subtext: "Ideal para quem esquece de cuidar de tudo (inclusive da vida).", bg: "bg-gradient-to-r from-green-800 to-lime-700", border: "border-lime-500" },
    { id: 25, text: "📜 COMPRO SEU VOTO PARA XERIFE. PAGO EM PAÇOCA.", subtext: "Vote em 'Big Joe' para um futuro (menos) pior.", bg: "bg-gradient-to-r from-blue-900 to-cyan-800", border: "border-blue-500" },
    { id: 26, text: "🧨 DINAMITE 'PAVIO CURTO': PARA QUEM TEM PRESSA DE ACABAR.", subtext: "Metade do preço, dobro do perigo. Use com cuidado.", bg: "bg-gradient-to-r from-red-700 to-orange-600", border: "border-red-500" },
    { id: 27, text: "💇 BARBA, CABELO E AMPUTAÇÃO: SERVIÇO COMPLETO.", subtext: "Tudo na mesma cadeira. A toalha quente é opcional.", bg: "bg-gradient-to-r from-slate-700 to-slate-500", border: "border-white" },
    { id: 28, text: "🎻 CONTRATE A BANDA 'OS SURDOS' PARA SEU VELÓRIO.", subtext: "Eles não tocam bem, mas tocam alto. Ninguém vai dormir.", bg: "bg-gradient-to-r from-purple-800 to-pink-700", border: "border-purple-400" },
    { id: 29, text: "🐓 RINHA DE GALO ROBÔ: O FUTURO DO ENTRETENIMENTO.", subtext: "Apostas abertas nos fundos do celeiro. Traga óleo.", bg: "bg-gradient-to-r from-zinc-800 to-zinc-600", border: "border-zinc-400" },
    { id: 30, text: "💰 DOBRAMOS SEU OURO... SE VOCÊ FECHAR OS OLHOS.", subtext: "Mágica antiga. Não abra os olhos até contarmos até 1000.", bg: "bg-gradient-to-r from-yellow-700 to-yellow-500", border: "border-yellow-300" },
    { id: 31, text: "🏚️ VENDE-SE MINA DE OURO ESGOTADA. ÓTIMA VISTA.", subtext: "Perfeita para esconder corpos ou criar cogumelos.", bg: "bg-gradient-to-r from-stone-700 to-stone-500", border: "border-stone-400" },
    { id: 32, text: "🚂 PASSAGEM SÓ DE IDA PARA O ALASKA. SEM PERGUNTAS.", subtext: "Fugindo da lei? Ou da ex-mulher? Nós te ajudamos.", bg: "bg-gradient-to-r from-sky-800 to-blue-600", border: "border-sky-400" },
    { id: 33, text: "🐍 LEITURA DE MÃO COM COBRA CASCAVEL.", subtext: "Se ela não te picar, você terá sorte no amor.", bg: "bg-gradient-to-r from-green-900 to-emerald-800", border: "border-emerald-500" },
    { id: 34, text: "⚖️ ADVOGADO PORTA DE CADEIA: SOLTO VOCÊ EM 10 MINUTOS.", subtext: "*Ou fujo com você. O que for mais fácil.", bg: "bg-gradient-to-r from-indigo-800 to-blue-700", border: "border-indigo-400" },
    { id: 35, text: "🥔 VENDE-SE BATATA COM FORMATO DO XERIFE.", subtext: "Item de colecionador. Rara. Começando o leilão em R$ 50.", bg: "bg-gradient-to-r from-amber-700 to-orange-600", border: "border-amber-500" },
    { id: 36, text: "🤫 CLUBE DO SILÊNCIO: PRIMEIRA REGRA É NÃO FALAR.", subtext: "Segunda regra: Pagar a mensalidade em dia. Psiu!", bg: "bg-gradient-to-r from-black to-gray-800", border: "border-gray-600" },
    { id: 37, text: "🔭 TELESCÓPIO QUE VÊ O FUTURO (SÓ COISAS RUINS).", subtext: "Descubra quando você vai falir. Útil para planejar fugas.", bg: "bg-gradient-to-r from-violet-800 to-fuchsia-700", border: "border-violet-400" },
    { id: 38, text: "🥪 SANDUÍCHE DE TATU: O SABOR QUE CAVA NO SEU ESTÔMAGO.", subtext: "Crocante por fora, duvidoso por dentro. Promoção!", bg: "bg-gradient-to-r from-orange-800 to-red-700", border: "border-orange-400" },
    { id: 39, text: "🎯 ALVO HUMANO PARA TREINO DE TIRO. PAGO BEM.", subtext: "Necessário correr rápido e não ter família.", bg: "bg-gradient-to-r from-red-800 to-rose-700", border: "border-rose-500" },
    { id: 40, text: "🦷 DENTISTA AMADOR: USO ALICATE DE CERCA.", subtext: "Sem dor, sem anestesia, sem garantia. Preço camarada.", bg: "bg-gradient-to-r from-teal-800 to-cyan-700", border: "border-teal-400" },
    { id: 41, text: "🎩 CARTOLA MÁGICA: TIRA COELHO E SOME COM CARTEIRA.", subtext: "Mágico 'Dedos Leves' disponível para festas infantis.", bg: "bg-gradient-to-r from-purple-900 to-indigo-800", border: "border-purple-500" },
    { id: 42, text: "🐻 VENDE-SE URSO DE GUARDA. MEIO DÓCIL.", subtext: "Come carteiros e vizinhos chatos. Às vezes o dono.", bg: "bg-gradient-to-r from-amber-900 to-yellow-800", border: "border-amber-600" },
    { id: 43, text: "📜 DIPLOMA DE MÉDICO FALSO. PAPEL DE QUALIDADE.", subtext: "Pareça inteligente na parede do consultório. Ninguém lê.", bg: "bg-gradient-to-r from-blue-800 to-sky-700", border: "border-blue-400" },
    { id: 44, text: "🩸 SANGUESSUGAS MEDICINAIS: AGORA COM SABOR MORANGO.", subtext: "Para curar gripe, unha encravada e tristeza profunda.", bg: "bg-gradient-to-r from-red-900 to-pink-800", border: "border-red-500" },
    { id: 45, text: "🚂 PROCURO PARCEIRO PARA ASSALTO. TENHO O PLANO.", subtext: "Você entra com o risco, eu entro com a ideia. 50/50.", bg: "bg-gradient-to-r from-gray-900 to-slate-700", border: "border-gray-400" },
    { id: 46, text: "🔥 LENHA QUE NÃO QUEIMA. ÓTIMA PARA DECORAÇÃO.", subtext: "Ideal para lareiras falsas e pessoas frias.", bg: "bg-gradient-to-r from-orange-700 to-amber-600", border: "border-orange-400" },
    { id: 47, text: "🦜 PAPAGAIO QUE XINGA EM 3 IDIOMAS.", subtext: "Espanhol, Inglês e Bêbado. Diversão garantida no bar.", bg: "bg-gradient-to-r from-green-700 to-lime-600", border: "border-green-400" },
    { id: 48, text: "🤠 ALUGUEL DE CHAPÉU COM TIRO PARA DAR ESTILO.", subtext: "Finja que sobreviveu a um duelo. Impressione as damas.", bg: "bg-gradient-to-r from-amber-800 to-yellow-700", border: "border-yellow-500" },
    { id: 49, text: "🚿 SABONETE QUE TIRA PECADO. (NÃO TIRA SUJEIRA).", subtext: "Apenas R$ 10. Garanta seu lugar no céu (talvez).", bg: "bg-gradient-to-r from-cyan-700 to-blue-600", border: "border-cyan-300" },
    { id: 50, text: "🐴 FERRADURA DA SORTE (USADA EM CAVALO AZARADO).", subtext: "O cavalo morreu, mas a ferradura tá nova. Aproveite.", bg: "bg-gradient-to-r from-slate-600 to-gray-500", border: "border-gray-300" },
    { id: 51, text: "🕵️ ESPIÃO PARTICULAR: SIGO SUA ESPOSA POR UM UÍSQUE.", subtext: "Se eu não achar nada, eu invento. Satisfação garantida.", bg: "bg-gradient-to-r from-neutral-800 to-stone-700", border: "border-stone-500" },
    { id: 52, text: "🎪 CIRCO DOS HORRORES: MULHER BARBADA (É O TIO ZÉ).", subtext: "Ingressos esgotando. Venha ver o Tio Zé de peruca.", bg: "bg-gradient-to-r from-rose-900 to-red-700", border: "border-rose-400" },
    { id: 53, text: "📖 BÍBLIA COM ESCONDERIJO PARA ARMA.", subtext: "Vá à missa protegido. O Senhor perdoa, a Colt não.", bg: "bg-gradient-to-r from-yellow-900 to-amber-800", border: "border-yellow-600" },
    { id: 54, text: "🥘 SOPA DE PEDRA. AGORA COM GOSTO DE PEDRA.", subtext: "Receita da vovó (que não tinha dentes). Rica em minerais.", bg: "bg-gradient-to-r from-stone-600 to-gray-500", border: "border-stone-400" },
    { id: 55, text: "🚪 PORTA DE SALOON QUE NÃO FAZ 'NHEEEE'.", subtext: "Tiramos o barulho clássico. Surpreenda seus inimigos.", bg: "bg-gradient-to-r from-orange-900 to-red-800", border: "border-orange-500" },
    { id: 56, text: "🧨 CURSO DE DESARME DE BOMBAS. AULA PRÁTICA ÚNICA.", subtext: "Se você errar, o curso acaba mais cedo. Sem certificado.", bg: "bg-gradient-to-r from-red-800 to-black", border: "border-red-600" },
    { id: 57, text: "🐺 LOBO DE ESTIMAÇÃO. ATENDE POR 'TOTÓ'.", subtext: "Muito carinhoso. Já comeu 3 carteiros. Precisa de espaço.", bg: "bg-gradient-to-r from-gray-700 to-slate-600", border: "border-gray-400" },
    { id: 58, text: "🦵 PERNA DE PAU ESTILIZADA (MOGNO OU CARVALHO).", subtext: "Entalhes personalizados. Opção com compartimento secreto.", bg: "bg-gradient-to-r from-amber-900 to-orange-800", border: "border-amber-600" },
    { id: 59, text: "🤢 REMÉDIO PRA RESSACA: PÓLVORA E PIMENTA.", subtext: "Você esquece a dor de cabeça porque o estômago dói mais.", bg: "bg-gradient-to-r from-green-800 to-teal-700", border: "border-green-500" },
    { id: 60, text: "🏜️ LOTE NO DESERTO. VISTA PANORÂMICA DE AREIA.", subtext: "Sem vizinhos, sem água, sem esperança. Paz total.", bg: "bg-gradient-to-r from-yellow-600 to-orange-500", border: "border-yellow-400" },
    { id: 61, text: "🎹 PIANISTA QUE TOCA MESMO LEVANDO TIRO.", subtext: "Profissionalismo acima de tudo. Repertório triste.", bg: "bg-gradient-to-r from-zinc-800 to-gray-700", border: "border-white" },
    { id: 62, text: "🕯️ VELAS FEITAS DE CERA DE OUVIDO. 100% NATURAL.", subtext: "Queima lenta e cheiro... peculiar. Artesanato local.", bg: "bg-gradient-to-r from-yellow-200 to-amber-200 text-black", border: "border-yellow-500" },
    { id: 63, text: "⛏️ PÁ DE OURO (BANHADA). CAVE SUA COVA COM ESTILO.", subtext: "Porque morrer pobre é pros fracos. Luxo funerário.", bg: "bg-gradient-to-r from-yellow-500 to-amber-400 text-black", border: "border-yellow-700" },
    { id: 64, text: "🌵 ABRAÇOS GRÁTIS! (SOU UM CACTO).", subtext: "Carente e espinhoso. Procuro jardineiro(a) com coragem.", bg: "bg-gradient-to-r from-green-600 to-emerald-500", border: "border-green-800" },
    { id: 65, text: "🧲 IMÃ DE DINHEIRO. FUNCIONA MESMO!", subtext: "Atrai moedas de até 5 centavos. Fique rico (bem devagar).", bg: "bg-gradient-to-r from-gray-500 to-slate-400 text-black", border: "border-gray-700" },
    { id: 66, text: "🛁 ÁGUA DE BANHO DA DAMA DO SALOON. (ENGARRAFADA).", subtext: "Para beber ou passar no cabelo. Edição limitada.", bg: "bg-gradient-to-r from-pink-400 to-rose-300 text-black", border: "border-pink-600" },
    { id: 67, text: "🪦 LÁPIDE COM SEU NOME EM BRANCO. PROMOÇÃO!", subtext: "Esteja preparado. Nunca se sabe quando o agiota vem.", bg: "bg-gradient-to-r from-stone-500 to-gray-400 text-black", border: "border-stone-700" },
    { id: 68, text: "🕷️ CRIAÇÃO DE ARANHAS PARA ASSUSTAR SOGRA.", subtext: "Kit iniciante com 50 filhotes e manual de instruções.", bg: "bg-gradient-to-r from-black to-slate-900", border: "border-red-600" },
    { id: 69, text: "🔭 VENDO ÓCULOS QUE VÊEM ATRAVÉS DE ROUPA (MENTIRA).", subtext: "É só vidro verde, mas você fica estiloso. R$ 20.", bg: "bg-gradient-to-r from-green-900 to-green-700", border: "border-green-400" },
    { id: 70, text: "💨 VENDO VENTO ENGARRAFADO DO GRAND CANYON.", subtext: "Respire ar puro. Vidro vazio, mas cheio de significado.", bg: "bg-gradient-to-r from-cyan-100 to-white text-black", border: "border-cyan-400" },
    { id: 71, text: "🃏 BARALHO COM 5 ASES. GANHE SEMPRE.", subtext: "Cuidado ao usar. Não nos responsabilizamos por linchamentos.", bg: "bg-gradient-to-r from-red-900 to-red-600", border: "border-white" },
    { id: 72, text: "🤫 VENDO SEGREDOS DO PREFEITO. LISTA IMPRESSA.", subtext: "Escândalos, amantes e desvio de verba. Leitura leve.", bg: "bg-gradient-to-r from-purple-900 to-violet-800", border: "border-purple-400" },
    { id: 73, text: "🤠 PROCURO DUBLÊ DE CORPO PARA DUELO AMANHÃ.", subtext: "Pago bem se sobreviver. Se morrer, pago o enterro.", bg: "bg-gradient-to-r from-orange-900 to-red-800", border: "border-orange-500" },
    { id: 74, text: "💍 ANEL QUE FICA INVISÍVEL (QUANDO NINGUÉM VÊ).", subtext: "Item mágico raro. Só funciona no escuro absoluto.", bg: "bg-gradient-to-r from-indigo-900 to-blue-800", border: "border-indigo-400" },
    { id: 75, text: "🦷 DENTADURA DO GEORGE WASHINGTON (RÉPLICA DE MADEIRA).", subtext: "Pegue cupim na boca com estilo presidencial.", bg: "bg-gradient-to-r from-amber-800 to-yellow-900", border: "border-amber-600" },
    { id: 76, text: "🚪 PORTA-TRECO FEITO DE CRÂNIO DE INIMIGO.", subtext: "Rústico e funcional. Cabe canetas, chaves e balas.", bg: "bg-gradient-to-r from-stone-800 to-gray-700", border: "border-stone-400" },
    { id: 77, text: "🩸 SANGUE FALSO PARA FINGIR A PRÓPRIA MORTE.", subtext: "Fuja das dívidas hoje mesmo! Parece ketchup, mas cola.", bg: "bg-gradient-to-r from-red-700 to-rose-600", border: "border-red-400" },
    { id: 78, text: "🐍 COBRA DE BORRACHA PARA ASSUSTAR CAVALO.", subtext: "Diversão garantida no rodeio. Causa pânico instantâneo.", bg: "bg-gradient-to-r from-green-800 to-lime-700", border: "border-green-500" },
    { id: 79, text: "🔭 BINÓCULO QUE SÓ VÊ O PASSADO (DEFEITO).", subtext: "Tudo o que você vê já aconteceu um milissegundo atrás.", bg: "bg-gradient-to-r from-blue-900 to-cyan-800", border: "border-blue-400" },
    { id: 80, text: "🤡 CURSO DE PALHAÇO DE RODEIO. VAGAS ABERTAS.", subtext: "Aprenda a correr de touros e usar maquiagem borrada.", bg: "bg-gradient-to-r from-red-600 to-yellow-500", border: "border-white" },
    { id: 81, text: "🐎 CAVALO MECÂNICO A VAPOR. NÃO COME FENO.", subtext: "Explode às vezes, mas é rápido. Tecnologia de ponta.", bg: "bg-gradient-to-r from-stone-700 to-gray-600", border: "border-orange-400" },
    { id: 82, text: "🌵 SUCO DE CACTO ALUCINÓGENO. 'VIAGEM' AO DESERTO.", subtext: "Veja índios voadores e coiotes falantes. Apenas R$ 15.", bg: "bg-gradient-to-r from-emerald-800 to-green-600", border: "border-emerald-400" },
    { id: 83, text: "🪙 MOEDA DE DOIS LADOS 'CARA'. NUNCA PERCA.", subtext: "Ideal para decidir quem paga a conta no bar.", bg: "bg-gradient-to-r from-yellow-600 to-amber-500", border: "border-yellow-300" },
    { id: 84, text: "🗺️ GLOBO TERRESTRE PLANO. PARA TEÓRICOS.", subtext: "Edição limitada para quem não acredita na bola.", bg: "bg-gradient-to-r from-blue-500 to-sky-400 text-black", border: "border-blue-700" },
    { id: 85, text: "👢 ESPORAS QUE TOCAM MÚSICA QUANDO ANDA.", subtext: "Jingle Bells a cada passo. Irrite seus inimigos.", bg: "bg-gradient-to-r from-gray-400 to-slate-300 text-black", border: "border-gray-600" },
    { id: 86, text: "🏹 FLECHA TELEGUIADA (PRECISA MIRAR BEM).", subtext: "Se você mirar certo, ela vai certo. Tecnologia indígena.", bg: "bg-gradient-to-r from-orange-800 to-red-700", border: "border-orange-500" },
    { id: 87, text: "🧔 BARBA POSTIÇA FEITA DE CRINA DE CAVALO.", subtext: "Coça um pouco e cheira a estábulo, mas impõe respeito.", bg: "bg-gradient-to-r from-black to-stone-900", border: "border-stone-600" },
    { id: 88, text: "🧨 KIT DE ASSALTO A BANCO PARA CRIANÇAS.", subtext: "Incentive o empreendedorismo desde cedo. (Armas de pau).", bg: "bg-gradient-to-r from-red-500 to-orange-400 text-black", border: "border-red-800" },
    { id: 89, text: "💊 PÍLULA DA CORAGEM (É SÓ AÇÚCAR E CACHAÇA).", subtext: "Tome duas e enfrente um urso na mão. (Não garantimos vida).", bg: "bg-gradient-to-r from-white to-gray-200 text-black", border: "border-blue-400" },
    { id: 90, text: "🦅 ÁGUIA CARECA QUE USA PERUCA.", subtext: "Animal exótico e vaidoso. Aceita alpiste premium.", bg: "bg-gradient-to-r from-slate-700 to-gray-600", border: "border-slate-400" },
    { id: 91, text: "🎸 VIOLÃO QUE TOCA SOZINHO (TEM UM RATO DENTRO).", subtext: "O rato corre nas cordas. Música experimental.", bg: "bg-gradient-to-r from-amber-900 to-yellow-800", border: "border-amber-500" },
    { id: 92, text: "🧦 MEIAS USADAS PELO BILLY THE KID. (SEM LAVAR).", subtext: "Item histórico com aroma de crime e chulé.", bg: "bg-gradient-to-r from-yellow-100 to-white text-black", border: "border-yellow-600" },
    { id: 93, text: "🏜️ AREIA DO DESERTO IMPORTADA DO EGITO.", subtext: "É igual a daqui, mas tem pedigree. R$ 100 o quilo.", bg: "bg-gradient-to-r from-orange-300 to-yellow-200 text-black", border: "border-orange-500" },
    { id: 94, text: "🩸 VENDO RIM (SEMI-NOVO). MOTIVO: DÍVIDA.", subtext: "Funciona bem, só bebeu um pouco de uísque barato.", bg: "bg-gradient-to-r from-red-900 to-red-800", border: "border-red-500" },
    { id: 95, text: "👻 CAÇA-FANTASMAS DO OESTE. TIRAMOS ENCOSTO.", subtext: "Usamos aspirador de pó e reza brava. Orçamento na hora.", bg: "bg-gradient-to-r from-purple-800 to-violet-700", border: "border-purple-400" },
    { id: 96, text: "🌵 ABRAÇO DE GRAÇA (OFERTA DO CACTO SOLITÁRIO).", subtext: "Ele só quer carinho. E um pouco do seu sangue.", bg: "bg-gradient-to-r from-green-700 to-emerald-600", border: "border-green-400" },
    { id: 97, text: "🔭 TELESCÓPIO PARA VER VIZINHA TROCANDO DE ROUPA.", subtext: "Vendido como 'equipamento de observação de pássaros'.", bg: "bg-gradient-to-r from-blue-900 to-indigo-800", border: "border-blue-500" },
    { id: 98, text: "🦷 EXTRAÇÃO DE DENTE COM TIRO DE REVÓLVER.", subtext: "Rápido, eficaz e deixa um gosto de pólvora. Dr. Bang.", bg: "bg-gradient-to-r from-gray-800 to-stone-700", border: "border-stone-400" },
    { id: 99, text: "🐴 ALOPÉCIA EQUINA? TEMOS PERUCAS PARA CAVALOS.", subtext: "Devolva a auto-estima do seu alazão. Várias cores.", bg: "bg-gradient-to-r from-yellow-700 to-orange-600", border: "border-orange-400" },
    { id: 100, text: "🚀 FOGUETE DE BARRIL DE PÓLVORA. IDA À LUA.", subtext: "Ainda não testamos o retorno. Seja o primeiro astronauta.", bg: "bg-gradient-to-r from-red-600 to-orange-500", border: "border-red-400" }
];

// ... (Resto do componente FooterAds igualzinho ao anterior) ...
// Vou manter o restante do código do componente para você poder copiar e colar tudo

const FooterAds = () => {
    // Começa com um aleatório
    const [currentIndex, setCurrentIndex] = useState(() => Math.floor(Math.random() * FAKE_ADS.length));
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            // Sorteia novo índice a cada 4s
            setCurrentIndex(Math.floor(Math.random() * FAKE_ADS.length));
        }, 8000);
        return () => clearInterval(interval);
    }, []);

    if (!isVisible) return null;

    const ad = FAKE_ADS[currentIndex] || FAKE_ADS[0];

    return (
        <div className="fixed bottom-0 left-0 w-full z-40 px-4 pb-0 pt-0 pointer-events-none flex justify-center">
            <div className="w-full max-w-[1200px] pointer-events-auto">
                <AnimatePresence mode='wait'>
                    <motion.div
                        key={ad.id} 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                        className={`relative w-full ${ad.bg} border-t-4 border-x-4 ${ad.border} rounded-t-xl p-3 sm:p-4 shadow-[0_0_30px_rgba(0,0,0,0.9)] flex flex-col items-center justify-center text-center overflow-hidden cursor-pointer hover:brightness-110 transition-all`}
                        onClick={() => alert("🚨 ALERTA DE VÍRUS 🚨\n\nBrincadeira... mas não clique em links estranhos na vida real!")}
                    >
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsVisible(false);
                            }}
                            className="absolute top-2 right-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/50 rounded-full p-1 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>

                        <div className="flex flex-col items-center gap-1">
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold bg-black/40 text-white px-2 py-0.5 rounded uppercase tracking-widest border border-white/10">
                                    Patrocinado
                                </span>
                                <ExternalLink className="w-3 h-3 text-white/70" />
                            </div>
                            
                            <h3 className="text-white font-black text-lg sm:text-2xl uppercase tracking-wide drop-shadow-md font-serif leading-tight">
                                {ad.text}
                            </h3>
                            <p className="text-white/90 text-xs sm:text-sm font-bold italic">
                                {ad.subtext}
                            </p>
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent w-full h-full -skew-x-12 translate-x-[-100%] animate-[shimmer_2.5s_infinite]"></div>
                    </motion.div>
                </AnimatePresence>
            </div>
            
            <style>{`
                @keyframes shimmer {
                    0% { transform: translateX(-150%) skewX(-12deg); }
                    100% { transform: translateX(150%) skewX(-12deg); }
                }
            `}</style>
        </div>
    );
};

export default FooterAds;