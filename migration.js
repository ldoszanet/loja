const db = require("./db")

const ESTRUTURA_CLIENTE = `
    DROP TABLE IF EXISTS cliente;
    CREATE TABLE cliente (
        id int(11) NOT NULL AUTO_INCREMENT,
        nome varchar(100) NOT NULL,
        cpf char(14) NOT NULL,
        celular char(14) NOT NULL,
        email varchar(100) NOT NULL,
        senha varchar(512) NOT NULL,
        PRIMARY KEY (id),
        UNIQUE KEY cpf (cpf),
        UNIQUE KEY email (email)
    ) ENGINE=InnoDB AUTO_INCREMENT=39 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`

const DADOS_CLIENTE = `
    INSERT INTO cliente VALUES 
        (12,'Nicolas Galvão','123.456.789-00','(42)99966-4444','galvao@gmail.com','$2b$10$N8b2YuzXWdMJVAAd670qG.ScLlmdFsuTJ7C6/GWtMKWhj8O0pU6Pu'),(13,'Nicolas Galvão','123.456.789-02','(42)99966-4444','galvao2@gmail.com','$2b$10$rNwWgUx8kezhoZXXuVG7NeBXqPFAzpkc37Sg4P.ETVtiSaWWqBHxy'),
        (14,'Patrick','123.123.123-12','(42)999669966','patrick123@gmail.com','$2b$10$MZMnDj10f7JnV6ArP.5hm.TAHDZ5NwECYSw6i5kbNowwhPuqbC/W.'),(19,'Richard','148.211.069-57','(42) 99931-865','bellusci.richard@escola.pr.gov.br','$2b$10$v3aTKV7iVqrcBJozlOZwie8I7yO2CyQIfuVk4uxR2RSDPELZSeyxS'),
        (28,'Patrick','111.222.333-49','(42)99999-4444','patrick67@gmail.com','$2b$10$QRU70xwZs0JYccsQcf/BFe7IIGYaqlS0xb.TIkGsv7UKviM2A26pq'),(29,'Kauã silva de lima','152.915.999-79','(42)99999-4444','kaua.lima11@escola.pr.gov.br','$2b$10$Ax80a.N/1RUsBU48IO1hX.d4hyiNt/15aV8.8VJuPziVuzTwGe8ly'),
        (30,'Bruno','120.897.429-76','(42)99830-3607','derbli@gmail.com','$2b$10$t8fYQCnQRXxvbLczF6YJNu31UvNT1qWhZ1r9GiftnFLy1rABdFKfG'),(31,'Guilherme','111.333.444-78','(42)55555-9999','poisler456@gmail.com','$2b$10$r9QmvPFklIeeoCoHfISzGeJNnjScdYm4JZiNBmffsblVzk48uyHXa'),
        (32,'Rhuan','137.604.709-80','(42)99999-4444','rhuan@gmail.com','$2b$10$QA3mNPH90POZijUIri.hKO5pQQH223KGKyYOYycQA0GtPuKGhPrkS');
`

const ESTRUTURA_PRODUTO = `
    DROP TABLE IF EXISTS produto;
    CREATE TABLE produto (
        id int(11) NOT NULL AUTO_INCREMENT,
        nome varchar(200) NOT NULL,
        descricao text NOT NULL,
        categoria varchar(50) NOT NULL,
        preco decimal(10,2) NOT NULL,
        caminho_img varchar(50) NOT NULL,
        quantidade_img int(11) NOT NULL,
        PRIMARY KEY (id)
    ) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
`

