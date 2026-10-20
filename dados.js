/* ===== DADOS DO SITE (edite aqui; o visual fica em index.html / estilo.css) ===== */
const SPOTIFY_ARTISTA = "https://open.spotify.com/artist/5nP8x4uEFjAAmDzwOEc9b8"; // link oficial verificado
// Link de busca do Spotify (usado quando não há link exato verificado)
const busca = q => "https://open.spotify.com/search/" + encodeURIComponent(q);

const FONTES = {
  wikiBio:{n:"Wikipédia – Matuê", u:"https://en.wikipedia.org/wiki/Matu%C3%AA"},
  wikiMdT:{n:"Wikipédia – Máquina do Tempo", u:"https://en.wikipedia.org/wiki/M%C3%A1quina_do_Tempo"},
  wiki333:{n:"Wikipédia – 333", u:"https://en.wikipedia.org/wiki/333_(Matu%C3%AA_album)"},
  qobuz:{n:"Qobuz – biografia (Music Story)", u:"https://www.qobuz.com/us-en/interpreter/matue/4108199"},
  lastfm:{n:"Last.fm – biografia", u:"https://last.fm/pt/music/Matu%C3%AA/+wiki"},
  opovo:{n:"O POVO – perfil do artista (2024)", u:"https://mais.opovo.com.br/reportagens-especiais/serie-perfis/2024/02/18/matue-e-o-reecontro-com-fortaleza-apos-uma-volta-ao-mundo.html"},
  agazeta:{n:"A Gazeta – Máquina do Tempo (2020)", u:"https://www.agazeta.com.br/colunas/rafael-braz/matue-o-trapper-brasileiro-que-quebrou-recordes-no-spotify-1020"},
  rs333:{n:"Rolling Stone Brasil – recorde do 333", u:"https://rollingstone.com.br/musica/333-novo-album-de-matue-bate-recorde-de-maior-estreia-do-streaming-no-brasil/"},
  bbFake:{n:"Billboard Brasil – “álbum falso” antes do 333", u:"https://billboard.com.br/matue-lanca-album-fake-em-meio-a-litigio-com-gravadora-e-expectativa-por-333/"},
  bbX:{n:"Billboard Brasil – lançamento de XTRANHO", u:"https://billboard.com.br/matue-xtranho-reinventar-trap-mainstream/"},
  rsX:{n:"Rolling Stone Brasil – crítica de XTRANHO", u:"https://rollingstone.com.br/?p=274315"},
  lisboa:{n:"Portal Tela – Rock in Rio Lisboa (2026)", u:"https://www.portaltela.com/entretenimento/musica/2026/06/28/matue-estreia-no-rock-in-rio-lisboa-celebrando-raizes-nordestinas/"},
  bbTag:{n:"Billboard Brasil – matérias sobre Matuê", u:"https://billboard.com.br/tag/matue/"}
};

const BIO = [
 {t:"Infância e origens", p:["Matheus Brasileiro Aguiar nasceu em Fortaleza, no Ceará, em 11 de outubro de 1993. Aos 8 anos foi morar nos Estados Unidos, na região de Oakland, na Califórnia, e voltou ao Brasil em 2004."], f:["wikiBio","lastfm","opovo"]},
  {t:"Juventude e primeiros interesses musicais", p:["Foi nos Estados Unidos que Matuê teve contato com a cultura hip-hop. De volta a Fortaleza, decidiu tentar a música. Antes de se firmar no trap, passou um tempo fazendo reggae."], f:["qobuz"]},
  {t:"O início da carreira", p:["Em 2015 lançou a mixtape “Reggae”. Em 2016, o single “RBN”, com clipe marcante, chamou atenção para o trap. Em 2017 vieram vários singles, como “Boomzin” e “HORTA”, além de “Anos Luz”, e ele foi apontado como grande promessa do rap pela Revista RND."], f:["wikiBio","qobuz","lastfm"]},
  {t:"A construção da 30PRAUM", p:["Com Clara Mendes e Lucas Degas, Matuê fundou a 30PRAUM, estúdio e selo da qual é diretor criativo. As fontes divergem no ano de criação (2014 ou 2016). A 30PRAUM também está ligada ao festival Plantão, que reuniu 60 mil pessoas na primeira edição, em Fortaleza."], f:["wikiBio","qobuz","opovo"]},
  {t:"Ascensão nacional", p:["Em 2019, “Kenny G” se firmou como um dos maiores sucessos. Em 2020, ele lançou “Máquina do Tempo”, que teve a melhor estreia de um álbum no Spotify Brasil na época. Depois vieram singles como “Quer Voar” (2021) e “Conexões de Máfia” (2023), com Rich the Kid."], f:["qobuz","wikiMdT","agazeta"]},
  {t:"Evolução artística", p:["Em 2024, após o EP “Sabor Overdose no Yakisoba” e uma disputa pública com a gravadora, Matuê lançou “333” de forma independente, com sons que misturam trap, psicodelia, R&B e pop. Em dezembro de 2025, “XTRANHO” marcou a volta a uma sonoridade mais trap, com participações da cena underground."], f:["wiki333","bbFake","bbX"]},
  {t:"Vida pessoal", p:["Respeitando a privacidade do artista, este site não traz detalhes pessoais além do que ajuda a entender a carreira: a origem em Fortaleza e o período nos Estados Unidos."], f:["wikiBio"]},
  {t:"Legado e impacto cultural", p:["“333” registrou mais de 16 milhões de reproduções em 24 horas no Spotify, a maior estreia de um álbum brasileiro na plataforma. Em junho de 2026, Matuê foi o primeiro rapper brasileiro a se apresentar no Palco Mundo do Rock in Rio Lisboa."], f:["rs333","lisboa","bbTag"]}
];

