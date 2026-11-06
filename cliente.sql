CREATE TABLE cliente 
( 
 id INT PRIMARY KEY AUTO_INCREMENT,  
 nome VARCHAR(100) NOT NULL,  
 cpf CHAR(14) NOT NULL UNIQUE,  
 celular CHAR(14) NOT NULL,  
 email VARCHAR(100) NOT NULL UNIQUE,  
 senha VARCHAR(512) NOT NULL
); 
DROP TABLE cliente;

INSERT INTO cliente (
    nome, cpf, celular, email, senha
) VALUES (
    "Patrick Staroin", "111.222.333-66", 
    "(42)99999-4444", "patrick@gmail.com",
    "EAUHEAUISHEUIEAIS"
);

IINSERT INTO cliente (nome, cpf, celular, email, senha) VALUES 
('Ana Beatriz Ferreira', '123.456.789-01', '(11)98888-1111', 'ana.ferreira@email.com', 'ANABIA2024'),
('Carlos Eduardo Souza', '234.567.890-12', '(21)98777-2222', 'carlos.souza@email.com', 'CARLOSE84'),
('Mariana Oliveira Lima', '345.678.901-23', '(31)98666-3333', 'mariana.lima@email.com', 'MARIANA123'),
('João Pedro Almeida', '456.789.012-34', '(41)98555-4444', 'joao.almeida@email.com', 'JOAOPEDRO7'),
('Fernanda Costa Ribeiro', '567.890.123-45', '(51)98444-5555', 'fernanda.ribeiro@email.com', 'FEFER2024'),
('Ricardo Santos Barbosa', '678.901.234-56', '(61)98333-6666', 'ricardo.barbosa@email.com', 'RICARDOS9'),
('Juliana Martins Rocha', '789.012.345-67', '(71)98222-7777', 'juliana.rocha@email.com', 'JULIMART5'),
('Bruno Henrique Cardoso', '890.123.456-78', '(81)98111-8888', 'bruno.cardoso@email.com', 'BRUNOHC10'),
('Camila Alves Nascimento', '901.234.567-89', '(91)98000-9999', 'camila.nascimento@email.com', 'CAMILA2024'),
('Thiago Moreira Pinto', '012.345.678-90', '(12)97999-1010', 'thiago.pinto@email.com', 'THIAGOMP1');

SELECT email, senha FROM cliente;

SELECT email, senha FROM cliente 
WHERE email = "ricardo.barbosa@email.com";

SELECT * FROM cliente WHERE id <= 30 AND LENGTH(senha) > 20;

SELECT * FROM cliente;

DELETE FROM cliente WHERE id = 37;

UPDATE cliente 
SET nome = "Patrick Staroin", email = "p@gmail.com" 
WHERE id = 35;