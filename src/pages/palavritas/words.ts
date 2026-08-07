
export const randomWords = [
    "TERMO", "LUGAR", "MUNDO", "TEMPO", "COISA", "JUSTO", "FORTE", "SUTIL", "FELIZ", "NOBRE",
    "IDEIA", "LIVRO", "VIVER", "AMIGO", "CINCO", "SABER", "PLENO", "LEGAL", "CLARO", "MUITO",
    "POUCO", "LONGE", "PERTO", "NOITE", "TARDE", "FALAR", "OUVIR", "OLHAR", "CRIAR", "FAZER",
    "PODER", "DIZER", "VERDE", "PRATO", "LETRA", "CARRO", "PORTA", "FLORA", "SAIDA", "CENSO",
    "VALOR", "TEXTO", "FESTA", "SONHO", "MANHA", "NUNCA", "SEMPRE", "AGORA", "DEPOIS", "ANTES",
    "FUNDO", "PONTO", "TERRA", "AGUAS", "VENTO", "FOGO", "CHAVE", "PISTA", "JOGAR", "GANHO"
  ];
  
  // To keep it simple, daily mode can use a seed based on the current date to pick from a list
  export const dailyWords = [
    "SAGAZ", "AMAGO", "NEGRO", "MEXER", "TERMO", "NOBRE", "SENSO", "AFETO", "ALGOZ", "ETICA",
    "MUTUO", "SUTIL", "VIGOR", "AQUEM", "FAZER", "ASSIM", "AUDACES", "IDEIA", "CERNE", "MORAL"
  ];
  
  export const contextWords = [
    // Programação
    { category: "Programação", word: "REACT", tip: "Livraria que mudou a forma de construir o lado do cliente com um DOM virtual, popularizada por Zuckerberg." },
    { category: "Programação", word: "STATE", tip: "O grande causador de renders indesejados quando não gerenciado corretamente. A 'memória' do componente." },
    { category: "Programação", word: "HOOKS", tip: "Chegaram na versão 16.8 para dar superpoderes aos componentes funcionais." },
    { category: "Programação", word: "PROPS", tip: "As informações que fluem de cima para baixo na árvore, sempre imutáveis pelo filho." },
    { category: "Programação", word: "BUILD", tip: "O momento em que seu código perfeitamente legível se transforma em um emaranhado minificado." },
    { category: "Programação", word: "DEBUG", tip: "A arte de ser o detetive em um crime onde você mesmo é o assassino." },
    { category: "Programação", word: "FRONT", tip: "A fachada do sistema, onde o usuário clica e espera que a mágica aconteça." },
    { category: "Programação", word: "LINUX", tip: "Onde o sudo é a palavra mágica e o terminal é o seu melhor amigo." },
    { category: "Programação", word: "CLOUD", tip: "Onde a infraestrutura não é mais um problema físico, mas sim a máquina de outra pessoa." },
    { category: "Programação", word: "CACHE", tip: "O truque mágico que faz tudo carregar mais rápido, até você esquecer de limpá-lo." },
    { category: "Programação", word: "FETCH", tip: "O método moderno que substituiu o velho XMLHttpRequest para buscar dados na rede." },
    { category: "Programação", word: "PATCH", tip: "Pequena correção ou remendo em código para resolver um bug inesperado." },
    { category: "Programação", word: "QUERY", tip: "A pergunta estruturada que você faz ao banco de dados para extrair informações." },
    { category: "Programação", word: "CLICK", tip: "O evento mais aguardado e disparado de qualquer botão em uma interface de usuário." },
    { category: "Programação", word: "SCOPE", tip: "A área de visibilidade onde suas variáveis vivem e, às vezes, morrem prematuramente." },
    { category: "Programação", word: "STACK", tip: "A pilha de tecnologias que compõem sua aplicação, ou onde os erros estouram." },
    
    // Counter-Strike / Jogos
    { category: "Counter-Strike", word: "SKINS", tip: "Cosméticos caríssimos que não mudam o dano, mas dão muito estilo na partida." },
    { category: "Counter-Strike", word: "LOBBY", tip: "Onde a equipe se reúne para decidir quem vai ser carregado no próximo jogo." },
    { category: "Counter-Strike", word: "SPRAY", tip: "Segurar o dedo no gatilho exigirá que você memorize o padrão de recuo da arma." },
    { category: "Counter-Strike", word: "FLASH", tip: "Útil para cegar os oponentes, mas geralmente acaba cegando o próprio time." },
    { category: "Counter-Strike", word: "SMOKE", tip: "Utilitário cinzento essencial para bloquear a visão e dominar espaços no mapa." },
    { category: "Counter-Strike", word: "BOMBA", tip: "Carregar isso significa que você é o alvo principal; plantá-la garante a pressão no adversário." },
    { category: "Counter-Strike", word: "SPAWN", tip: "O berço de cada round. Onde você aperta a tecla de compra para seus equipamentos." },
    { category: "Counter-Strike", word: "NINJA", tip: "Desarmar a C4 sem que os inimigos percebam. Uma jogada arriscada e humilhante para o adversário." },
    { category: "Counter-Strike", word: "ROUND", tip: "A rodada que pode durar poucos minutos mas parece uma eternidade quando você está sozinho." },
    { category: "Counter-Strike", word: "PLANT", tip: "O ato de armar a C4, que exige que você fique vulnerável por alguns segundos críticos." },
    { category: "Counter-Strike", word: "SCOPE", tip: "A mira telescópica da AWP que faz os jogadores prenderem a respiração." },
    { category: "Counter-Strike", word: "MATCH", tip: "A partida completa que vai testar sua paciência e habilidade tática do início ao fim." },
    { category: "Counter-Strike", word: "TRADE", tip: "Quando um jogador morre, mas o parceiro rapidamente elimina o agressor para compensar a perda." },

    // Lugares
    { category: "Lugares", word: "PRAIA", tip: "Um paraíso costeiro onde as ondas quebram e a brisa salgada domina o ar." },
    { category: "Lugares", word: "PRACA", tip: "Ponto de encontro urbano, perfeito para alimentar pombos ou jogar xadrez." },
    { category: "Lugares", word: "HOTEL", tip: "Seu lar temporário, com serviço de quarto e toalhas magicamente dobradas." },
    { category: "Lugares", word: "CAMPO", tip: "Onde o silêncio reina, quebrado apenas pelo som de animais e tratores trabalhando." },
    { category: "Lugares", word: "PARIS", tip: "Capital europeia do romance, banhada pelo rio Sena e berço de famosos croissants." },
    { category: "Lugares", word: "CHINA", tip: "O gigante asiático, dono de uma barreira quilométrica visível até do espaço." },
    { category: "Lugares", word: "MUNDO", tip: "O pálido ponto azul, lar de bilhões de histórias simultâneas e de fronteiras invisíveis." },
    { category: "Lugares", word: "CLUBE", tip: "Oásis de lazer com piscinas e quadras, geralmente exclusivo para associados." },
    { category: "Lugares", word: "ILHAS", tip: "Porções de terra completamente cercadas por água, sinônimo de isolamento tropical." },
    { category: "Lugares", word: "NORTE", tip: "A direção perene apontada pela agulha vermelha de uma bússola." },
    { category: "Lugares", word: "PORTO", tip: "Onde grandes navios atracam para descarregar contêineres e mercadorias valiosas." },
    { category: "Lugares", word: "PONTE", tip: "A grande estrutura que desafia a gravidade para unir dois lados separados por um rio." },
    
    // Infância
    { category: "Infância", word: "CORDA", tip: "Um fio esticado que ditava o ritmo de cantigas e saltos sincronizados no recreio." },
    { category: "Infância", word: "DOCES", tip: "A recompensa açucarada após o almoço, responsável pela energia infinita da tarde." },
    { category: "Infância", word: "PIPAS", tip: "Obras de arte feitas de seda e bambu, disputando o céu em dias de vento forte." },
    { category: "Infância", word: "FESTA", tip: "O ápice do ano, com balões estourando, chapéus de cone e brigadeiros escondidos." },
    { category: "Infância", word: "AMIGO", tip: "Aquele parceiro inseparável de aventuras imaginárias e de trocas de figurinhas." },
    { category: "Infância", word: "MAGIA", tip: "A ilusão de que o impossível acontecia diante de seus olhos com apenas um 'abracadabra'." },
    { category: "Infância", word: "PIQUE", tip: "Contar até dez de olhos fechados enquanto todos encontram o melhor esconderijo." },
    { category: "Infância", word: "GIZES", tip: "Bastões coloridos que transformavam qualquer lousa ou asfalto em uma grande tela de arte." },
    { category: "Infância", word: "LIVRO", tip: "Um portal de papel cheio de fábulas, contos de fadas e mundos imaginários deslumbrantes." },
    { category: "Infância", word: "JOGOS", tip: "As aventuras em cartuchos que exigiam ser soprados antes de rodar no videogame." },
    { category: "Infância", word: "TINTA", tip: "Líquido colorido que costumava sujar os dedos e os uniformes escolares nas aulas de artes." },
    { category: "Infância", word: "BOLAS", tip: "Esferas de plástico ou couro, que eram o alvo principal dos chutes na rua e quebravam janelas." },
    { category: "Infância", word: "BALAO", tip: "Uma bolha de borracha que voa ao ser enchida com gás hélio nas festinhas de aniversário." },

    // Cinema
    { category: "Cinema", word: "VILAO", tip: "O antagonista clássico que dá sentido à jornada e crescimento do protagonista." },
    { category: "Cinema", word: "HEROI", tip: "A figura que salva o dia, muitas vezes vestindo uma capa ou armadura." },
    { category: "Cinema", word: "INDIE", tip: "Produções independentes feitas fora dos grandes estúdios, repletas de criatividade." },
    { category: "Cinema", word: "DRAMA", tip: "Gênero cinematográfico focado em arrancar lágrimas e emoções profundas do espectador." },
    { category: "Cinema", word: "AUDIO", tip: "Metade da experiência cinematográfica que a maioria só nota quando apresenta problemas." },
    { category: "Cinema", word: "LUZES", tip: "O elemento crucial no set de filmagem (junto com Câmera e Ação) para criar a atmosfera perfeita." },
    { category: "Cinema", word: "FILME", tip: "A obra audiovisual completa que nos prende diante da tela por algumas horas." },
    { category: "Cinema", word: "TELAS", tip: "As enormes superfícies brancas onde as histórias ganham vida no escurinho da sala." },
    { category: "Cinema", word: "CENAS", tip: "Os pequenos fragmentos de gravação que, juntos, montam toda a estrutura da narrativa." },
    { category: "Cinema", word: "OSCAR", tip: "A estatueta dourada careca e cobiçada por todos os profissionais de Hollywood." },
    { category: "Cinema", word: "CURTA", tip: "Uma produção de duração reduzida, mas frequentemente com mensagens muito potentes e diretas." },
    { category: "Cinema", word: "FITAS", tip: "O antigo formato magnético que precisava ser rebobinado antes de devolver na locadora." },

    // Comida
    { category: "Comida", word: "PIZZA", tip: "Disco de massa assada, amado mundialmente, que causa brigas existenciais sobre ter ou não abacaxi." },
    { category: "Comida", word: "SUSHI", tip: "Iguaria milenar onde o preparo exato do arroz é tão importante quanto o peixe." },
    { category: "Comida", word: "CARNE", tip: "A estrela e atração principal de um bom churrasco de domingo." },
    { category: "Comida", word: "FRUTA", tip: "Sobremesa natural, saudável e suculenta que os nutricionistas insistem que você coma mais." },
    { category: "Comida", word: "BOLOS", tip: "Massa fofinha e decorada, presença obrigatória antes de cantar os parabéns." },
    { category: "Comida", word: "MASSA", tip: "A base da culinária italiana, podendo variar de longos fios a tubos recheados." },
    { category: "Comida", word: "TORTA", tip: "Prato assado de massa que abraça o recheio, podendo ser de maçã ou de frango." },
    { category: "Comida", word: "MILHO", tip: "Cereal dourado e doce, perfeito para ser cozido ou estourado no calor da panela." },
    { category: "Comida", word: "PUDIM", tip: "Sobremesa lisa e brilhante, famosa por sua deliciosa calda escura de caramelo derretido." },
    { category: "Comida", word: "CREME", tip: "O acompanhamento suave e gelado, essencial em uma boa salada de frutas ou bolo de aniversário." },
    { category: "Comida", word: "SUCOS", tip: "Líquidos extraídos de frutas fresquinhas, essenciais para refrescar no calor do meio-dia." },
    { category: "Comida", word: "FORNO", tip: "O eletrodoméstico quente e mágico de onde saem os pães e as travessas borbulhantes." },
    { category: "Comida", word: "CALDO", tip: "O líquido quente, denso e reconfortante, frequentemente consumido em dias de inverno." },

    // Corpo Humano
    { category: "Corpo Humano", word: "DENTE", tip: "Ferramentas rígidas de mastigação que você precisa esfregar com uma escova todos os dias." },
    { category: "Corpo Humano", word: "OSSOS", tip: "A estrutura rígida de cálcio que nos mantém de pé e protege órgãos vitais." },
    { category: "Corpo Humano", word: "UNHAS", tip: "Extensões de queratina nas pontas dos dedos que muita gente rói quando está ansiosa." },
    { category: "Corpo Humano", word: "PEITO", tip: "A região do tronco que guarda a nossa principal 'bomba' muscular incansável." },
    { category: "Corpo Humano", word: "PERNA", tip: "Membros inferiores, fundamentais para caminhar, correr e sustentar nosso próprio peso." },
    { category: "Corpo Humano", word: "ROSTO", tip: "O outdoor da nossa identidade, onde nossas emoções e expressões mais nítidas se revelam." },
    { category: "Corpo Humano", word: "VEIAS", tip: "Os rios azuis superficiais que transportam o sangue de volta para o coração." },
    { category: "Corpo Humano", word: "NERVO", tip: "Fios sensíveis e invisíveis que conduzem sinais elétricos rápidos do cérebro para os músculos." },
    { category: "Corpo Humano", word: "PULSO", tip: "O local sensível no braço onde o médico aperta levemente para sentir os batimentos do coração." },
    { category: "Corpo Humano", word: "CALOR", tip: "A energia térmica que nosso organismo emite naturalmente quando os músculos estão trabalhando duro." },
    { category: "Corpo Humano", word: "VISTA", tip: "O sentido poderoso captado por nossos olhos, permitindo interpretar as cores e formas do mundo." },
    { category: "Corpo Humano", word: "DORSO", tip: "A parte de trás do tronco, que frequentemente dói e trava após muitas horas na frente do computador." },
    { category: "Corpo Humano", word: "BRACO", tip: "Membro superior articulado, essencial para conseguir abraçar, alcançar e segurar objetos pesados." },
    { category: "Corpo Humano", word: "OLHOS", tip: "Nossas câmeras biológicas naturais e expressivas, responsáveis por enxergar tudo ao nosso redor." }
  ];
  
  export function getRandomWord(): string {
    return randomWords[Math.floor(Math.random() * randomWords.length)];
  }
  
  export function getDailyWord(): string {
    // Generate a deterministic index based on current date
    const today = new Date();
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
    const index = seed % dailyWords.length;
    return dailyWords[index];
  }
  
  export const availableCategories = Array.from(new Set(contextWords.map(w => w.category)));

  export function getRandomContextWord(category?: string): { category: string, word: string, tip: string } {
    let list = contextWords;
    if (category && category !== 'Todas') {
      list = contextWords.filter(w => w.category === category);
    }
    return list[Math.floor(Math.random() * list.length)];
  }