const LINHA = [
 {a:"2014 / 2016", t:"Nasce a 30PRAUM", x:"Matuê funda com Clara Mendes e Lucas Degas o estúdio e selo que sustentaria sua carreira. As fontes divergem entre 2014 e 2016.", f:["wikiBio","qobuz"]},
  {a:"2015", t:"Mixtape “Reggae”", x:"Primeiro lançamento, produzido pela 30PRAUM, antes da virada para o trap.", f:["wikiBio"]},
  {a:"2016", t:"“RBN”", x:"O single, acompanhado de um clipe de forte estética, é o primeiro grande impulso do artista no trap nacional.", f:["qobuz","lastfm"]},
  {a:"2017", t:"Singles e “Anos Luz”", x:"Ano de vários lançamentos, entre eles “Boomzin” e “HORTA”, além de “Anos Luz”. A Revista RND o aponta como maior promessa do rap.", f:["qobuz","wikiBio","lastfm"]},
  {a:"2019", t:"“Kenny G”", x:"Single que está entre seus maiores sucessos e prepara o terreno para o primeiro álbum.", f:["qobuz"]},
  {a:"2020", t:"Máquina do Tempo", x:"Lançado em 10 de setembro, o primeiro álbum tem 7 faixas e a melhor estreia da época no Spotify Brasil.", f:["wikiMdT","agazeta"]},
  {a:"2021–2023", t:"Singles e expansão", x:"“Quer Voar” (2021) e “Conexões de Máfia” (2023), esta com Rich the Kid, ampliam o alcance do artista.", f:["qobuz"]},
  {a:"2024", t:"Sabor Overdose no Yakisoba e 333", x:"Em 5 de agosto, um EP surpresa encerra a fase com a Sony. Em 9 de setembro chega o 333, que registra mais de 16 milhões de plays em 24 horas.", f:["wiki333","rs333","bbFake"]},
  {a:"2025", t:"XTRANHO", x:"Lançado em dezembro, com 13 faixas, o álbum retoma o trap e reúne artistas do underground.", f:["bbX","rsX"]},
  {a:"2026", t:"Rock in Rio Lisboa", x:"Em 28 de junho, Matuê é o primeiro rapper brasileiro no Palco Mundo do festival em Portugal.", f:["lisboa"]},
  {a:"Em breve", t:"Próximas atualizações", x:"Espaço reservado para novos marcos, que só devem entrar com fonte verificada.", f:[]}
];

const CURIOSIDADES = [
 {t:"Lançamento às 3:33", x:"O 333 foi lançado em 9/9/2024 às 15h33, depois de uma contagem regressiva no Vale do Anhangabaú, em São Paulo.", f:["wiki333"]},
  {t:"O “álbum falso”", x:"Dias antes do 333, Matuê publicou uma playlist de 24 faixas curtas, sem música, que ficou conhecida como “álbum falso”.", f:["bbFake"]},
  {t:"Primeira faixa em inglês", x:"“Like This!”, faixa bônus do 333, foi a primeira música que ele cantou em inglês.", f:["wiki333"]},
  {t:"Um disco circular", x:"Segundo a crítica da época, a última faixa de Máquina do Tempo leva de volta à primeira, formando um ciclo.", f:["agazeta"]},
  {t:"XTRANHO em 4 meses", x:"O álbum foi criado em quatro meses, em um “camping criativo” que reuniu músicos, produtores e designers.", f:["bbX"]},
  {t:"Identidade NPC", x:"Nos shows da fase XTRANHO, a identidade visual usa a sigla NPC, que significa “Não Passa Credibilidade”.", f:["lisboa"]}
];