const DADOS_PRODUTO = `
    INSERT INTO produto VALUES 
        (1,'Violão Acústico Nylon','Violão acústico com cordas de nylon, tampo em spruce, ideal para iniciantes e música clássica.','Cordas',599.90,'assets/img/violao-acustico.jpg',12),(2,'Guitarra Elétrica Stratocaster','Guitarra elétrica estilo Stratocaster, 3 captadores single-coil, corpo em álamo e braço em maple.','Cordas',1899.90,'assets/img/guitarra-stratocaster.jpg',6),(3,'Baixo Elétrico 4 Cordas','Baixo elétrico de 4 cordas, corpo em basswood, captador passivo, ideal para rock e pop.','Cordas',1499.90,'assets/img/baixo-eletrico.jpg',5),(4,'Violão Folk Aço','Violão folk com cordas de aço, tampo em spruce e fundo em mogno, som brilhante.','Cordas',799.90,'assets/img/violao-folk.jpg',9),(5,'Cavaquinho Profissional','Cavaquinho com tampo em spruce e fundo em jacarandá, som típico do samba e choro.','Cordas',449.90,'assets/img/cavaquinho.jpg',7),
        (6,'Teclado Sintetizador 61 Teclas','Teclado sintetizador com 61 teclas sensíveis ao toque, mais de 500 sons e conexão MIDI.','Teclas',1299.90,'assets/img/teclado-sintetizador.jpg',8),(7,'Piano Digital 88 Teclas','Piano digital com 88 teclas com ação martelo, sons de piano acústico e conexão USB.','Teclas',3499.90,'assets/img/piano-digital.jpg',4),(8,'Controlador MIDI 25 Teclas','Controlador MIDI compacto com 25 teclas, pads e knobs, ideal para produção musical.','Teclas',699.90,'assets/img/controlador-midi.jpg',10),(9,'Acordeon 48 Baixos','Acordeon com 48 baixos, 26 teclas, ideal para iniciantes em forró e música regional.','Teclas',2199.90,'assets/img/acordeon.jpg',3),
        (10,'Bateria Acústica Completa','Bateria acústica com bumbo, caixa, tons, surdos e ferragens, pronta para palco.','Percussão',2899.90,'assets/img/bateria-acustica.jpg',4),(11,'Bateria Eletrônica','Bateria eletrônica com pads de borracha, 20 kits de som e saída para fones.','Percussão',1999.90,'assets/img/bateria-eletronica.jpg',6),(12,'Cajón Acústico','Cajón em madeira com cordas internas, som percussivo versátil para acoustic e flamenco.','Percussão',349.90,'assets/img/cajon.jpg',10),(13,'Pandeiro Profissional','Pandeiro com pele sintética e platinelas em aço, som nítido e resposta rápida.','Percussão',189.90,'assets/img/pandeiro.jpg',15),(14,'Congas Par','Par de congas em madeira com pele natural, ideal para ritmos latinos.','Percussão',899.90,'assets/img/congas.jpg',5),
        (15,'Flauta Transversal Doce','Flauta transversal em níquel prateado, chaves fechadas, ideal para estudantes.','Sopro',549.90,'assets/img/flauta-transversal.jpg',8),(16,'Saxofone Alto','Saxofone alto em latão lacrado, chaves ergonômicas, som encorpado.','Sopro',2899.90,'assets/img/saxofone-alto.jpg',3),(17,'Trompete Sib','Trompete em Sib, latão dourado, pistões suaves, ideal para bandas e orquestras.','Sopro',1299.90,'assets/img/trompete.jpg',6),(18,'Gaita Diatônica','Gaita diatônica em dó maior, 10 furos, reed em latão, ideal para blues e folk.','Sopro',149.90,'assets/img/gaita-diatonica.jpg',20),
        (19,'Amplificador Guitarra 50W','Amplificador para guitarra com 50W, dois canais, equalização e reverb.','Áudio',899.90,'assets/img/amplificador-guitarra.jpg',7),(20,'Amplificador Baixo 100W','Amplificador para baixo com 100W, falante de 12 polegadas e controle de ganho.','Áudio',1199.90,'assets/img/amplificador-baixo.jpg',5),(21,'Mesa de Som 8 Canais','Mesa de som com 8 canais, equalização de 3 vias e saída para monitor.','Áudio',1599.90,'assets/img/mesa-som.jpg',4),(22,'Microfone Condensador','Microfone condensador para estúdio, padrão cardióide, ideal para vocais e instrumentos.','Áudio',499.90,'assets/img/microfone-condensador.jpg',10),(23,'Interface de Áudio USB','Interface de áudio USB com 2 entradas, pré-amps e saída para monitor.','Áudio',799.90,'assets/img/interface-audio.jpg',8),
        (24,'Cabo de Instrumento 3m','Cabo P10 para instrumentos, 3 metros, blindagem contra ruídos.','Acessórios',49.90,'assets/img/cabo-instrumento.jpg',30),(25,'Palhetas de Guitarra Kit','Kit com 12 palhetas de guitarra em diferentes espessuras.','Acessórios',29.90,'assets/img/palhetas.jpg',40),(26,'Suporte para Violão','Suporte de chão para violão e guitarra, estrutura em metal com espuma protetora.','Acessórios',79.90,'assets/img/suporte-violao.jpg',18),(27,'Afinador Digital Clip','Afinador digital de clip para violão, guitarra e baixo, com display LCD.','Acessórios',39.90,'assets/img/afinador.jpg',25),(28,'Capa para Guitarra','Capa acolchoada para guitarra elétrica com alças e bolsos.','Acessórios',129.90,'assets/img/capa-guitarra.jpg',14),(29,'Encordoamento Guitarra','Jogo de cordas para guitarra elétrica, calibre 009, aço niquelado.','Acessórios',59.90,'assets/img/encordoamento-guitarra.jpg',22),
        (30,'Estante para Partituras','Estante de partituras em metal dobrável, ajuste de altura e inclinação.','Acessórios',89.90,'assets/img/estante-partitura.jpg',16),(31,'Metrônomo Digital','Metrônomo digital com batidas de 30 a 250 BPM, saída para fones.','Acessórios',69.90,'assets/img/metronomo.jpg',20),(32,'Pedal de Efeito Overdrive','Pedal de overdrive para guitarra, controle de drive, tone e level.','Acessórios',299.90,'assets/img/pedal-overdrive.jpg',9),(33,'Fonte para Pedais','Fonte de alimentação para pedais de efeito, 8 saídas isoladas.','Acessórios',249.90,'assets/img/fonte-pedais.jpg',7),
        (34,'Violino 4/4 Estudante','Violino tamanho 4/4 em madeira, com arco e estojo incluso.','Cordas',699.90,'assets/img/violino.jpg',6),(35,'Violoncelo 4/4','Violoncelo em madeira com arco e capa, ideal para estudantes avançados.','Cordas',1899.90,'assets/img/violoncelo.jpg',3),(36,'Ukulele Soprano','Ukulele soprano em madeira, 4 cordas de nylon, ideal para iniciantes.','Cordas',249.90,'assets/img/ukulele.jpg',12),
        (37,'DJ Controller 2 Canais','Controlador DJ com 2 canais, jog wheels e efeitos, compatível com software.','DJ',1799.90,'assets/img/dj-controller.jpg',4),(38,'Fone de Ouvido Monitor','Fone de ouvido de estúdio, fechado, resposta plana, ideal para mixagem.','Áudio',399.90,'assets/img/fone-monitor.jpg',10),(39,'Caixa de Som Ativa 12"','Caixa de som ativa de 12 polegadas, 300W, ideal para pequenos eventos.','Áudio',1299.90,'assets/img/caixa-som.jpg',6),
        (40,'Partitura - Método de Violão','Livro método de violão para iniciantes, com exercícios e músicas.','Livros',59.90,'assets/img/metodo-violao.jpg',20),(41,'Partitura - Método de Piano','Livro método de piano com teoria e prática para nível básico.','Livros',69.90,'assets/img/metodo-piano.jpg',18),(42,'Caderno de Música Pautado','Caderno de música com pautas, 100 folhas, formato A4.','Papelaria',29.90,'assets/img/caderno-pautado.jpg',30),
        (43,'Luthier Kit de Manutenção','Kit de manutenção para instrumentos de corda, com chaves e panos.','Acessórios',119.90,'assets/img/kit-luthier.jpg',8),(44,'Capotraste Violão','Capotraste para violão em metal, ajuste rápido e pressão uniforme.','Acessórios',49.90,'assets/img/capotraste.jpg',25),(45,'Correia para Guitarra','Correia acolchoada para guitarra e baixo, ajuste de comprimento.','Acessórios',39.90,'assets/img/correia-guitarra.jpg',22),
        (46,'Pedestal para Microfone','Pedestal de chão para microfone, altura ajustável e base giratória.','Acessórios',89.90,'assets/img/pedestal-microfone.jpg',15),(47,'Pop Filter para Microfone','Filtro pop para microfone, reduz plosivas e ruídos de vento.','Acessórios',49.90,'assets/img/pop-filter.jpg',18),(48,'Cabo XLR 5m','Cabo XLR balanceado de 5 metros para microfones e mesas de som.','Acessórios',59.90,'assets/img/cabo-xlr.jpg',20),(49,'Bag para Pedais','Bag para pedais de efeito, com divisórias e alça reforçada.','Acessórios',149.90,'assets/img/bag-pedais.jpg',10);
`

async function criar_tabelas() {
    const connection = await db.pool.getConnection();
    try {
        await connection.beginTransaction();

        console.log("Criando tabela 'cliente'...");
        await connection.query(ESTRUTURA_CLIENTE);
        await connection.query(DADOS_CLIENTE);

        console.log("Criando tabela 'produto'...");
        await connection.query(ESTRUTURA_PRODUTO);
        await connection.query(DADOS_PRODUTO);         

        await connection.commit();
        console.log("Migration executada com sucesso!");
        process.exit(0);
    } catch (error) {
        await connection.rollback();
        console.log(error)
        process.exit(1);
    } finally {
        connection.release();
    }
}
criar_tabelas()