// tipo: Álbum | EP | Single. faixas: [titulo, participacao]. Links exatos de álbum/faixa não verificados -> busca.
const PROJETOS = [
 {id:"mdt", tipo:"Álbum", nome:"Máquina do Tempo", ano:"2020", data:"10 de setembro de 2020", cor:"linear-gradient(135deg,#8a2bff,#2b7bff)",
   desc:"Primeiro álbum de estúdio, com produção de Matuê, WIU, Pedro Lotto e Celo. Lançado pela 30PRAUM com distribuição da Sony Music.",
   faixas:[["Cogulândia"],["Antes"],["Gorila Roxo"],["Vem Chapar"],["777-666"],["É Sal"],["Máquina do Tempo"]], f:["wikiMdT","agazeta"]},
  {id:"333", tipo:"Álbum", nome:"333", ano:"2024", data:"9 de setembro de 2024", cor:"linear-gradient(135deg,#ff2bd6,#8a2bff)",
   desc:"Segundo álbum, independente, produzido por Matuê, Brandão85 e Samuel Batista. Mistura trap, psicodelia, R&B e rock.",
   faixas:[["Crack com Mussilon"],["Imagina esse Cenário","Veigh"],["Isso é Sério","Brandão85"],["1993"],["4Tal","Teto"],["O Som"],["04AM"],["Castlevania"],["V de Vilão"],["Maria"],["333"],["Like This!"]], f:["wiki333","rs333"]},
  {id:"xtr", tipo:"Álbum", nome:"XTRANHO", ano:"2025", data:"dezembro de 2025", cor:"linear-gradient(135deg,#2b7bff,#ff2bd6)",
   desc:"Terceiro álbum, com 13 faixas e volta ao trap. Participações de Kouth, Cashley, LPT Zlatan, Brandão85, N.A.N.A., Phl Notunrboy, FAB GODAMN e Okie. Abaixo, só as faixas que consegui confirmar; veja a lista completa no Spotify.",
   faixas:[["Rei Tuê"],["Talking Bout"],["Meu Cemitério"],["Pensamentos Perigosos","LPT Zlatan"],["Ícone Fashion","Kouth"]], f:["bbX","rsX"]},
  {id:"sab", tipo:"EP", nome:"Sabor Overdose no Yakisoba", ano:"2024", data:"5 de agosto de 2024", cor:"linear-gradient(135deg,#ff4f8b,#2b7bff)",
   desc:"EP surpresa que encerrou a fase com a Sony Music, com críticas ao mercado musical. Faixa confirmada abaixo.",
   faixas:[["Reza do Milhão"]], f:["wiki333"]},
  {id:"rbn", tipo:"Single", nome:"RBN", ano:"2016", data:"2016", cor:"linear-gradient(135deg,#8a2bff,#ff2bd6)", desc:"Single que o colocou no mapa do trap nacional.", faixas:[["RBN"]], f:["qobuz"]},
  {id:"anos", tipo:"Single", nome:"Anos Luz", ano:"2017", data:"2017", cor:"linear-gradient(135deg,#2b7bff,#8a2bff)", desc:"Um dos singles marcantes de 2017.", faixas:[["Anos Luz"]], f:["wikiBio"]},
  {id:"kenny", tipo:"Single", nome:"Kenny G", ano:"2019", data:"2019", cor:"linear-gradient(135deg,#ff2bd6,#2b7bff)", desc:"Um dos maiores sucessos do artista.", faixas:[["Kenny G"]], f:["qobuz"]},
  {id:"voar", tipo:"Single", nome:"Quer Voar", ano:"2021", data:"2021", cor:"linear-gradient(135deg,#8a2bff,#2b7bff)", desc:"Single de 2021, que entrou em lista da Billboard.", faixas:[["Quer Voar"]], f:["qobuz","wikiBio"]},
  {id:"mafia", tipo:"Single", nome:"Conexões de Máfia", ano:"2023", data:"2023", cor:"linear-gradient(135deg,#ff2bd6,#8a2bff)", desc:"Colaboração com o rapper americano Rich the Kid.", faixas:[["Conexões de Máfia","Rich the Kid"]], f:["qobuz","wikiBio"]}
];

const COLABS = [
 {faixa:"Conexões de Máfia", com:"Rich the Kid", ano:"2023"},
  {faixa:"Imagina esse Cenário", com:"Veigh", ano:"2024"},
  {faixa:"Isso é Sério", com:"Brandão85", ano:"2024"},
  {faixa:"4Tal", com:"Teto", ano:"2024"},
  {faixa:"Pensamentos Perigosos", com:"LPT Zlatan", ano:"2025"},
  {faixa:"Ícone Fashion", com:"Kouth", ano:"2025"}
];
